from sqlalchemy import CHAR, Column, Date, Integer, String
from src.database import Base


class VistaConsolidadoTrabajador(Base):
    __tablename__ = "vista_consolidado_trabajador"
    __table_args__ = {"info": {"is_view": True}}

    # Clave primaria virtual compuesta para evitar colisiones por relaciones 1:N (hijos/vacaciones)
    id_trabajador = Column(Integer, primary_key=True)
    id_hijo = Column(Integer, primary_key=True, nullable=True)
    id_vacaciones = Column(Integer, primary_key=True, nullable=True)

    # Datos básicos
    nacionalidad = Column(CHAR(1))
    cedula = Column(String(20))
    nombre_1 = Column(String(50))
    nombre_2 = Column(String(50))
    apellido_1 = Column(String(50))
    apellido_2 = Column(String(50))
    fecha_nacimiento = Column(Date)
    sexo = Column(CHAR(1))
    estado_civil = Column(String(20))
    direccion_habitacion = Column(String(255))
    telefono = Column(String(30))
    correo = Column(String(254))
    centro_votacion = Column(String(255))
    observaciones = Column(String(255))
    estatus_actividad = Column(String(255))

    # Datos laborales
    id_laboral = Column(Integer)
    codigo_rac = Column(Integer)
    carga_horaria = Column(Integer)
    fecha_ingreso_apn = Column(Date)
    fecha_ingreso_mpps = Column(Date)
    opciones_contrato = Column(String(50))
    nombre_cargo = Column(String(100))
    nombre_nivel_grado = Column(String(10))
    nombre_turno = Column(String(50))
    descripcion = Column(String(50))
    hora_inicio = Column(String(10))
    hora_fin = Column(String(10))
    cantidad_horas = Column(Integer)

    # Ubicación laboral
   # id_ubicacion = Column(Integer)
   # id_ubicacion_administrativa = Column(Integer)
    #id_ubicacion_fisica = Column(Integer)
    #id_asic = Column(Integer)
    #id_red = Column(Integer)

        # Ubicación laboral
    id_ubicacion = Column(Integer)
    nombre_ubicacion_administrativa = Column(String(50))
    nombre_ubicacion_fisica = Column(String(50))
    nombre_asic = Column(String(50))
    nombre_red = Column(String(50))


    # Salud y dotación
    id_salud = Column(Integer)
    talla_pantalon = Column(String(2))
    talla_camisa = Column(String(2))
    talla_zapatos = Column(Integer)
    patologias = Column(String(255))
    tratamiento = Column(String(255))

    # Hijos
    nombre1_hijo = Column(String(20))
    nombre2_hijo = Column(String(20))
    apellido1_hijo = Column(String(20))
    apellido2_hijo = Column(String(20))
    fecha_nacimiento_hijo = Column(Date)
    nacionalidad_hijo = Column(CHAR(1))
    cedula_hijo = Column(String(20))
    sexo_hijo = Column(CHAR(1))

    # Vacaciones
    periodos_vencidos = Column(String(255))
    ultimo_disfrutado = Column(String(9))
    fecha_solicitud = Column(Date)
    tipo_vacaciones = Column(String(20))
    fecha_inicio_disfrute = Column(Date)
    fecha_fin_disfrute = Column(Date)
    notas_vacaciones = Column(String(255))
