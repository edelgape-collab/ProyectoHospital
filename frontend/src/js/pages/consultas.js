// src/js/pages/consultas.js
import { consultarGet, eliminarRegistro } from '../services/api.js';
import { cargarEstadoEdicion } from '../state.js';
import { rellenarFormularioDesdeEstado } from './wizard.js';
import { exportarExcelConsolidado } from '../services/exportar.js';
import { TODAS_LAS_COLUMNAS, CONFIG_VISTAS } from '../config/columnasConfig.js';
import { generarHtmlFichaTrabajador, imprimirReporteConsolidado } from '../services/imprimirPdf.js';
import {
  estadoConsulta,
  actualizarSugerenciasBusqueda,
  construirChipsDesdeRegistros,
  inicializarCheckboxesColumnas,
  agregarFilaReglaDinamica,
  filtrarRegistrosEnMemoria
} from './consultaFiltros.js';

function mostrarVistaTabla() {
  document.querySelector('#vista-consulta .tabla-contenedor')?.classList.remove('oculto');
  if (estadoConsulta.datosCache.length) {
    document.getElementById('barra-exportacion-masiva')?.classList.remove('oculto');
  }
  const fichaCont = document.getElementById('ficha-informe-trabajador');
  if (fichaCont) {
    fichaCont.classList.add('oculto');
    fichaCont.innerHTML = '';
  }
}

function ejecutarFiltrosYRender() {
  mostrarVistaTabla();
  filtrarRegistrosEnMemoria();

  if (estadoConsulta.usarColumnasPersonalizadas) {
    renderizarTablaConsulta('personalizada');
  } else {
    const tabActivo = document.querySelector('.btn-filtro-vista.activo');
    const vistaActual = tabActivo ? tabActivo.dataset.vista : 'consolidada';
    if (!tabActivo) {
      document.querySelector('.btn-filtro-vista[data-vista="consolidada"]')?.classList.add('activo');
    }
    renderizarTablaConsulta(vistaActual);
  }
}

export async function cargarDatosConsulta(forzarRecarga = false) {
  try {
    if (!estadoConsulta.todosLosRegistros.length || forzarRecarga) {
      estadoConsulta.todosLosRegistros = await consultarGet('/trabajadores/consolidado?limit=1000');
      actualizarSugerenciasBusqueda(estadoConsulta.todosLosRegistros);
      construirChipsDesdeRegistros(estadoConsulta.todosLosRegistros, ejecutarFiltrosYRender);
    }
    ejecutarFiltrosYRender();
  } catch (error) {
    console.error('Error al consultar:', error);
    estadoConsulta.datosCache = [];
    renderizarTablaConsulta('consolidada');
  }
}

function renderizarInformeTrabajador(cedula) {
  const html = generarHtmlFichaTrabajador(estadoConsulta.datosCache, cedula, false);
  if (!html) return;
  document.querySelector('#vista-consulta .tabla-contenedor')?.classList.add('oculto');
  document.getElementById('barra-exportacion-masiva')?.classList.add('oculto');
  const fichaCont = document.getElementById('ficha-informe-trabajador');
  fichaCont.classList.remove('oculto');
  fichaCont.innerHTML = html;
}

export function renderizarTablaConsulta(nombreVista = 'consolidada') {
  const columnas = nombreVista === 'personalizada'
    ? TODAS_LAS_COLUMNAS.filter(c => c.visible)
    : (CONFIG_VISTAS[nombreVista] || CONFIG_VISTAS.consolidada);

  const thead = document.getElementById('tabla-resultados-head');
  const tbody = document.getElementById('tabla-resultados-body');
  const barraExport = document.getElementById('barra-exportacion-masiva');

  thead.innerHTML = `<tr>${columnas.map(col => `<th>${col.label}</th>`).join('')}<th>Acciones</th></tr>`;

  if (!estadoConsulta.datosCache.length) {
    if (barraExport) barraExport.classList.add('oculto');
    tbody.innerHTML = `<tr><td colspan="${columnas.length + 1}">No hay registros que coincidan con los filtros aplicados.</td></tr>`;
    return;
  }

  if (barraExport) barraExport.classList.remove('oculto');

  const filasAMostrar = ['hijos', 'vacaciones'].includes(nombreVista)
    ? estadoConsulta.datosCache
    : Array.from(new Map(estadoConsulta.datosCache.map(item => [item.id_trabajador, item])).values());

  tbody.innerHTML = filasAMostrar.map(fila => `
    <tr class="fila-seleccionable" onclick="window.seleccionarTrabajadorFila(event, '${fila.cedula}')">
      ${columnas.map(col => {
        const valor = fila[col.key] ?? (col.fallback ? fila[col.fallback] : null) ?? '-';
        return `<td>${valor}</td>`;
      }).join('')}
      <td style="white-space: nowrap;">
        <button type="button" class="btn-azul-claro btn-pequeno m-0" onclick="window.editarTrabajador(${fila.id_trabajador})">Editar</button>
        <button type="button" class="btn-confirmar-rojo btn-pequeno" onclick="window.borrarTrabajador(${fila.id_trabajador}, '${fila.cedula}')">Eliminar</button>
      </td>
    </tr>
  `).join('');
}

