import { appState, actualizarDatosBasicos, actualizarSubSeccion, agregarItemLista, eliminarItemLista, reiniciarEstado } from '../state.js';
import { consultarGet, registrarTodo, actualizarTodo } from '../services/api.js';

export async function cargarCatalogosEnSelects() {
  try {
    const data = await consultarGet('/catalogos/');
    document.querySelectorAll('select[data-catalogo]').forEach(select => {
      const clave = select.dataset.catalogo;
      const lista = data[clave] || [];

      if (lista.length > 0) {
        select.innerHTML = '<option value="">Seleccione una opción...</option>';
        lista.forEach(item => {
          // value guarda el ID numérico para la BD, y el texto visible muestra item.nombre
          select.innerHTML += `<option value="${item.id}">${item.nombre}</option>`;
        });
      } else {
        select.innerHTML = `<option value="">Sin registros en ${clave}</option>`;
      }
    });
  } catch (error) {
    console.error('Error cargando catálogos:', error);
  }
}


export function renderizarTablasDinamicas() {
  const tbodyHijos = document.getElementById('lista-hijos-preview');
  tbodyHijos.innerHTML = appState.payload.hijos.map((h, i) => `
    <tr>
      <td>${h.nombre1_hijo} ${h.apellido1_hijo}</td>
      <td>${h.fecha_nacimiento_hijo || '-'}</td>
      <td>${h.cedula_hijo || 'S/C'}</td>
      <td>${h.sexo_hijo}</td>
      <td><button type="button" class="btn-secundario" onclick="window.eliminarHijo(${i})">Quitar</button></td>
    </tr>
  `).join('');

  const tbodyVac = document.getElementById('lista-vacaciones-preview');
  tbodyVac.innerHTML = appState.payload.vacaciones.map((v, i) => `
    <tr>
      <td>${v.periodos_vencidos}</td>
      <td>${v.ultimo_disfrutado}</td>
      <td>${v.fecha_solicitud || '-'}</td>
      <td>${v.tipo_vacaciones || '-'}</td>
      <td>${v.fecha_inicio_disfrute || '-'} / ${v.fecha_fin_disfrute || '-'}</td>
      <td>${v.notas_vacaciones || '-'}</td>
      <td><button type="button" class="btn-secundario" onclick="window.eliminarVacacion(${i})">Quitar</button></td>
    </tr>
  `).join('');

}

window.eliminarHijo = (i) => { eliminarItemLista('hijos', i); renderizarTablasDinamicas(); };
window.eliminarVacacion = (i) => { eliminarItemLista('vacaciones', i); renderizarTablasDinamicas(); };

const valStr = (id) => document.getElementById(id).value.trim();
const valNum = (id) => {
  const v = document.getElementById(id).value;
  return v === '' ? null : Number(v);
};

export function guardarPasoEnMemoria(pasoActual) {
  if (pasoActual === 1) {
    actualizarDatosBasicos({
      nacionalidad: valStr('nacionalidad'),
      cedula: valStr('cedula'),
      nombre_1: valStr('nombre_1'),
      nombre_2: valStr('nombre_2'),
      apellido_1: valStr('apellido_1'),
      apellido_2: valStr('apellido_2'),
      fecha_nacimiento: valStr('fecha_nacimiento'),
      sexo: valStr('sexo'),
      estado_civil: valStr('estado_civil'),
      direccion_habitacion: valStr('direccion_habitacion'),
      telefono: valStr('telefono'),
      correo: valStr('correo'),
      centro_votacion: valStr('centro_votacion'),
      observaciones: valStr('observaciones'),
      id_estatus: valNum('id_estatus')
    });
  } else if (pasoActual === 2) {
    actualizarSubSeccion('datos_laborales', {
      codigo_rac: valNum('codigo_rac'),
      carga_horaria: valNum('carga_horaria'),
      fecha_ingreso_apn: valStr('fecha_ingreso_apn') || null,
      fecha_ingreso_mpps: valStr('fecha_ingreso_mpps') || null,
      id_horario: valNum('id_horario'),
      id_estatus_contrato: valNum('id_estatus_contrato'),
      id_cargo: valNum('id_cargo'),
      id_nivel_grado: valNum('id_nivel_grado')
    });
  } else if (pasoActual === 3) {
    actualizarSubSeccion('ubicacion_laboral', {
      id_ubicacion_administrativa: valNum('id_ubicacion_administrativa'),
      id_ubicacion_fisica: valNum('id_ubicacion_fisica'),
      id_asic: valNum('id_asic'),
      id_red: valNum('id_red')
    });
  } else if (pasoActual === 4) {
    actualizarSubSeccion('salud_dotacion', {
      talla_pantalon: valStr('talla_pantalon'),
      talla_camisa: valStr('talla_camisa'),
      talla_zapatos: valNum('talla_zapatos'),
      patologias: valStr('patologias'),
      tratamiento: valStr('tratamiento')
    });
  }
}

