from typing import Any, List, Optional
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy import or_, select
from sqlalchemy.orm import Session, joinedload

from src.database import get_db
from src.models import (
    CatalogoAsic,
    CatalogoCargo,
    CatalogoEstatus,
    CatalogoEstatusContrato,
    CatalogoUbicacionFisica,
    DatosLaborales,
    SaludDotacion,
    Trabajador,
    UbicacionLaboral,
)

router = APIRouter(prefix="/reportes", tags=["Reportes Dinámicos"])


class ReglaFiltro(BaseModel):
    campo: str
    operador: str  # "igual", "contiene", "mayor_que", "menor_que"
    valor: Any


class BusquedaAvanzadaPayload(BaseModel):
    busqueda_libre: Optional[str] = None
    estatus_ids: List[int] = []
    cargo_ids: List[int] = []
    reglas: List[ReglaFiltro] = []


# Diccionario blanco (Whitelist) de campos permitidos para el constructor dinámico
MAPA_CAMPOS_DINAMICOS = {
    "cedula": Trabajador.cedula,
    "sexo": Trabajador.sexo,
    "estado_civil": Trabajador.estado_civil,
    "codigo_rac": DatosLaborales.codigo_rac,
    "carga_horaria": DatosLaborales.carga_horaria,
    "id_estatus_contrato": DatosLaborales.id_estatus_contrato,
    "id_asic": UbicacionLaboral.id_asic,
    "id_ubicacion_fisica": UbicacionLaboral.id_ubicacion_fisica,
    "talla_camisa": SaludDotacion.talla_camisa,
    "talla_pantalon": SaludDotacion.talla_pantalon,
    "talla_zapatos": SaludDotacion.talla_zapatos,
    "patologias": SaludDotacion.patologias,
}


@router.post("/buscar")
def buscar_trabajadores_dinamico(
    payload: BusquedaAvanzadaPayload, db: Session = Depends(get_db)
):
    # 1. Consulta base uniendo tablas 1 a 1 y catálogos clave
    query = (
        select(
            Trabajador,
            CatalogoEstatus.nombre_estatus,
            CatalogoCargo.nombre_cargo,
            CatalogoEstatusContrato.opciones_contrato,
            CatalogoUbicacionFisica.nombre_ubicacion_fisica,
            CatalogoAsic.nombre_asic,
        )
        .outerjoin(CatalogoEstatus, Trabajador.id_estatus == CatalogoEstatus.id_estatus)
        .outerjoin(DatosLaborales, Trabajador.id_trabajador == DatosLaborales.id_trabajador)
        .outerjoin(CatalogoCargo, DatosLaborales.id_cargo == CatalogoCargo.id_cargo)
        .outerjoin(
            CatalogoEstatusContrato,
            DatosLaborales.id_estatus_contrato == CatalogoEstatusContrato.id_estatus_contrato,
        )
        .outerjoin(UbicacionLaboral, Trabajador.id_trabajador == UbicacionLaboral.id_trabajador)
        .outerjoin(
            CatalogoUbicacionFisica,
            UbicacionLaboral.id_ubicacion_fisica == CatalogoUbicacionFisica.id_ubicacion_fisica,
        )
        .outerjoin(CatalogoAsic, UbicacionLaboral.id_asic == CatalogoAsic.id_asic)
        .outerjoin(SaludDotacion, Trabajador.id_trabajador == SaludDotacion.id_trabajador)
        .options(
            joinedload(Trabajador.datos_laborales),
            joinedload(Trabajador.ubicacion_laboral),
            joinedload(Trabajador.salud_dotacion),
            joinedload(Trabajador.hijos),
            joinedload(Trabajador.vacaciones),
        )
    )

    # 2. Aplicar Chips Rápidos (OR dentro de la misma categoría, AND entre categorías)
    if payload.estatus_ids:
        query = query.where(Trabajador.id_estatus.in_(payload.estatus_ids))

    if payload.cargo_ids:
        query = query.where(DatosLaborales.id_cargo.in_(payload.cargo_ids))

    # 3. Aplicar Búsqueda Libre por palabras (ej: "Perez Enfermero")
    if payload.busqueda_libre and payload.busqueda_libre.strip():
        palabras = payload.busqueda_libre.strip().split()
        for palabra in palabras:
            patron = f"%{palabra}%"
            query = query.where(
                or_(
                    Trabajador.cedula.ilike(patron),
                    Trabajador.nombre_1.ilike(patron),
                    Trabajador.apellido_1.ilike(patron),
                    CatalogoCargo.nombre_cargo.ilike(patron),
                    CatalogoEstatus.nombre_estatus.ilike(patron),
                    CatalogoUbicacionFisica.nombre_ubicacion_fisica.ilike(patron),
                )
            )

    # 4. Aplicar Reglas Dinámicas Avanzadas
    for regla in payload.reglas:
        columna = MAPA_CAMPOS_DINAMICOS.get(regla.campo)
        if not columna or regla.valor in ("", None):
            continue

        if regla.operador == "igual":
            query = query.where(columna == regla.valor)
        elif regla.operador == "contiene":
            query = query.where(columna.ilike(f"%{regla.valor}%"))
        elif regla.operador == "mayor_que":
            query = query.where(columna > regla.valor)
        elif regla.operador == "menor_que":
            query = query.where(columna < regla.valor)

    resultados = db.execute(query).unique().all()

    # 5. Serializar respuesta plana lista para la tabla dinámica y PDF
    respuesta = []
    for row in resultados:
        t: Trabajador = row[0]
        lab = t.datos_laborales
        ubi = t.ubicacion_laboral
        sal = t.salud_dotacion

        respuesta.append({
            "id_trabajador": t.id_trabajador,
            "cedula": f"{t.nacionalidad}-{t.cedula}",
            "nombre_completo": f"{t.nombre_1} {t.nombre_2 or ''} {t.apellido_1} {t.apellido_2 or ''}".replace("  ", " ").strip(),
            "sexo": t.sexo,
            "estado_civil": t.estado_civil,
            "telefono": t.telefono or "-",
            "correo": t.correo or "-",
            "estatus_actividad": row.nombre_estatus or "-",
            "codigo_rac": lab.codigo_rac if lab else "-",
            "carga_horaria": lab.carga_horaria if lab else "-",
            "nombre_cargo": row.nombre_cargo or "-",
            "opciones_contrato": row.opciones_contrato or "-",
            "nombre_ubicacion_fisica": row.nombre_ubicacion_fisica or "-",
            "nombre_asic": row.nombre_asic or "-",
            "talla_camisa": sal.talla_camisa if sal else "-",
            "talla_pantalon": sal.talla_pantalon if sal else "-",
            "talla_zapatos": sal.talla_zapatos if sal else "-",
            "patologias": sal.patologias if sal else "-",
            "cantidad_hijos": len(t.hijos),
            "cantidad_vacaciones": len(t.vacaciones),
        })

    return respuesta