export function inicializarEventosConsulta() {
  const vistaConsulta = document.getElementById('vista-consulta');
  const inputBusqueda = document.getElementById('input-buscar-cedula');
  const inputFantasma = document.getElementById('input-buscar-fantasma');
  const btnBuscar = document.getElementById('btn-buscar-cedula');
  const btnLimpiar = document.getElementById('btn-limpiar-consulta');

  inicializarCheckboxesColumnas(renderizarTablaConsulta);

  consultarGet('/trabajadores/consolidado?limit=1000')
    .then(data => {
      estadoConsulta.todosLosRegistros = data;
      actualizarSugerenciasBusqueda(data);
      construirChipsDesdeRegistros(data, ejecutarFiltrosYRender);
    })
    .catch((err) => console.error('ERROR AL CARGAR DATOS:', err));

  // Delegación de clics (Exportación masiva y paneles desplegables)
  //vistaConsulta?.addEventListener('click', (e) => {
    document.querySelector('.contenedor-app')?.addEventListener('click', (e) => {
     const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.id === 'btn-exportar-excel-masivo') {
      if (!estadoConsulta.datosCache.length) {
        alert('Primero presione Buscar o seleccione una vista para cargar los registros.');
        return;
      }
      exportarExcelConsolidado(estadoConsulta.datosCache, 'Consolidado_Personal_SARHHRRS.xlsx');
    } else if (btn.id === 'btn-imprimir-tabla-masiva') {
      imprimirReporteConsolidado(estadoConsulta.datosCache, estadoConsulta.usarColumnasPersonalizadas);
    } else if (btn.id === 'btn-toggle-filtros-avanzados') {
      const panel = document.getElementById('panel-filtros-avanzados');
      panel?.classList.toggle('oculto');
      btn.classList.toggle('activo', !panel?.classList.contains('oculto'));
    } else if (btn.id === 'btn-toggle-columnas') {
      const panel = document.getElementById('panel-selector-columnas');
      panel?.classList.toggle('oculto');
      btn.classList.toggle('activo', !panel?.classList.contains('oculto'));

    } else if (btn.id === 'btn-agregar-regla') {
      agregarFilaReglaDinamica(ejecutarFiltrosYRender);
    }
  });

  const ejecutarBusqueda = async () => {
    if (inputFantasma) inputFantasma.value = '';
    estadoConsulta.sugerenciaActual = '';
    await cargarDatosConsulta(false);
  };

  btnBuscar?.addEventListener('click', ejecutarBusqueda);

  inputBusqueda?.addEventListener('input', () => {
    const escrito = inputBusqueda.value;
    if (inputFantasma) {
      if (!escrito) {
        inputFantasma.value = '';
        estadoConsulta.sugerenciaActual = '';
      } else {
        const coincidencia = estadoConsulta.listaSugerencias.find(op =>
          op.toLowerCase().startsWith(escrito.toLowerCase()) && op.toLowerCase() !== escrito.toLowerCase()
        );
        if (coincidencia) {
          estadoConsulta.sugerenciaActual = coincidencia;
          inputFantasma.value = `${escrito}${coincidencia.slice(escrito.length)}  ⇥ Tab`;
        } else {
          estadoConsulta.sugerenciaActual = '';
          inputFantasma.value = '';
        }
      }
    }
    if (estadoConsulta.todosLosRegistros.length) {
      clearTimeout(window._timerBusqLibre);
      window._timerBusqLibre = setTimeout(ejecutarFiltrosYRender, 250);
    }
  });

  inputBusqueda?.addEventListener('keydown', async (e) => {
    if (e.key === 'Tab' && estadoConsulta.sugerenciaActual) {
      e.preventDefault();
      inputBusqueda.value = estadoConsulta.sugerenciaActual;
      if (inputFantasma) inputFantasma.value = '';
      estadoConsulta.sugerenciaActual = '';
      ejecutarFiltrosYRender();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      await ejecutarBusqueda();
    }
  });

  btnLimpiar?.addEventListener('click', () => {
    estadoConsulta.datosCache = [];
    estadoConsulta.estatusSeleccionados.clear();
    estadoConsulta.cargosSeleccionados.clear();
    estadoConsulta.usarColumnasPersonalizadas = false;
    document.querySelectorAll('.chip-filtro').forEach(c => c.classList.remove('activo'));
    document.getElementById('panel-filtros-avanzados')?.classList.add('oculto');
    document.getElementById('panel-selector-columnas')?.classList.add('oculto');
    document.getElementById('btn-toggle-filtros-avanzados')?.classList.remove('activo');
    document.getElementById('btn-toggle-columnas')?.classList.remove('activo');

    const contReglas = document.getElementById('contenedor-reglas');
    if (contReglas) contReglas.innerHTML = '';

    document.getElementById('barra-exportacion-masiva')?.classList.add('oculto');
    mostrarVistaTabla();
    inputBusqueda.value = '';
    if (inputFantasma) inputFantasma.value = '';
    estadoConsulta.sugerenciaActual = '';
    document.querySelectorAll('.btn-filtro-vista').forEach(b => b.classList.remove('activo'));
    document.getElementById('tabla-resultados-head').innerHTML = '';
    document.getElementById('tabla-resultados-body').innerHTML = '';
    document.getElementById('#vista-consulta .tabla-contenedor')?.classList.add('oculto');
    /*document.getElementById('tabla-resultados-body').innerHTML =
      '<tr><td>Presione <strong>Buscar</strong>, tecla <strong>Enter</strong> o seleccione una vista para cargar los registros.</td></tr>';*/
  });

  document.querySelectorAll('.btn-filtro-vista').forEach(btn => {
    btn.addEventListener('click', async () => {
      estadoConsulta.usarColumnasPersonalizadas = false;
      if (inputFantasma) inputFantasma.value = '';
      document.querySelectorAll('.btn-filtro-vista').forEach(b => b.classList.remove('activo'));
      btn.classList.add('activo');
      await cargarDatosConsulta(false);
    });
  });

  // Modal de Eliminación
  const modalDialog = document.getElementById('modal-confirmacion');
  document.getElementById('btn-modal-cancelar')?.addEventListener('click', () => {
    modalDialog?.close();
    if (modalDialog) modalDialog.dataset.idEliminar = '';
  });

  document.getElementById('btn-modal-confirmar')?.addEventListener('click', async () => {
    const idEliminar = modalDialog?.dataset.idEliminar;
    if (!idEliminar) return;

    try {
      await eliminarRegistro(`/trabajadores/${idEliminar}`);
      modalDialog.close();
      modalDialog.dataset.idEliminar = '';
      alert('Registro eliminado definitivamente.');
      await cargarDatosConsulta(true);
    } catch (error) {
      alert('Error al eliminar: ' + error.message);
    }
  });
}