export function rellenarFormularioDesdeEstado(idTrabajador = null) {
  const p = appState.payload;
  const idReal = idTrabajador || appState.idEditando;
  appState.idEditando = idReal;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val ?? '';
  };

  ['nacionalidad', 'cedula', 'nombre_1', 'nombre_2', 'apellido_1', 'apellido_2', 'fecha_nacimiento', 'sexo', 'estado_civil', 'direccion_habitacion', 'telefono', 'correo', 'centro_votacion', 'observaciones', 'id_estatus'].forEach(k => setVal(k, p[k]));
  Object.keys(p.datos_laborales).forEach(k => setVal(k, p.datos_laborales[k]));
  Object.keys(p.ubicacion_laboral).forEach(k => setVal(k, p.ubicacion_laboral[k]));
  Object.keys(p.salud_dotacion).forEach(k => setVal(k, p.salud_dotacion[k]));

  renderizarTablasDinamicas();

  document.getElementById('btn-modo-registro').classList.add('activo');
  document.getElementById('btn-modo-consulta').classList.remove('activo');
  document.getElementById('vista-registro').classList.remove('oculto');
  document.getElementById('vista-consulta').classList.add('oculto');

  const btnGuardar = document.getElementById('btn-guardar-todo');
  btnGuardar.dataset.idEditando = idReal ? String(idReal) : '';
  btnGuardar.textContent = `Actualizar Trabajador #${idReal}`;

  document.querySelectorAll('.paso').forEach(sec => {
    sec.classList.toggle('oculto', Number(sec.dataset.step) !== 1);
  });
  document.querySelectorAll('.indicador-paso').forEach(ind => {
    ind.classList.toggle('activo', Number(ind.dataset.ind) === 1);
  });
  appState.pasoActual = 1;
}

export function inicializarEventosWizard(cambiarPasoFn) {
  document.getElementById('btn-agregar-hijo').addEventListener('click', () => {
    const nombre1 = valStr('nombre1_hijo');
    const apellido1 = valStr('apellido1_hijo');
    if (!nombre1 || !apellido1) {
      alert('Indica al menos el primer nombre y primer apellido del hijo.');
      return;
    }

    agregarItemLista('hijos', {
      nombre1_hijo: nombre1,
      nombre2_hijo: valStr('nombre2_hijo'),
      apellido1_hijo: apellido1,
      apellido2_hijo: valStr('apellido2_hijo'),
      fecha_nacimiento_hijo: valStr('fecha_nacimiento_hijo') || null,
      nacionalidad_hijo: valStr('nacionalidad_hijo'),
      cedula_hijo: valStr('cedula_hijo') || null,
      sexo_hijo: valStr('sexo_hijo')
    });

    ['nombre1_hijo', 'nombre2_hijo', 'apellido1_hijo', 'apellido2_hijo', 'fecha_nacimiento_hijo', 'cedula_hijo'].forEach(id => {
      document.getElementById(id).value = '';
    });
    renderizarTablasDinamicas();
  });

  document.getElementById('btn-agregar-vacacion').addEventListener('click', () => {
    const periodosVencidos = valStr('periodos_vencidos');
    const ultimoDisfrutado = valStr('ultimo_disfrutado');

    if (!periodosVencidos || !ultimoDisfrutado) {
      alert('Indica al menos los periodos vencidos y el último periodo disfrutado.');
      return;
    }

    agregarItemLista('vacaciones', {
      periodos_vencidos: periodosVencidos,
      ultimo_disfrutado: ultimoDisfrutado,
      fecha_solicitud: valStr('fecha_solicitud') || null,
      tipo_vacaciones: valStr('tipo_vacaciones') || null,
      fecha_inicio_disfrute: valStr('fecha_inicio_disfrute') || null,
      fecha_fin_disfrute: valStr('fecha_fin_disfrute') || null,
      notas_vacaciones: valStr('notas_vacaciones') || null
    });

    [
      'periodos_vencidos',
      'ultimo_disfrutado',
      'fecha_solicitud',
      'tipo_vacaciones',
      'fecha_inicio_disfrute',
      'fecha_fin_disfrute',
      'notas_vacaciones'
    ].forEach(id => {
      document.getElementById(id).value = '';
    });
    renderizarTablasDinamicas();
  });


  document.getElementById('btn-guardar-todo').addEventListener('click', async (e) => {
    guardarPasoEnMemoria(appState.pasoActual);
    const boton = document.getElementById('btn-guardar-todo');

    // 1. Buscar el ID en dataset, en appState o extraerlo del texto del botón ("Actualizar Trabajador #12")
    let idEditar = boton.dataset.idEditando || appState.idEditando;
    if (!idEditar && boton.textContent.includes('#')) {
      idEditar = boton.textContent.split('#')[1]?.trim();
    }

    // 2. Evitar crear duplicado si estamos en modo edición
    const esModoEdicion = boton.textContent.toLowerCase().includes('actualizar');

    try {
      let respuesta;
      if (esModoEdicion || idEditar) {
        if (!idEditar) {
          alert('Error: No se detectó el ID del trabajador a actualizar.');
          return;
        }
        respuesta = await actualizarTodo(`/trabajadores/${idEditar}`, appState.payload);
      } else {
        respuesta = await registrarTodo('/trabajadores/', appState.payload);
      }

      alert(`${respuesta.mensaje} (ID: ${respuesta.id_trabajador})`);
      reiniciarEstado();
      renderizarTablasDinamicas();
      document.querySelectorAll('#vista-registro input').forEach(inp => inp.value = '');
      boton.dataset.idEditando = '';
      boton.textContent = 'Guardar Registro Completo';
      cambiarPasoFn(1);
    } catch (error) {
      alert('Error al procesar en FastAPI:\n' + error.message);
    }
  });
}
