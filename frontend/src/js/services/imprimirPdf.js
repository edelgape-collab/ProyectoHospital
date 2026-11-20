// src/js/services/imprimirPdf.js
import { TODAS_LAS_COLUMNAS } from '../config/columnasConfig.js';

function datoHtml(etiqueta, valor) {
  return `<div class="informe-dato"><strong>${etiqueta}</strong><span>${valor ?? '-'}</span></div>`;
}

export function generarHtmlFichaTrabajador(datosCache, cedula, esMasivo = false) {
  const registros = datosCache.filter(r => String(r.cedula) === String(cedula));
  if (!registros.length) return '';

  const base = registros[0]; // <-- CORREGIDO: índice [0]
  const nombreCompleto = [base.nombre_1, base.nombre_2, base.apellido_1, base.apellido_2].filter(Boolean).join(' ');
  const hijos = Array.from(new Map(registros.filter(r => r.id_hijo).map(r => [r.id_hijo, r])).values());
  const vacaciones = Array.from(new Map(registros.filter(r => r.id_vacaciones).map(r => [r.id_vacaciones, r])).values());

  return `
    <div class="informe-card ${esMasivo ? 'salto-pagina' : ''}">
      <div class="informe-header">
        <div>
          <h3 class="m-0">${nombreCompleto}</h3>
          <small>C.I: ${base.nacionalidad || ''}-${base.cedula} | RAC: ${base.codigo_rac ?? '-'} | Estatus: <strong>${base.estatus_actividad ?? '-'}</strong></small>
        </div>
        ${esMasivo ? '' : `
        <div class="no-print flex-botones-busqueda">
          <button type="button" class="btn-azul-claro m-0" onclick="window.volverAListaConsulta()">&larr; Volver</button>
          <button type="button" class="btn-primario" onclick="window.print()">Imprimir / PDF</button>
          <button type="button" class="btn-verde m-0" onclick="window.exportarExcelIndividual('${base.cedula}')">Excel (.xlsx)</button>
          <button type="button" class="btn-azul-claro m-0" onclick="window.editarTrabajador(${base.id_trabajador})">Editar</button>
        </div>`}
      </div>
      <div class="informe-seccion"><h4>1. Datos Básicos</h4><div class="informe-grid">
        ${datoHtml('F. Nacimiento', base.fecha_nacimiento)} ${datoHtml('Sexo', base.sexo)} ${datoHtml('Estado Civil', base.estado_civil)}
        ${datoHtml('Teléfono', base.telefono)} ${datoHtml('Correo', base.correo)} ${datoHtml('Centro Votación', base.centro_votacion)}
        ${datoHtml('Dirección', base.direccion_habitacion)} ${datoHtml('Observaciones', base.observaciones)}
      </div></div>
      <div class="informe-seccion"><h4>2. Datos Laborales</h4><div class="informe-grid">
        ${datoHtml('Cargo', base.nombre_cargo)} ${datoHtml('Nivel/Grado', base.nombre_nivel_grado)} ${datoHtml('Contrato', base.opciones_contrato)}
        ${datoHtml('Carga Horaria', base.carga_horaria)} ${datoHtml('Ingreso APN', base.fecha_ingreso_apn)} ${datoHtml('Ingreso MPPS', base.fecha_ingreso_mpps)}
        ${datoHtml('Turno', `${base.nombre_turno ?? '-'} (${base.hora_inicio ?? ''} - ${base.hora_fin ?? ''})`)}
      </div></div>
      <div class="informe-seccion"><h4>3. Ubicación Laboral</h4><div class="informe-grid">
        ${datoHtml('Red', base.nombre_red)} ${datoHtml('ASIC', base.nombre_asic)}
        ${datoHtml('Ubic. Administrativa', base.nombre_ubicacion_administrativa)} ${datoHtml('Ubic. Física', base.nombre_ubicacion_fisica)}
      </div></div>
      <div class="informe-seccion"><h4>4. Salud y Dotación</h4><div class="informe-grid">
        ${datoHtml('Pantalón', base.talla_pantalon)} ${datoHtml('Camisa', base.talla_camisa)} ${datoHtml('Zapatos', base.talla_zapatos)}
        ${datoHtml('Patologías', base.patologias)} ${datoHtml('Tratamiento', base.tratamiento)}
      </div></div>
      <div class="informe-seccion"><h4>5. Hijos (${hijos.length})</h4>
        ${hijos.length ? `<table><thead><tr><th>Nombre</th><th>Cédula</th><th>F. Nac.</th><th>Sexo</th></tr></thead><tbody>
          ${hijos.map(h => `<tr><td>${[h.nombre1_hijo, h.nombre2_hijo, h.apellido1_hijo, h.apellido2_hijo].filter(Boolean).join(' ')}</td><td>${h.nacionalidad_hijo || ''}${h.cedula_hijo || '-'}</td><td>${h.fecha_nacimiento_hijo ?? '-'}</td><td>${h.sexo_hijo ?? '-'}</td></tr>`).join('')}
        </tbody></table>` : '<p>Sin hijos registrados.</p>'}
      </div>
      <div class="informe-seccion"><h4>6. Vacaciones (${vacaciones.length})</h4>
        ${vacaciones.length ? `<table><thead><tr><th>Vencidos</th><th>Último</th><th>Asignada</th><th>Disfrutada</th></tr></thead><tbody>
          ${vacaciones.map(v => `<tr><td>${v.periodos_vencidos ?? '-'}</td><td>${v.ultimo_disfrutado ?? '-'}</td><td>${v.fecha_asignada_inicio ?? '-'} / ${v.fecha_asignada_fin ?? '-'}</td><td>${v.fecha_inicio_disfrutada ?? '-'} / ${v.fecha_fin_disfrutada ?? '-'}</td></tr>`).join('')}
        </tbody></table>` : '<p>Sin registros de vacaciones.</p>'}
      </div>
    </div>`;
}

