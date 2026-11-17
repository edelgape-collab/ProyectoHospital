from datetime import date
from typing import List, Literal, Optional
from pydantic import BaseModel, ConfigDict, EmailStr, Field


class DatosLaboralesCreate(BaseModel):
    codigo_rac: Optional[int] = None
    carga_horaria: Optional[int] = None
    fecha_ingreso_apn: Optional[date] = None
    fecha_ingreso_mpps: Optional[date] = None
    id_horario: int
    id_estatus_contrato: int
    id_cargo: int
    id_nivel_grado: int


class UbicacionLaboralCreate(BaseModel):
    id_ubicacion_administrativa: int
    id_ubicacion_fisica: int
    id_asic: int
    id_red: int


class SaludDotacionCreate(BaseModel):
    talla_pantalon: Optional[str] = Field(None, max_length=2)
    talla_camisa: Optional[str] = Field(None, max_length=2)
    talla_zapatos: Optional[int] = None
    patologias: Optional[str] = Field(None, max_length=255)
    tratamiento: Optional[str] = Field(None, max_length=255)


class HijoCreate(BaseModel):
    nombre1_hijo: str = Field(..., max_length=20)
    nombre2_hijo: Optional[str] = Field(None, max_length=20)
    apellido1_hijo: str = Field(..., max_length=20)
    apellido2_hijo: Optional[str] = Field(None, max_length=20)
    fecha_nacimiento_hijo: date
    nacionalidad_hijo: Optional[Literal["V", "E"]] = None
    cedula_hijo: Optional[str] = Field(None, max_length=20)
    sexo_hijo: Optional[Literal["M", "F"]] = None


class VacacionCreate(BaseModel):
    periodos_vencidos: str = Field(..., max_length=255)
    ultimo_disfrutado: str = Field(..., max_length=9)
    fecha_asignada_inicio: Optional[date] = None
    fecha_asignada_fin: Optional[date] = None
    fecha_inicio_disfrutada: Optional[date] = None
    fecha_fin_disfrutada: Optional[date] = None


class TrabajadorCompletoCreate(BaseModel):
    # 1. Tabla principal: trabajador
    nacionalidad: Literal["V", "E"]
    cedula: str = Field(..., max_length=20)
    nombre_1: str = Field(..., max_length=50)
    nombre_2: Optional[str] = Field(None, max_length=50)
    apellido_1: str = Field(..., max_length=50)
    apellido_2: Optional[str] = Field(None, max_length=50)
    fecha_nacimiento: date
    sexo: Literal["M", "F"]
    estado_civil: Literal["Soltero/a", "Casado/a", "Divorciado/a", "Viudo/a", "Otro"]
    direccion_habitacion: str = Field(..., max_length=255)
    telefono: Optional[str] = Field(None, max_length=30)
    correo: Optional[EmailStr] = None
    centro_votacion: Optional[str] = Field(None, max_length=255)
    observaciones: Optional[str] = Field(None, max_length=255)
    id_estatus: int

    # 2, 3 y 4. Relaciones 1 a 1
    datos_laborales: DatosLaboralesCreate
    ubicacion_laboral: UbicacionLaboralCreate
    salud_dotacion: SaludDotacionCreate

    # 5 y 6. Relaciones 1 a Muchos (pueden ir vacías si no tiene hijos o vacaciones registradas)
    hijos: List[HijoCreate] = []
    vacaciones: List[VacacionCreate] = []


class VistaConsolidadoResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id_trabajador: int
    nacionalidad: Optional[str] = None
    cedula: Optional[str] = None
    nombre_1: Optional[str] = None
    nombre_2: Optional[str] = None
    apellido_1: Optional[str] = None
    apellido_2: Optional[str] = None
    fecha_nacimiento: Optional[date] = None
    sexo: Optional[str] = None
    estado_civil: Optional[str] = None
    direccion_habitacion: Optional[str] = None
    telefono: Optional[str] = None
    correo: Optional[str] = None
    centro_votacion: Optional[str] = None
    observaciones: Optional[str] = None
    estatus_actividad: Optional[str] = None

    id_laboral: Optional[int] = None
    codigo_rac: Optional[int] = None
    carga_horaria: Optional[int] = None
    fecha_ingreso_apn: Optional[date] = None
    fecha_ingreso_mpps: Optional[date] = None
    opciones_contrato: Optional[str] = None
    nombre_cargo: Optional[str] = None
    nombre_nivel_grado: Optional[str] = None
    nombre_turno: Optional[str] = None
    descripcion: Optional[str] = None
    hora_inicio: Optional[str] = None
    hora_fin: Optional[str] = None
    cantidad_horas: Optional[int] = None

    #id_ubicacion: Optional[int] = None
    #id_ubicacion_administrativa: Optional[int] = None
    #id_ubicacion_fisica: Optional[int] = None
    #id_asic: Optional[int] = None
    #id_red: Optional[int] = None

    id_ubicacion: Optional[int] = None
    nombre_ubicacion_administrativa: Optional[str] = None
    nombre_ubicacion_fisica: Optional[str] = None
    nombre_asic: Optional[str] = None
    nombre_red: Optional[str] = None

    id_salud: Optional[int] = None
    talla_pantalon: Optional[str] = None
    talla_camisa: Optional[str] = None
    talla_zapatos: Optional[int] = None
    patologias: Optional[str] = None
    tratamiento: Optional[str] = None

    id_hijo: Optional[int] = None
    nombre1_hijo: Optional[str] = None
    nombre2_hijo: Optional[str] = None
    apellido1_hijo: Optional[str] = None
    apellido2_hijo: Optional[str] = None
    fecha_nacimiento_hijo: Optional[date] = None
    nacionalidad_hijo: Optional[str] = None
    cedula_hijo: Optional[str] = None
    sexo_hijo: Optional[str] = None

    id_vacaciones: Optional[int] = None
    periodos_vencidos: Optional[str] = None
    ultimo_disfrutado: Optional[str] = None
    fecha_asignada_inicio: Optional[date] = None
    fecha_asignada_fin: Optional[date] = None
    fecha_inicio_disfrutada: Optional[date] = None
    fecha_fin_disfrutada: Optional[date] = None
