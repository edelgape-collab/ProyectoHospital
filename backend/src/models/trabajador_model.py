from sqlalchemy import CHAR, Column, Date, ForeignKey, Integer, String
from sqlalchemy.orm import relationship
from src.database import Base


class Trabajador(Base):
    __tablename__ = "trabajador"

    id_trabajador = Column(Integer, primary_key=True, autoincrement=True)
    nacionalidad = Column(CHAR(1), nullable=False)
    cedula = Column(String(20), nullable=False, unique=True)
    nombre_1 = Column(String(50), nullable=False)
    nombre_2 = Column(String(50), nullable=True)
    apellido_1 = Column(String(50), nullable=False)
    apellido_2 = Column(String(50), nullable=True)
    fecha_nacimiento = Column(Date, nullable=False)
    sexo = Column(CHAR(1), nullable=False)
    estado_civil = Column(String(20), nullable=False)
    direccion_habitacion = Column(String(255), nullable=False)
    telefono = Column(String(30), nullable=True)
    correo = Column(String(254), nullable=True, unique=True)
    centro_votacion = Column(String(255), nullable=True)
    observaciones = Column(String(255), nullable=True)
    id_estatus = Column(Integer, nullable=False)

    # Relaciones 1 a 1 y 1 a Muchos
    datos_laborales = relationship("DatosLaborales", back_populates="trabajador", uselist=False, cascade="all, delete-orphan")
    ubicacion_laboral = relationship("UbicacionLaboral", back_populates="trabajador", uselist=False, cascade="all, delete-orphan")
    salud_dotacion = relationship("SaludDotacion", back_populates="trabajador", uselist=False, cascade="all, delete-orphan")
    hijos = relationship("Hijo", back_populates="trabajador", cascade="all, delete-orphan")
    vacaciones = relationship("Vacacion", back_populates="trabajador", cascade="all, delete-orphan")


class DatosLaborales(Base):
    __tablename__ = "datos_laborales"

    id_laboral = Column(Integer, primary_key=True, autoincrement=True)
    codigo_rac = Column(Integer, nullable=True)
    carga_horaria = Column(Integer, nullable=True)
    fecha_ingreso_apn = Column(Date, nullable=True)
    fecha_ingreso_mpps = Column(Date, nullable=True)
    id_trabajador = Column(Integer, ForeignKey("trabajador.id_trabajador", ondelete="CASCADE"), nullable=False)
    id_horario = Column(Integer, nullable=False)
    id_estatus_contrato = Column(Integer, nullable=False)
    id_cargo = Column(Integer, nullable=False)
    id_nivel_grado = Column(Integer, nullable=False)

    trabajador = relationship("Trabajador", back_populates="datos_laborales")


class UbicacionLaboral(Base):
    __tablename__ = "ubicacion_laboral"

    id_ubicacion = Column(Integer, primary_key=True, autoincrement=True)
    id_trabajador = Column(Integer, ForeignKey("trabajador.id_trabajador", ondelete="CASCADE"), nullable=False, unique=True)
    id_ubicacion_administrativa = Column(Integer, nullable=False)
    id_ubicacion_fisica = Column(Integer, nullable=False)
    id_asic = Column(Integer, nullable=False)
    id_red = Column(Integer, nullable=False)

    trabajador = relationship("Trabajador", back_populates="ubicacion_laboral")


class SaludDotacion(Base):
    __tablename__ = "salud_dotacion"

    id_salud = Column(Integer, primary_key=True, autoincrement=True)
    id_trabajador = Column(Integer, ForeignKey("trabajador.id_trabajador", ondelete="CASCADE"), nullable=False)
    talla_pantalon = Column(String(2), nullable=True)
    talla_camisa = Column(String(2), nullable=True)
    talla_zapatos = Column(Integer, nullable=True)
    patologias = Column(String(255), nullable=True)
    tratamiento = Column(String(255), nullable=True)

    trabajador = relationship("Trabajador", back_populates="salud_dotacion")


class Hijo(Base):
    __tablename__ = "hijos"

    id_hijo = Column(Integer, primary_key=True, autoincrement=True)
    id_trabajador = Column(Integer, ForeignKey("trabajador.id_trabajador", ondelete="CASCADE"), nullable=False)
    nombre1_hijo = Column(String(20), nullable=False)
    nombre2_hijo = Column(String(20), nullable=True)
    apellido1_hijo = Column(String(20), nullable=False)
    apellido2_hijo = Column(String(20), nullable=True)
    fecha_nacimiento_hijo = Column(Date, nullable=False)
    nacionalidad_hijo = Column(CHAR(1), nullable=True)
    cedula_hijo = Column(String(20), nullable=True, unique=True)
    sexo_hijo = Column(CHAR(1), nullable=True)

    trabajador = relationship("Trabajador", back_populates="hijos")


class Vacacion(Base):
    __tablename__ = "vacaciones"

    id_vacaciones = Column(Integer, primary_key=True, autoincrement=True)
    id_trabajador = Column(Integer, ForeignKey("trabajador.id_trabajador", ondelete="CASCADE"), nullable=False)
    periodos_vencidos = Column(String(255), nullable=False)
    ultimo_disfrutado = Column(String(9), nullable=False)
    #fecha_asignada_inicio = Column(Date, nullable=True)
    fecha_solicitud = Column(Date, nullable=True)
    #fecha_asignada_fin = Column(Date, nullable=True)
    tipo_vacaciones = Column(String(20), nullable=True)
    #fecha_inicio_disfrutada = Column(Date, nullable=True)
    fecha_inicio_disfrute = Column(Date, nullable=True)
    #fecha_fin_disfrutada = Column(Date, nullable=True)
    fecha_fin_disfrute = Column(Date, nullable=True)
    notas_vacaciones = Column(String(255), nullable=True)

    trabajador = relationship("Trabajador", back_populates="vacaciones")