// Funciones Globales para botones inline en filas y ficha
window.volverAListaConsulta = () => mostrarVistaTabla();

window.seleccionarTrabajadorFila = (event, cedula) => {
  if (event.target.tagName === 'BUTTON') return;
  renderizarInformeTrabajador(cedula);
};

window.borrarTrabajador = (idTrabajador, cedula) => {
  if (!idTrabajador) return;
  if (!confirm(`¿Desea iniciar la eliminación del trabajador con cédula ${cedula}?`)) return;

  const modalDialog = document.getElementById('modal-confirmacion');
  if (!modalDialog) return;

  document.getElementById('modal-titulo').textContent = '⚠ Eliminación Definitiva';
  document.getElementById('modal-mensaje').textContent =
    `SEGUNDA CONFIRMACIÓN: ¿Está completamente seguro de eliminar de forma irreversible al trabajador con cédula ${cedula} y todos sus módulos asociados?`;
  modalDialog.dataset.idEliminar = String(idTrabajador);
  modalDialog.showModal();
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
  const registros = estadoConsulta.datosCache.filter(r => String(r.cedula) === String(cedula));
  exportarExcelConsolidado(registros, `Trabajador_${cedula}.xlsx`);
};


window.exportarExcelMasivo = () => {
  if (!estadoConsulta.datosCache.length) {
    alert('Primero presione Buscar o seleccione una vista para cargar los registros.');
    return;
  }
  exportarExcelConsolidado(estadoConsulta.datosCache, 'Consolidado_Personal_SARHHRRS.xlsx');
};

window.imprimirPdfMasivo = () => {
  if (!estadoConsulta.datosCache.length) {
    alert('Primero presione Buscar o seleccione una vista para cargar los registros.');
    return;
  }
  imprimirReporteConsolidado(estadoConsulta.datosCache, estadoConsulta.usarColumnasPersonalizadas);
  
};


