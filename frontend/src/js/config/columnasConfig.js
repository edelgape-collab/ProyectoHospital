// src/js/config/columnasConfig.js

export const TODAS_LAS_COLUMNAS = [
  { key: 'cedula', label: 'Cédula', visible: true },
  { key: 'nombre_1', label: 'Primer Nombre', visible: true },
  { key: 'apellido_1', label: 'Primer Apellido', visible: true },
  { key: 'nombre_cargo', label: 'Cargo', visible: true },
  { key: 'nombre_ubicacion_fisica', label: 'Ubicación Física', visible: true },
  { key: 'estatus_actividad', label: 'Estatus', visible: true },
  // Ocultas por defecto (activables desde el botón Columnas)
  { key: 'telefono', label: 'Teléfono', visible: false },
  { key: 'correo', label: 'Correo', visible: false },
  { key: 'sexo', label: 'Sexo', visible: false },
  { key: 'estado_civil', label: 'Estado Civil', visible: false },
  { key: 'fecha_nacimiento', label: 'F. Nacimiento', visible: false },
  { key: 'direccion_habitacion', label: 'Dirección', visible: false },
  { key: 'centro_votacion', label: 'Centro Votación', visible: false },
  { key: 'codigo_rac', label: 'Código RAC', visible: false },
  { key: 'carga_horaria', label: 'Carga Horaria', visible: false },
  { key: 'opciones_contrato', label: 'Tipo Contrato', visible: false },
  { key: 'nombre_nivel_grado', label: 'Nivel/Grado', visible: false },
  { key: 'nombre_turno', label: 'Horario/Turno', visible: false },
  { key: 'fecha_ingreso_apn', label: 'Ingreso APN', visible: false },
  { key: 'fecha_ingreso_mpps', label: 'Ingreso MPPS', visible: false },
  { key: 'nombre_asic', label: 'ASIC', visible: false },
  { key: 'nombre_red', label: 'Red', visible: false },
  { key: 'nombre_ubicacion_administrativa', label: 'Ubic. Admin.', visible: false },
  { key: 'talla_camisa', label: 'Talla Camisa', visible: false },
  { key: 'talla_pantalon', label: 'Talla Pantalón', visible: false },
  { key: 'talla_zapatos', label: 'Talla Zapatos', visible: false },
  { key: 'patologias', label: 'Patologías', visible: false },
  { key: 'tratamiento', label: 'Tratamiento', visible: false }
];

export const CAMPOS_REGLAS = [
  { key: 'codigo_rac', label: 'Código RAC' },
  { key: 'carga_horaria', label: 'Carga Horaria' },
  { key: 'sexo', label: 'Sexo (M/F)' },
  { key: 'estado_civil', label: 'Estado Civil' },
  { key: 'opciones_contrato', label: 'Tipo Contrato' },
  { key: 'nombre_asic', label: 'ASIC' },
  { key: 'nombre_ubicacion_fisica', label: 'Ubicación Física' },
  { key: 'talla_camisa', label: 'Talla Camisa' },
  { key: 'talla_pantalon', label: 'Talla Pantalón' },
  { key: 'talla_zapatos', label: 'Talla Zapatos' },
  { key: 'patologias', label: 'Patologías' }
];

export const CONFIG_VISTAS = {
  consolidada: [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre_1', label: 'Primer Nombre' },
    { key: 'apellido_1', label: 'Primer Apellido' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'codigo_rac', label: 'Código RAC' },
    { key: 'nombre_cargo', label: 'Cargo', fallback: 'id_cargo' },
    { key: 'nombre_ubicacion_fisica', label: 'Ubicación', fallback: 'id_ubicacion_fisica' },
    { key: 'estatus_actividad', label: 'Estatus', fallback: 'id_estatus' }
  ],
  basicos: [
    { key: 'nacionalidad', label: 'Nac.' },
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre_1', label: 'Nombre 1' },
    { key: 'nombre_2', label: 'Nombre 2' },
    { key: 'apellido_1', label: 'Apellido 1' },
    { key: 'apellido_2', label: 'Apellido 2' },
    { key: 'fecha_nacimiento', label: 'F. Nacimiento' },
    { key: 'sexo', label: 'Sexo' },
    { key: 'estado_civil', label: 'Estado Civil' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'correo', label: 'Correo' },
    { key: 'direccion_habitacion', label: 'Dirección' },
    { key: 'centro_votacion', label: 'Centro Votación' }
  ],
  laborales: [
    { key: 'cedula', label: 'Cédula' },
    { key: 'codigo_rac', label: 'Código RAC' },
    { key: 'carga_horaria', label: 'Carga Horaria' },
    { key: 'fecha_ingreso_apn', label: 'Ingreso APN' },
    { key: 'fecha_ingreso_mpps', label: 'Ingreso MPPS' },
    { key: 'nombre_turno', label: 'Horario', fallback: 'id_horario' },
    { key: 'opciones_contrato', label: 'Contrato', fallback: 'id_estatus_contrato' },
    { key: 'nombre_cargo', label: 'Cargo', fallback: 'id_cargo' },
    { key: 'nombre_nivel_grado', label: 'Nivel/Grado', fallback: 'id_nivel_grado' }
  ],
  ubicacion: [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre_ubicacion_administrativa', label: 'Ubic. Admin.', fallback: 'id_ubicacion_administrativa' },
    { key: 'nombre_ubicacion_fisica', label: 'Ubic. Física', fallback: 'id_ubicacion_fisica' },
    { key: 'nombre_asic', label: 'ASIC', fallback: 'id_asic' },
    { key: 'nombre_red', label: 'Red', fallback: 'id_red' }
  ],
  salud: [
    { key: 'cedula', label: 'Cédula' },
    { key: 'talla_pantalon', label: 'Pantalón' },
    { key: 'talla_camisa', label: 'Camisa' },
    { key: 'talla_zapatos', label: 'Zapatos' },
    { key: 'patologias', label: 'Patologías' },
    { key: 'tratamiento', label: 'Tratamiento' }
  ],
  hijos: [
    { key: 'cedula', label: 'Cédula Trabajador' },
    { key: 'nombre1_hijo', label: 'Nombre Hijo' },
    { key: 'apellido1_hijo', label: 'Apellido Hijo' },
    { key: 'fecha_nacimiento_hijo', label: 'F. Nac. Hijo' },
    { key: 'cedula_hijo', label: 'Cédula Hijo' },
    { key: 'sexo_hijo', label: 'Sexo' }
  ],
  vacaciones: [
    { key: 'cedula', label: 'Cédula Trabajador' },
    { key: 'periodos_vencidos', label: 'Periodos Vencidos' },
    { key: 'ultimo_disfrutado', label: 'Último Disfrutado' },
    { key: 'fecha_solicitud', label: 'F. solicitud' },
    { key: 'tipo_vacaciones', label: 'Tipo vacacion' },
    { key: 'fecha_inicio_disfrute', label: 'Disf. Inicio' },
    { key: 'fecha_fin_disfrute', label: 'Disf. Fin' },
    { key: 'notas_vacaciones', label: 'Notas' }
  ]
};
