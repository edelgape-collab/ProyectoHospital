from fastapi import HTTPException, status
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from sqlalchemy.orm import Session
from src.models.trabajador_model import (
    DatosLaborales,
    Hijo,
    SaludDotacion,
    Trabajador,
    UbicacionLaboral,
    Vacacion,
)
from src.models.vista_model import VistaConsolidadoTrabajador
from src.schemas.trabajador_schema import TrabajadorCompletoCreate


def crear_trabajador_completo(db: Session, payload: TrabajadorCompletoCreate) -> Trabajador:
    try:
        # 1. Instanciar tabla principal: trabajador
        nuevo_trabajador = Trabajador(
            nacionalidad=payload.nacionalidad,
            cedula=payload.cedula,
            nombre_1=payload.nombre_1,
            nombre_2=payload.nombre_2,
            apellido_1=payload.apellido_1,
            apellido_2=payload.apellido_2,
            fecha_nacimiento=payload.fecha_nacimiento,
            sexo=payload.sexo,
            estado_civil=payload.estado_civil,
            direccion_habitacion=payload.direccion_habitacion,
            telefono=payload.telefono,
            correo=payload.correo,
            centro_votacion=payload.centro_votacion,
            observaciones=payload.observaciones,
            id_estatus=payload.id_estatus,
        )
        db.add(nuevo_trabajador)
        # flush() envía el INSERT a MariaDB para obtener el id_trabajador generado sin cerrar la transacción
        db.flush()

        # 2. Instanciar tabla: datos_laborales
        datos_lab = DatosLaborales(
            id_trabajador=nuevo_trabajador.id_trabajador,
            **payload.datos_laborales.model_dump(),
        )
        db.add(datos_lab)

        # 3. Instanciar tabla: ubicacion_laboral
        ubicacion_lab = UbicacionLaboral(
            id_trabajador=nuevo_trabajador.id_trabajador,
            **payload.ubicacion_laboral.model_dump(),
        )
        db.add(ubicacion_lab)

        # 4. Instanciar tabla: salud_dotacion
        salud_dot = SaludDotacion(
            id_trabajador=nuevo_trabajador.id_trabajador,
            **payload.salud_dotacion.model_dump(),
        )
        db.add(salud_dot)

        # 5. Instanciar tabla: hijos (0 o muchos)
        for hijo_data in payload.hijos:
            db.add(
                Hijo(
                    id_trabajador=nuevo_trabajador.id_trabajador,
                    **hijo_data.model_dump(),
                )
            )

        # 6. Instanciar tabla: vacaciones (0 o muchas)
        for vac_data in payload.vacaciones:
            db.add(
                Vacacion(
                    id_trabajador=nuevo_trabajador.id_trabajador,
                    **vac_data.model_dump(),
                )
            )

        # Confirmar atómicamente las 6 tablas
        db.commit()
        db.refresh(nuevo_trabajador)
        return nuevo_trabajador

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error de integridad en los datos (cédula/correo duplicado o ID de catálogo inválido): {str(e.orig)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno de base de datos al guardar el trabajador: {str(e)}",
        )


def obtener_consolidado_trabajadores(db: Session, skip: int = 0, limit: int = 100):
    return db.query(VistaConsolidadoTrabajador).offset(skip).limit(limit).all()


def obtener_consolidado_por_cedula(db: Session, cedula: str):
    resultados = (
        db.query(VistaConsolidadoTrabajador)
        .filter(VistaConsolidadoTrabajador.cedula == cedula)
        .all()
    )
    if not resultados:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No se encontró ningún trabajador con la cédula {cedula}",
        )
    return resultados



