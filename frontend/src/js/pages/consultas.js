import { consultarGet, eliminarRegistro } from '../services/api.js';
import { cargarEstadoEdicion } from '../state.js';
import { rellenarFormularioDesdeEstado } from './wizard.js';
import { exportarExcelConsolidado } from '../services/exportar.js';


let datosCache = [];

const CONFIG_VISTAS = {
  consolidada: [
    { key: 'cedula', label: 'Cédula' },
    { key: 'nombre_1', label: 'Primer Nombre' },
    { key: 'apellido_1', label: 'Primer Apellido' },
    { key: 'telefono', label: 'Teléfono' },
    { key: 'codigo_rac', label: 'Código RAC' },
    { key: 'nombre_cargo', label: 'Cargo', fallback: 'id_cargo' },
    { key: 'nombre_ubicacion_fisica', label: 'Ubicación', fallback: 'id_ubicacion_fisica' },
    { key: 'nombre_estatus', label: 'Estatus', fallback: 'id_estatus' }
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
    { key: 'nombre_horario', label: 'Horario', fallback: 'id_horario' },
    { key: 'nombre_estatus_contrato', label: 'Contrato', fallback: 'id_estatus_contrato' },
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
    { key: 'fecha_asignada_inicio', label: 'Asig. Inicio' },
    { key: 'fecha_asignada_fin', label: 'Asig. Fin' },
    { key: 'fecha_inicio_disfrutada', label: 'Disf. Inicio' },
    { key: 'fecha_fin_disfrutada', label: 'Disf. Fin' }
  ]
};


function datoHtml(etiqueta, valor) {
  return `<div class="informe-dato"><strong>${etiqueta}</strong><span>${valor ?? '-'}</span></div>`;
}

function mostrarVistaTabla() {
  document.querySelector('#vista-consulta .tabla-contenedor')?.classList.remove('oculto');
  if (datosCache.length) {
    document.getElementById('barra-exportacion-masiva')?.classList.remove('oculto');
  }
  const fichaCont = document.getElementById('ficha-informe-trabajador');
  if (fichaCont) {
    fichaCont.classList.add('oculto');
    fichaCont.innerHTML = '';
  }
}

/*
document.getElementById('btn-imprimir-tabla')?.addEventListener('click', () => {
  if (!datosCache.length) return;
  const cedulasUnicas = Array.from(new Set(datosCache.map(r => r.cedula).filter(Boolean)));
  const contenedorPdf = document.getElementById('contenedor-pdf-masivo');
  contenedorPdf.innerHTML = cedulasUnicas.map(c => generarHtmlFichaTrabajador(c, true)).join('');

  document.body.classList.add('imprimiendo-masivo');
  window.print();
  document.body.classList.remove('imprimiendo-masivo');
  contenedorPdf.innerHTML = '';
});
*/


