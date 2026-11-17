from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from src.database import get_db
from src.services.catalogo_service import obtener_todos_los_catalogos

router = APIRouter(prefix="/catalogos", tags=["Catálogos"])


@router.get("/")
def listar_catalogos(db: Session = Depends(get_db)):
    return obtener_todos_los_catalogos(db)
