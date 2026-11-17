from sqlalchemy import Column, Integer, String
from src.database import Base


class CatalogoEstatus(Base):
    __tablename__ = "catalogo_estatus"
    id_estatus = Column(Integer, primary_key=True, autoincrement=True)
    nombre_estatus = Column(String(255), nullable=False)


class CatalogoHorarios(Base):
    __tablename__ = "catalogo_horarios"
    id_horario = Column(Integer, primary_key=True, autoincrement=True)
    nombre_turno = Column(String(50), nullable=False)
    descripcion = Column(String(50))
    hora_inicio = Column(String(10))
    hora_fin = Column(String(10))
    cantidad_horas = Column(Integer)


class CatalogoEstatusContrato(Base):
    __tablename__ = "catalogo_estatus_contrato"
    id_estatus_contrato = Column(Integer, primary_key=True, autoincrement=True)
    opciones_contrato = Column(String(50), nullable=False)


class CatalogoCargo(Base):
    __tablename__ = "catalogo_cargo"
    id_cargo = Column(Integer, primary_key=True, autoincrement=True)
    nombre_cargo = Column(String(100), nullable=False)


class CatalogoNivelGrado(Base):
    __tablename__ = "catalogo_nivel_grado"
    id_nivel_grado = Column(Integer, primary_key=True, autoincrement=True)
    nombre_nivel_grado = Column(String(10), nullable=False)


class CatalogoUbicacionAdministrativa(Base):
    __tablename__ = "catalogo_ubicacion_administrativa"
    id_ubicacion_administrativa = Column(Integer, primary_key=True, autoincrement=True)
    nombre_ubicacion_administrativa = Column(String(50), nullable=False)


class CatalogoUbicacionFisica(Base):
    __tablename__ = "catalogo_ubicacion_fisica"
    id_ubicacion_fisica = Column(Integer, primary_key=True, autoincrement=True)
    nombre_ubicacion_fisica = Column(String(50), nullable=False)


class CatalogoAsic(Base):
    __tablename__ = "catalogo_asic"
    id_asic = Column(Integer, primary_key=True, autoincrement=True)
    nombre_asic = Column(String(50), nullable=False)


class CatalogoRed(Base):
    __tablename__ = "catalogo_red"
    id_red = Column(Integer, primary_key=True, autoincrement=True)
    nombre_red = Column(String(50), nullable=False)