def obtener_trabajador_detalle(db: Session, id_trabajador: int) -> dict:
    trabajador = db.query(Trabajador).filter(Trabajador.id_trabajador == id_trabajador).first()
    if not trabajador:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trabajador con ID {id_trabajador} no encontrado",
        )

    datos_lab = db.query(DatosLaborales).filter(DatosLaborales.id_trabajador == id_trabajador).first()
    ubicacion_lab = db.query(UbicacionLaboral).filter(UbicacionLaboral.id_trabajador == id_trabajador).first()
    salud_dot = db.query(SaludDotacion).filter(SaludDotacion.id_trabajador == id_trabajador).first()
    hijos = db.query(Hijo).filter(Hijo.id_trabajador == id_trabajador).all()
    vacaciones = db.query(Vacacion).filter(Vacacion.id_trabajador == id_trabajador).all()

    return {
        "id_trabajador": trabajador.id_trabajador,
        "nacionalidad": trabajador.nacionalidad,
        "cedula": trabajador.cedula,
        "nombre_1": trabajador.nombre_1,
        "nombre_2": trabajador.nombre_2,
        "apellido_1": trabajador.apellido_1,
        "apellido_2": trabajador.apellido_2,
        "fecha_nacimiento": str(trabajador.fecha_nacimiento) if trabajador.fecha_nacimiento else "",
        "sexo": trabajador.sexo,
        "estado_civil": trabajador.estado_civil,
        "direccion_habitacion": trabajador.direccion_habitacion,
        "telefono": trabajador.telefono,
        "correo": trabajador.correo,
        "centro_votacion": trabajador.centro_votacion,
        "observaciones": trabajador.observaciones,
        "id_estatus": trabajador.id_estatus,
        "datos_laborales": {
            "codigo_rac": datos_lab.codigo_rac if datos_lab else None,
            "carga_horaria": datos_lab.carga_horaria if datos_lab else None,
            "fecha_ingreso_apn": str(datos_lab.fecha_ingreso_apn) if datos_lab and datos_lab.fecha_ingreso_apn else "",
            "fecha_ingreso_mpps": str(datos_lab.fecha_ingreso_mpps) if datos_lab and datos_lab.fecha_ingreso_mpps else "",
            "id_horario": datos_lab.id_horario if datos_lab else None,
            "id_estatus_contrato": datos_lab.id_estatus_contrato if datos_lab else None,
            "id_cargo": datos_lab.id_cargo if datos_lab else None,
            "id_nivel_grado": datos_lab.id_nivel_grado if datos_lab else None,
        },
        "ubicacion_laboral": {
            "id_ubicacion_administrativa": ubicacion_lab.id_ubicacion_administrativa if ubicacion_lab else None,
            "id_ubicacion_fisica": ubicacion_lab.id_ubicacion_fisica if ubicacion_lab else None,
            "id_asic": ubicacion_lab.id_asic if ubicacion_lab else None,
            "id_red": ubicacion_lab.id_red if ubicacion_lab else None,
        },
        "salud_dotacion": {
            "talla_pantalon": salud_dot.talla_pantalon if salud_dot else "",
            "talla_camisa": salud_dot.talla_camisa if salud_dot else "",
            "talla_zapatos": salud_dot.talla_zapatos if salud_dot else None,
            "patologias": salud_dot.patologias if salud_dot else "",
            "tratamiento": salud_dot.tratamiento if salud_dot else "",
        },
        "hijos": [
            {
                "nombre1_hijo": h.nombre1_hijo,
                "nombre2_hijo": h.nombre2_hijo,
                "apellido1_hijo": h.apellido1_hijo,
                "apellido2_hijo": h.apellido2_hijo,
                "fecha_nacimiento_hijo": str(h.fecha_nacimiento_hijo) if h.fecha_nacimiento_hijo else None,
                "nacionalidad_hijo": h.nacionalidad_hijo,
                "cedula_hijo": h.cedula_hijo,
                "sexo_hijo": h.sexo_hijo,
            }
            for h in hijos
        ],
        "vacaciones": [
            {
                
                "periodos_vencidos": v.periodos_vencidos,
                "ultimo_disfrutado": v.ultimo_disfrutado,
                "fecha_solicitud": str(v.fecha_solicitud) if v.fecha_solicitud else None,
                "tipo_vacaciones": str(v.tipo_vacaciones) if v.tipo_vacaciones else None,
                "fecha_inicio_disfrute": str(v.fecha_inicio_disfrute) if v.fecha_inicio_disfrute else None,
                "fecha_fin_disfrute": str(v.fecha_fin_disfrute) if v.fecha_fin_disfrute else None,
                "notas_vacaciones": str(v.notas_vacaciones) if v.notas_vacaciones else None,
                "id_vacaciones": str(v.id_vacaciones) if v.id_vacaciones else None,
            }
            for v in vacaciones
        ],
    }




