from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from src.database import get_db
from src.schemas.trabajador_schema import (
    TrabajadorCompletoCreate,
    VistaConsolidadoResponse,
)
from src.services.trabajador_service import (
    actualizar_trabajador_completo,
    crear_trabajador_completo,
    eliminar_trabajador_completo,
    obtener_consolidado_por_cedula,
    obtener_consolidado_trabajadores,
    obtener_trabajador_detalle,
)

router = APIRouter(prefix="/trabajadores", tags=["Trabajadores"])


@router.post("/", status_code=status.HTTP_201_CREATED)
def registrar_trabajador(
    trabajador: TrabajadorCompletoCreate,
    db: Session = Depends(get_db),
):
    creado = crear_trabajador_completo(db, trabajador)
    return {
        "mensaje": "Trabajador y sus 6 módulos registrados exitosamente",
        "id_trabajador": creado.id_trabajador,
        "cedula": creado.cedula,
    }


@router.get("/consolidado", response_model=List[VistaConsolidadoResponse])
def listar_consolidado(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
):
    return obtener_consolidado_trabajadores(db, skip=skip, limit=limit)


@router.get("/consolidado/{cedula}", response_model=List[VistaConsolidadoResponse])
def buscar_consolidado_por_cedula(
    cedula: str,
    db: Session = Depends(get_db),
):
    return obtener_consolidado_por_cedula(db, cedula)


@router.get("/{id_trabajador}")
def obtener_trabajador(id_trabajador: int, db: Session = Depends(get_db)):
    return obtener_trabajador_detalle(db, id_trabajador)


@router.put("/{id_trabajador}")
def actualizar_trabajador(
    id_trabajador: int,
    trabajador: TrabajadorCompletoCreate,
    db: Session = Depends(get_db),
):
    actualizado = actualizar_trabajador_completo(db, id_trabajador, trabajador)
    return {
        "mensaje": "Trabajador actualizado exitosamente",
        "id_trabajador": actualizado.id_trabajador,
        "cedula": actualizado.cedula,
    }


@router.delete("/{id_trabajador}", status_code=status.HTTP_200_OK)
def eliminar_trabajador(id_trabajador: int, db: Session = Depends(get_db)):
    eliminar_trabajador_completo(db, id_trabajador)
    return {"mensaje": "Trabajador eliminado exitosamente"}