import '../css/main.css';
import { appState } from './state.js';
import { cargarCatalogosEnSelects, guardarPasoEnMemoria, inicializarEventosWizard } from './pages/wizard.js';
import { inicializarEventosConsulta } from './pages/consultas.js';

document.addEventListener('DOMContentLoaded', () => {
  cargarCatalogosEnSelects();
  inicializarEventosConsulta();

  const btnRegistro = document.getElementById('btn-modo-registro');
  const btnConsulta = document.getElementById('btn-modo-consulta');
  const vistaRegistro = document.getElementById('vista-registro');
  const vistaConsulta = document.getElementById('vista-consulta');

  btnRegistro.addEventListener('click', () => {
    btnRegistro.classList.add('activo');
    btnConsulta.classList.remove('activo');
    vistaRegistro.classList.remove('oculto');
    vistaConsulta.classList.add('oculto');
  });

  btnConsulta.addEventListener('click', () => {
    btnConsulta.classList.add('activo');
    btnRegistro.classList.remove('activo');
    vistaConsulta.classList.remove('oculto');
    vistaRegistro.classList.add('oculto');
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