function construirTablaHtml(titulo, filas) {
  if (!filas.length) return `<h3>${titulo}</h3><p>Sin registros.</p>`;
  const headers = Object.keys(filas[0]); // <-- CORREGIDO: índice [0]
  return `
    <h3>${titulo} (${filas.length})</h3>
    <table>
      <thead><tr>${headers.map(h => `<th><strong>${h}</strong></th>`).join('')}</tr></thead>
      <tbody>${filas.map(f => `<tr>${headers.map(h => `<td>${f[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
}

export function imprimirReporteConsolidado(datosCache, usarColumnasPersonalizadas) {
  if (!datosCache.length) {
    alert('No hay datos cargados para generar el PDF.');
    return;
  }

  const unicos = Array.from(new Map(datosCache.map(r => [r.id_trabajador, r])).values());
  const contenedorPdf = document.getElementById('contenedor-pdf-masivo');
  if (!contenedorPdf) return;

  if (usarColumnasPersonalizadas) {
    const colsActivas = TODAS_LAS_COLUMNAS.filter(c => c.visible);
    const tablaPersonalizada = unicos.map(t => {
      const obj = {};
      colsActivas.forEach(c => { obj[c.label] = t[c.key] ?? '-'; });
      return obj;
    });

    contenedorPdf.innerHTML = `<h2>Reporte Personalizado de Personal - SARHHRRS</h2>`
      + construirTablaHtml('Listado Filtrado', tablaPersonalizada);
  } else {
    const tablaTrabajadores = unicos.map(t => ({
      'Cédula': `${t.nacionalidad ?? ''}-${t.cedula ?? ''}`,
      'Nombres y Apellidos': [t.nombre_1, t.nombre_2, t.apellido_1, t.apellido_2].filter(Boolean).join(' '),
      'F. Nac': t.fecha_nacimiento ?? '-', 'Sexo': t.sexo ?? '-', 'E. Civil': t.estado_civil ?? '-',
      'Teléfono': t.telefono ?? '-', 'Correo': t.correo ?? '-', 'Dirección': t.direccion_habitacion ?? '-',
      'C. Votación': t.centro_votacion ?? '-', 'Estatus': t.estatus_actividad ?? '-',
      'RAC': t.codigo_rac ?? '-', 'Cargo': t.nombre_cargo ?? '-', 'Nivel': t.nombre_nivel_grado ?? '-',
      'Contrato': t.opciones_contrato ?? '-', 'Horas': t.carga_horaria ?? '-',
      'Ing. APN': t.fecha_ingreso_apn ?? '-', 'Ing. MPPS': t.fecha_ingreso_mpps ?? '-',
      'Turno': t.nombre_turno ?? '-', 'Red': t.nombre_red ?? '-', 'ASIC': t.nombre_asic ?? '-',
      'U. Admin': t.nombre_ubicacion_administrativa ?? '-', 'U. Física': t.nombre_ubicacion_fisica ?? '-',
      'Tallas (P/C/Z)': `${t.talla_pantalon ?? '-'}/${t.talla_camisa ?? '-'}/${t.talla_zapatos ?? '-'}`,
      'Patologías': t.patologias ?? '-', 'Tratamiento': t.tratamiento ?? '-', 'Obs.': t.observaciones ?? '-'
    }));

    const hijos = Array.from(new Map(datosCache.filter(r => r.id_hijo).map(r => [r.id_hijo, r])).values()).map(h => ({
      'Cédula Trab.': h.cedula ?? '', 'Trabajador': `${h.nombre_1 ?? ''} ${h.apellido_1 ?? ''}`,
      'Cédula Hijo': `${h.nacionalidad_hijo ?? ''}${h.cedula_hijo ?? '-'}`,
      'Nombre Hijo': [h.nombre1_hijo, h.nombre2_hijo, h.apellido1_hijo, h.apellido2_hijo].filter(Boolean).join(' '),
      'F. Nac.': h.fecha_nacimiento_hijo ?? '-', 'Sexo': h.sexo_hijo ?? '-'
    }));

    const vacaciones = Array.from(new Map(datosCache.filter(r => r.id_vacaciones).map(r => [r.id_vacaciones, r])).values()).map(v => ({
      'Cédula Trab.': v.cedula ?? '', 'Trabajador': `${v.nombre_1 ?? ''} ${v.apellido_1 ?? ''}`,
      'Vencidos': v.periodos_vencidos ?? '-', 'Último': v.ultimo_disfrutado ?? '-',
      'Asignada': `${v.fecha_asignada_inicio ?? '-'} a ${v.fecha_asignada_fin ?? '-'}`,
      'Disfrutada': `${v.fecha_inicio_disfrutada ?? '-'} a ${v.fecha_fin_disfrutada ?? '-'}`
    }));

    contenedorPdf.innerHTML = `<h2>Reporte Consolidado de Personal - SARHHRRS</h2>`
      + construirTablaHtml('1. Datos Generales, Laborales, Ubicación y Salud', tablaTrabajadores)
      + construirTablaHtml('2. Carga Familiar (Hijos)', hijos)
      + construirTablaHtml('3. Historial de Vacaciones', vacaciones);
  }

  document.body.classList.add('imprimiendo-masivo');
  window.print();
  document.body.classList.remove('imprimiendo-masivo');
  contenedorPdf.innerHTML = '';
}