function generarHtmlFichaTrabajador(cedula, esMasivo = false) {
  const registros = datosCache.filter(r => String(r.cedula) === String(cedula));
  if (!registros.length) return '';

  const base = registros [0];
  const nombreCompleto = [base.nombre_1, base.nombre_2, base.apellido_1, base.apellido_2].filter(Boolean).join(' ');
  const hijos = Array.from(new Map(registros.filter(r => r.id_hijo).map(r => [r.id_hijo, r])).values());
  const vacaciones = Array.from(new Map(registros.filter(r => r.id_vacaciones).map(r => [r.id_vacaciones, r])).values());

  return `
    <div class="informe-card ${esMasivo ? 'salto-pagina' : ''}">
      <div class="informe-header">
        <div>
          <h3 style="margin:0;">${nombreCompleto}</h3>
          <small>C.I: ${base.nacionalidad || ''}-${base.cedula} | RAC: ${base.codigo_rac ?? '-'} | Estatus: <strong>${base.estatus_actividad ?? '-'}</strong></small>
        </div>
        ${esMasivo ? '' : `
        <div class="no-print" style="display:flex; gap:8px; flex-wrap:wrap;">
          <button type="button" class="btn-azul-claro" style="margin:0;" onclick="window.volverAListaConsulta()">&larr; Volver</button>
          <button type="button" class="btn-primario" onclick="window.print()">Imprimir / PDF</button>
          <button type="button" class="btn-verde" style="margin:0;" onclick="window.exportarExcelIndividual('${base.cedula}')">Excel (.xlsx)</button>
          <button type="button" class="btn-azul-claro" style="margin:0;" onclick="window.editarTrabajador(${base.id_trabajador})">Editar</button>
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

function renderizarInformeTrabajador(cedula) {
  const html = generarHtmlFichaTrabajador(cedula, false);
  if (!html) return;
  document.querySelector('#vista-consulta .tabla-contenedor')?.classList.add('oculto');
  document.getElementById('barra-exportacion-masiva')?.classList.add('oculto');
  const fichaCont = document.getElementById('ficha-informe-trabajador');
  fichaCont.classList.remove('oculto');
  fichaCont.innerHTML = html;
}



export function renderizarTablaConsulta(nombreVista = 'consolidada') {
  const columnas = CONFIG_VISTAS[nombreVista] || CONFIG_VISTAS.consolidada;
  const thead = document.getElementById('tabla-resultados-head');
  const tbody = document.getElementById('tabla-resultados-body');

  thead.innerHTML = `<tr>${columnas.map(col => `<th>${col.label}</th>`).join('')}<th>Acciones</th></tr>`;

  if (!datosCache.length) {
    tbody.innerHTML = `<tr><td colspan="${columnas.length + 1}">No hay registros para mostrar.</td></tr>`;
    return;
  }

    const barraExport = document.getElementById('barra-exportacion-masiva');

  if (!datosCache.length) {
    if (barraExport) barraExport.classList.add('oculto');
    tbody.innerHTML = `<tr><td colspan="${columnas.length + 1}">No hay registros para mostrar.</td></tr>`;
    return;
  }

  if (barraExport) barraExport.classList.remove('oculto');

  const filasAMostrar = ['hijos', 'vacaciones'].includes(nombreVista)
    ? datosCache
    : Array.from(new Map(datosCache.map(item => [item.id_trabajador, item])).values());

  tbody.innerHTML = filasAMostrar.map(fila => `
    <tr class="fila-seleccionable" onclick="window.seleccionarTrabajadorFila(event, '${fila.cedula}')">
      ${columnas.map(col => {
        const valor = fila[col.key] ?? (col.fallback ? fila[col.fallback] : null) ?? '-';
        return `<td>${valor}</td>`;
      }).join('')}
      <td style="white-space: nowrap;">
        <button type="button" class="btn-azul-claro" style="padding: 4px 10px; margin: 0;" onclick="window.editarTrabajador(${fila.id_trabajador})">Editar</button>
        <button type="button" class="btn-secundario" style="padding: 4px 10px; color: #DC2626;" onclick="window.borrarTrabajador(${fila.id_trabajador}, '${fila.cedula}')">Eliminar</button>
      </td>
    </tr>
  `).join('');
}


let listaSugerencias = [];
let sugerenciaActual = '';

function actualizarSugerenciasBusqueda(listaRegistros) {
  const setValores = new Set();

  listaRegistros.forEach(item => {
    // 1. Combinaciones frecuentes (Nombre + Apellido y Apellido + Nombre)
    if (item.nombre_1 && item.apellido_1) {
      setValores.add(`${item.nombre_1} ${item.apellido_1}`);
      setValores.add(`${item.apellido_1} ${item.nombre_1}`);
    }

    // 2. Indexar TODOS los valores individuales no nulos de cualquier columna de la vista
    Object.entries(item).forEach(([clave, valor]) => {
      // Ignoramos los IDs internos para no contaminar las sugerencias de texto
      if (valor !== null && valor !== undefined && !clave.startsWith('id_')) {
        const texto = String(valor).trim();
        if (texto.length >= 2) {
          setValores.add(texto);
        }
      }
    });
  });

  listaSugerencias = Array.from(setValores);
}


export async function cargarDatosConsulta(terminoBusqueda = '') {
  mostrarVistaTabla();
  try {
    const todos = await consultarGet('/trabajadores/consolidado?limit=1000');
    actualizarSugerenciasBusqueda(todos);

    const filtro = terminoBusqueda.trim().toLowerCase();
    if (!filtro) {
      datosCache = todos;
    } else {
      // Divide lo buscado en palabras individuales (ej. ["carlos", "mendoza"])
      const palabrasBuscadas = filtro.split(/\s+/);

      datosCache = todos.filter(fila => {
        // Une todos los valores del trabajador en un solo texto completo
        const textoCompletoFila = Object.values(fila)
          .filter(v => v !== null && v !== undefined)
          .map(v => String(v).toLowerCase())
          .join(' ');

        // Verifica que TODAS las palabras escritas aparezcan en el registro
        return palabrasBuscadas.every(palabra => textoCompletoFila.includes(palabra));
      });
    }

    const tabActivo = document.querySelector('.btn-filtro-vista.activo');
    const vistaActual = tabActivo ? tabActivo.dataset.vista : 'consolidada';
    renderizarTablaConsulta(vistaActual);
  } catch (error) {
    console.error('Error al consultar:', error);
    datosCache = [];
    renderizarTablaConsulta('consolidada');
  }
}

export function inicializarEventosConsulta() {
  const inputBusqueda = document.getElementById('input-buscar-cedula');
  const inputFantasma = document.getElementById('input-buscar-fantasma');
  const btnBuscar = document.getElementById('btn-buscar-cedula');
  const btnLimpiar = document.getElementById('btn-limpiar-consulta');

  // Precargar sugerencias silenciosamente al abrir la página
  consultarGet('/trabajadores/consolidado?limit=1000')
    .then(actualizarSugerenciasBusqueda)
    .catch(() => {});

  const ejecutarBusqueda = async () => {
    if (inputFantasma) inputFantasma.value = '';
    sugerenciaActual = '';
    if (!document.querySelector('.btn-filtro-vista.activo')) {
      const btnConsolidada = document.querySelector('.btn-filtro-vista[data-vista="consolidada"]');
      if (btnConsolidada) btnConsolidada.classList.add('activo');
    }
    await cargarDatosConsulta(inputBusqueda.value);
  };

  if (btnBuscar) btnBuscar.addEventListener('click', ejecutarBusqueda);

  if (inputBusqueda) {
    inputBusqueda.addEventListener('input', () => {
      if (!inputFantasma) return;
      const escrito = inputBusqueda.value;
      if (!escrito) {
        inputFantasma.value = '';
        sugerenciaActual = '';
        return;
      }

      const coincidencia = listaSugerencias.find(op =>
        op.toLowerCase().startsWith(escrito.toLowerCase()) && op.toLowerCase() !== escrito.toLowerCase()
      );

      if (coincidencia) {
        sugerenciaActual = coincidencia;
        const resto = coincidencia.slice(escrito.length);
        inputFantasma.value = `${escrito}${resto}  ⇥ Tab`;
      } else {
        sugerenciaActual = '';
        inputFantasma.value = '';
      }
    });


    inputBusqueda.addEventListener('keydown', async (e) => {
      if (e.key === 'Tab' && sugerenciaActual) {
        e.preventDefault();
        inputBusqueda.value = sugerenciaActual;
        if (inputFantasma) inputFantasma.value = '';
        sugerenciaActual = '';
      } else if (e.key === 'Enter') {
        e.preventDefault();
        await ejecutarBusqueda();
      }
    });
  }

  if (btnLimpiar) {
    btnLimpiar.addEventListener('click', () => {
      datosCache = [];
      document.getElementById('barra-exportacion-masiva')?.classList.add('oculto');
      mostrarVistaTabla();
      inputBusqueda.value = '';
      if (inputFantasma) inputFantasma.value = '';
      sugerenciaActual = '';
      document.querySelectorAll('.btn-filtro-vista').forEach(b => b.classList.remove('activo'));
      document.getElementById('tabla-resultados-head').innerHTML = '';
      document.getElementById('tabla-resultados-body').innerHTML =
        '<tr><td>Presione <strong>Buscar</strong>, tecla <strong>Enter</strong> o seleccione una vista para cargar los registros.</td></tr>';
    });
  }


  document.querySelectorAll('.btn-filtro-vista').forEach(btn => {
    btn.addEventListener('click', async () => {
      if (inputFantasma) inputFantasma.value = '';
      document.querySelectorAll('.btn-filtro-vista').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      await cargarDatosConsulta(inputBusqueda.value);
    });
  });

  // Eventos del Modal Rojo de Segunda Confirmación
  const modalEliminar = document.getElementById('modal-eliminar-peligro');
  const btnCancelarEliminar = document.getElementById('btn-cancelar-eliminar');
  const btnConfirmarFinal = document.getElementById('btn-confirmar-eliminar-final');

  if (btnCancelarEliminar) {
    btnCancelarEliminar.addEventListener('click', () => {
      modalEliminar.classList.add('oculto');
      modalEliminar.dataset.idEliminar = '';
    });
  }

  if (btnConfirmarFinal) {
    btnConfirmarFinal.addEventListener('click', async () => {
      const idEliminar = modalEliminar.dataset.idEliminar;
      if (!idEliminar) return;

      try {
        await eliminarRegistro(`/trabajadores/${idEliminar}`);
        modalEliminar.classList.add('oculto');
        modalEliminar.dataset.idEliminar = '';
        alert('Registro eliminado definitivamente.');
        await cargarDatosConsulta(inputBusqueda.value);
      } catch (error) {
        alert('Error al eliminar: ' + error.message);
      }
    });
  }
}

/*
window.seleccionarTrabajadorFila = (event, cedula) => {
  if (event.target.tagName === 'BUTTON') return;
  const inputBusqueda = document.getElementById('input-buscar-cedula');
  const inputFantasma = document.getElementById('input-buscar-fantasma');
  inputBusqueda.value = cedula;
  if (inputFantasma) inputFantasma.value = '';
  sugerenciaActual = '';
  cargarDatosConsulta(cedula);
};*/

window.volverAListaConsulta = () => {
  mostrarVistaTabla();
};

window.seleccionarTrabajadorFila = (event, cedula) => {
  if (event.target.tagName === 'BUTTON') return;
  renderizarInformeTrabajador(cedula);
};


window.borrarTrabajador = (idTrabajador, cedula) => {
  if (!idTrabajador) return;
  const primeraConfirmacion = confirm(`¿Desea iniciar la eliminación del trabajador con cédula ${cedula}?`);
  if (!primeraConfirmacion) return;

  const modalEliminar = document.getElementById('modal-eliminar-peligro');
  document.getElementById('texto-modal-eliminar').textContent =
    `SEGUNDA CONFIRMACIÓN: ¿Está completamente seguro de eliminar de forma irreversible al trabajador con cédula ${cedula} y todos sus módulos asociados?`;
  modalEliminar.dataset.idEliminar = String(idTrabajador);
  modalEliminar.classList.remove('oculto');
};

window.editarTrabajador = async (idTrabajador) => {
  if (!idTrabajador) return;
  try {
    const detalle = await consultarGet(`/trabajadores/${idTrabajador}`);
    cargarEstadoEdicion(detalle);
    rellenarFormularioDesdeEstado(idTrabajador);
  } catch (error) {
    alert('Error al cargar datos para editar: ' + error.message);
  }
};


window.exportarExcelIndividual = (cedula) => {
  const registros = datosCache.filter(r => String(r.cedula) === String(cedula));
  exportarExcelConsolidado(registros, `Trabajador_${cedula}.xlsx`);
};

document.getElementById('btn-exportar-excel-masivo')?.addEventListener('click', () => {
  if (!datosCache.length) {
    alert('Primero presione Buscar o seleccione una vista para cargar los registros.');
    return;
  }
  exportarExcelConsolidado(datosCache, 'Consolidado_Personal_SARHHRRS.xlsx');
});



function construirTablaHtml(titulo, filas) {
  if (!filas.length) return `<h3>${titulo}</h3><p>Sin registros.</p>`;
  const headers = Object.keys(filas[0]);
  return `
    <h3 style="margin:10px 0 4px 0; color:#1e3a8a;">${titulo} (${filas.length})</h3>
    <table>
      <thead><tr>${headers.map(h => `<th style="font-weight: bold;"><strong>${h}</strong></th>`).join('')}</tr></thead>
      <tbody>${filas.map(f => `<tr>${headers.map(h => `<td>${f[h] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
    </table>`;
}


document.getElementById('btn-imprimir-tabla')?.addEventListener('click', () => {
  if (!datosCache.length) return;

  const unicos = Array.from(new Map(datosCache.map(r => [r.id_trabajador, r])).values());
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

  const contenedorPdf = document.getElementById('contenedor-pdf-masivo');
  contenedorPdf.innerHTML = `<h2 style="margin:0 0 8px 0;">Reporte Consolidado de Personal - SARHHRRS</h2>`
    + construirTablaHtml('1. Datos Generales, Laborales, Ubicación y Salud', tablaTrabajadores)
    + construirTablaHtml('2. Carga Familiar (Hijos)', hijos)
    + construirTablaHtml('3. Historial de Vacaciones', vacaciones);

  document.body.classList.add('imprimiendo-masivo');
  window.print();
  document.body.classList.remove('imprimiendo-masivo');
  contenedorPdf.innerHTML = '';
});


