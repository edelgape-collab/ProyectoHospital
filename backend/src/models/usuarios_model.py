# backend/src/models/usuarios_model.py
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column
from src.database import Base


class UsuariosDelSistema(Base):
    __tablename__ = "usuarios"

    id_usuario: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    pass_hash: Mapped[str] = mapped_column(String(255), nullable=False)


class RolesDeUsuarios(Base):
    __tablename__ = "catalogo_rol"

    id_rol: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    nombre_rol: Mapped[str] = mapped_column(String(50), nullable=False)
    descripcion_rol: Mapped[str] = mapped_column(String(255), nullable=True)