def actualizar_trabajador_completo(
    db: Session, id_trabajador: int, payload: TrabajadorCompletoCreate
) -> Trabajador:
    trabajador = db.query(Trabajador).filter(Trabajador.id_trabajador == id_trabajador).first()
    if not trabajador:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trabajador con ID {id_trabajador} no encontrado",
        )

    try:
        # 1. Actualizar tabla principal
        trabajador.nacionalidad = payload.nacionalidad
        trabajador.cedula = payload.cedula
        trabajador.nombre_1 = payload.nombre_1
        trabajador.nombre_2 = payload.nombre_2
        trabajador.apellido_1 = payload.apellido_1
        trabajador.apellido_2 = payload.apellido_2
        trabajador.fecha_nacimiento = payload.fecha_nacimiento
        trabajador.sexo = payload.sexo
        trabajador.estado_civil = payload.estado_civil
        trabajador.direccion_habitacion = payload.direccion_habitacion
        trabajador.telefono = payload.telefono
        trabajador.correo = payload.correo
        trabajador.centro_votacion = payload.centro_votacion
        trabajador.observaciones = payload.observaciones
        trabajador.id_estatus = payload.id_estatus

        # 2. Actualizar sub-tablas 1 a 1
        datos_lab = db.query(DatosLaborales).filter(DatosLaborales.id_trabajador == id_trabajador).first()
        if datos_lab:
            for k, v in payload.datos_laborales.model_dump().items():
                setattr(datos_lab, k, v)

        ubicacion_lab = db.query(UbicacionLaboral).filter(UbicacionLaboral.id_trabajador == id_trabajador).first()
        if ubicacion_lab:
            for k, v in payload.ubicacion_laboral.model_dump().items():
                setattr(ubicacion_lab, k, v)

        salud_dot = db.query(SaludDotacion).filter(SaludDotacion.id_trabajador == id_trabajador).first()
        if salud_dot:
            for k, v in payload.salud_dotacion.model_dump().items():
                setattr(salud_dot, k, v)

        # 3. Sincronizar listas dinámicas (Hijos y Vacaciones)
        db.query(Hijo).filter(Hijo.id_trabajador == id_trabajador).delete()
        for hijo_data in payload.hijos:
            db.add(Hijo(id_trabajador=id_trabajador, **hijo_data.model_dump()))

        db.query(Vacacion).filter(Vacacion.id_trabajador == id_trabajador).delete()
        for vac_data in payload.vacaciones:
            db.add(Vacacion(id_trabajador=id_trabajador, **vac_data.model_dump()))

        db.commit()
        db.refresh(trabajador)
        return trabajador

    except IntegrityError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error de integridad al actualizar: {str(e.orig)}",
        )
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error interno de base de datos al actualizar: {str(e)}",
        )


def eliminar_trabajador_completo(db: Session, id_trabajador: int) -> None:
    trabajador = db.query(Trabajador).filter(Trabajador.id_trabajador == id_trabajador).first()
    if not trabajador:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Trabajador con ID {id_trabajador} no encontrado",
        )
    try:
        db.query(Hijo).filter(Hijo.id_trabajador == id_trabajador).delete()
        db.query(Vacacion).filter(Vacacion.id_trabajador == id_trabajador).delete()
        db.query(DatosLaborales).filter(DatosLaborales.id_trabajador == id_trabajador).delete()
        db.query(UbicacionLaboral).filter(UbicacionLaboral.id_trabajador == id_trabajador).delete()
        db.query(SaludDotacion).filter(SaludDotacion.id_trabajador == id_trabajador).delete()
        db.delete(trabajador)
        db.commit()
    except SQLAlchemyError as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error al eliminar el trabajador: {str(e)}",
        )



