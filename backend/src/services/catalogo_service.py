from sqlalchemy.orm import Session
from src.models.catalogo_model import (
    CatalogoAsic,
    CatalogoCargo,
    CatalogoEstatus,
    CatalogoEstatusContrato,
    CatalogoHorarios,
    CatalogoNivelGrado,
    CatalogoRed,
    CatalogoUbicacionAdministrativa,
    CatalogoUbicacionFisica,
)


def obtener_todos_los_catalogos(db: Session) -> dict:
    return {
    "catalogo_estatus": [
        {"id": item.id_estatus, "nombre": item.nombre_estatus}
        for item in db.query(CatalogoEstatus).all()
    ],
    "catalogo_horarios": [
        {"id": item.id_horario, "nombre": item.nombre_turno}
        for item in db.query(CatalogoHorarios).all()
    ],
    "catalogo_estatus_contrato": [
        {"id": item.id_estatus_contrato, "nombre": item.opciones_contrato}
        for item in db.query(CatalogoEstatusContrato).all()
    ],
    "catalogo_cargo": [
        {"id": item.id_cargo, "nombre": item.nombre_cargo}
        for item in db.query(CatalogoCargo).all()
    ],
    "catalogo_nivel_grado": [
        {"id": item.id_nivel_grado, "nombre": item.nombre_nivel_grado}
        for item in db.query(CatalogoNivelGrado).all()
    ],
    "catalogo_ubicacion_administrativa": [
        {"id": item.id_ubicacion_administrativa, "nombre": item.nombre_ubicacion_administrativa}
        for item in db.query(CatalogoUbicacionAdministrativa).all()
    ],
    "catalogo_ubicacion_fisica": [
        {"id": item.id_ubicacion_fisica, "nombre": item.nombre_ubicacion_fisica}
        for item in db.query(CatalogoUbicacionFisica).all()
    ],
    "catalogo_asic": [
        {"id": item.id_asic, "nombre": item.nombre_asic}
        for item in db.query(CatalogoAsic).all()
    ],
    "catalogo_red": [
        {"id": item.id_red, "nombre": item.nombre_red}
        for item in db.query(CatalogoRed).all()
    ],
}
