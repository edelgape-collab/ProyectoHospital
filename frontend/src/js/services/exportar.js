import * as XLSXNamespace from 'xlsx';
const XLSX = XLSXNamespace.default || XLSXNamespace;

export function exportarExcelConsolidado(registros, nombreArchivo = 'Reporte_Personal.xlsx') {
  if (!registros || !registros.length) {
    alert('No hay datos cargados para exportar.');
    return;
  }

  // Hoja 1: Trabajadores únicos (Básicos + Laborales + Ubicación + Salud)
  const unicos = Array.from(new Map(registros.map(r => [r.id_trabajador, r])).values());
  const hojaTrabajadores = unicos.map(t => ({
    'Nac.': t.nacionalidad ?? '',
    'Cédula': t.cedula ?? '',
    'Primer Nombre': t.nombre_1 ?? '',
    'Segundo Nombre': t.nombre_2 ?? '',
    'Primer Apellido': t.apellido_1 ?? '',
    'Segundo Apellido': t.apellido_2 ?? '',
    'F. Nacimiento': t.fecha_nacimiento ?? '',
    'Sexo': t.sexo ?? '',
    'Estado Civil': t.estado_civil ?? '',
    'Teléfono': t.telefono ?? '',
    'Correo': t.correo ?? '',
    'Dirección': t.direccion_habitacion ?? '',
    'Centro Votación': t.centro_votacion ?? '',
    'Estatus': t.estatus_actividad ?? '',
    'Código RAC': t.codigo_rac ?? '',
    'Cargo': t.nombre_cargo ?? '',
    'Nivel/Grado': t.nombre_nivel_grado ?? '',
    'Contrato': t.opciones_contrato ?? '',
    'Carga Horaria': t.carga_horaria ?? '',
    'Ingreso APN': t.fecha_ingreso_apn ?? '',
    'Ingreso MPPS': t.fecha_ingreso_mpps ?? '',
    'Turno': t.nombre_turno ?? '',
    'Red': t.nombre_red ?? '',
    'ASIC': t.nombre_asic ?? '',
    'Ubic. Administrativa': t.nombre_ubicacion_administrativa ?? '',
    'Ubic. Física': t.nombre_ubicacion_fisica ?? '',
    'Talla Pantalón': t.talla_pantalon ?? '',
    'Talla Camisa': t.talla_camisa ?? '',
    'Talla Zapatos': t.talla_zapatos ?? '',
    'Patologías': t.patologias ?? '',
    'Tratamiento': t.tratamiento ?? '',
    'Observaciones': t.observaciones ?? ''
  }));

  // Hoja 2: Hijos únicos
  const hijosUnicos = Array.from(new Map(registros.filter(r => r.id_hijo).map(r => [r.id_hijo, r])).values());
  const hojaHijos = hijosUnicos.map(h => ({
    'Cédula Trabajador': h.cedula ?? '',
    'Trabajador': `${h.nombre_1 ?? ''} ${h.apellido_1 ?? ''}`.trim(),
    'Nac. Hijo': h.nacionalidad_hijo ?? '',
    'Cédula Hijo': h.cedula_hijo ?? '',
    'Nombres Hijo': `${h.nombre1_hijo ?? ''} ${h.nombre2_hijo ?? ''}`.trim(),
    'Apellidos Hijo': `${h.apellido1_hijo ?? ''} ${h.apellido2_hijo ?? ''}`.trim(),
    'F. Nacimiento Hijo': h.fecha_nacimiento_hijo ?? '',
    'Sexo Hijo': h.sexo_hijo ?? ''
  }));

  // Hoja 3: Vacaciones únicas
  const vacUnicas = Array.from(new Map(registros.filter(r => r.id_vacaciones).map(r => [r.id_vacaciones, r])).values());
  const hojaVacaciones = vacUnicas.map(v => ({
    'Cédula Trabajador': v.cedula ?? '',
    'Trabajador': `${v.nombre_1 ?? ''} ${v.apellido_1 ?? ''}`.trim(),
    'Períodos Vencidos': v.periodos_vencidos ?? '',
    'Último Disfrutado': v.ultimo_disfrutado ?? '',
    'Fecha Solicitud': v.fecha_solicitud ?? '',
    'Tipo Vacaciones': v.tipo_vacaciones ?? '',
    'Inicio Disfrute': v.fecha_inicio_disfrute ?? '',
    'Fin Disfrute': v.fecha_fin_disfrute ?? '',
    'Notas': v.notas_vacaciones ?? ''
  }));


  const libro = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(hojaTrabajadores), 'Trabajadores');
  XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(hojaHijos.length ? hojaHijos : [{ Info: 'Sin registros' }]), 'Hijos');
  XLSX.utils.book_append_sheet(libro, XLSX.utils.json_to_sheet(hojaVacaciones.length ? hojaVacaciones : [{ Info: 'Sin registros' }]), 'Vacaciones');

  XLSX.writeFile(libro, nombreArchivo);
}
