import '../css/main.css';
import { appState } from './state.js';

// 1. Importar las plantillas de vistas HTML
import { renderConsultaView } from './views/consultaView.js';
import { renderRegistroView } from './views/registroView.js';
import { renderModalesView } from './views/modalesView.js';
//import { inicializarEventosConsulta } from './pages/consultas.js';
import { renderConsultaSidebarView } from './views/consultaSidebarView.js';

// 2. Importar la lógica funcional de cada módulo
import { cargarCatalogosEnSelects, guardarPasoEnMemoria, inicializarEventosWizard } from './pages/wizard.js';import { inicializarEventosConsulta } from './pages/consultas.js';


document.addEventListener('DOMContentLoaded', () => {
  // PASO A: Inyectar primero todo el HTML en sus contenedores vacíos
  const vistaConsulta = document.getElementById('vista-consulta');
  const vistaRegistro = document.getElementById('vista-registro');
  const contModales = document.getElementById('contenedor-modales');
  const sidebarConsulta = document.getElementById('sidebar-consulta-contenedor');

  if (vistaConsulta) vistaConsulta.innerHTML = renderConsultaView();
  if (vistaRegistro) vistaRegistro.innerHTML = renderRegistroView();
  if (contModales) contModales.innerHTML = renderModalesView();
  if (sidebarConsulta) sidebarConsulta.innerHTML = renderConsultaSidebarView();

  // PASO B: Ahora que los elementos existen en el DOM, inicializar los módulos
  cargarCatalogosEnSelects();
  inicializarEventosConsulta();

  const btnRegistro = document.getElementById('btn-modo-registro');
  const btnConsulta = document.getElementById('btn-modo-consulta');

  const zonaChips = document.getElementById('zona-chips-rapidos');

  btnRegistro.addEventListener('click', () => {
    btnRegistro.classList.add('activo');
    btnConsulta.classList.remove('activo');
    vistaRegistro.classList.remove('oculto');
    vistaConsulta.classList.add('oculto');
    zonaChips?.classList.add('oculto');
    sidebarConsulta?.classList.add('oculto');
  });

  btnConsulta.addEventListener('click', () => {
    btnConsulta.classList.add('activo');
    btnRegistro.classList.remove('activo');
    vistaConsulta.classList.remove('oculto');
    vistaRegistro.classList.add('oculto');
    sidebarConsulta?.classList.remove('oculto');
    zonaChips?.classList.remove('oculto');
  });

  function cambiarPaso(numeroPaso) {
    document.querySelectorAll('.paso').forEach(sec => {
      sec.classList.toggle('oculto', Number(sec.dataset.step) !== numeroPaso);
    });
    document.querySelectorAll('.indicador-paso').forEach(ind => {
      ind.classList.toggle('activo', Number(ind.dataset.ind) === numeroPaso);
    });
    appState.pasoActual = numeroPaso;
  }

  document.querySelectorAll('[data-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      guardarPasoEnMemoria(appState.pasoActual);
      cambiarPaso(Number(btn.dataset.next));
    });
  });

  document.querySelectorAll('[data-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      guardarPasoEnMemoria(appState.pasoActual);
      cambiarPaso(Number(btn.dataset.prev));
    });
  });

  inicializarEventosWizard(cambiarPaso);
});
