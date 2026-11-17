import { appState, actualizarDatosBasicos, actualizarSubSeccion, agregarItemLista, eliminarItemLista, reiniciarEstado } from '../state.js';
import { consultarGet, registrarTodo } from '../services/api.js';

export async function cargarCatalogosEnSelects() {
  try {
    const data = await consultarGet('/catalogos/');
    document.querySelectorAll('select[data-catalogo]').forEach(select => {
      const claveCatalogo = select.dataset.catalogo;
      const lista = data[claveCatalogo] || [];
      
      select.innerHTML = '<option value="">Seleccione una opción...</option>';
      lista.forEach(item => {
        const valores = Object.values(item);
        const idValor = item.id !== undefined ? item.id : valores[0];
        const texto = item.nombre || item.descripcion || valores[1] || valores[0];
        select.innerHTML += `<option value="${idValor}">${texto}</option>`;
      });
    });
  } catch (error) {
    console.error('Error cargando catálogos:', error);
  }
}

function renderizarTablasDinamicas() {
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
      <td>${v.fecha_asignada_inicio || '-'} / ${v.fecha_asignada_fin || '-'}</td>
      <td>${v.fecha_inicio_disfrutada || '-'} / ${v.fecha_fin_disfrutada || '-'}</td>
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
    agregarItemLista('vacaciones', {
      periodos_vencidos: valStr('periodos_vencidos'),
      ultimo_disfrutado: valStr('ultimo_disfrutado'),
      fecha_asignada_inicio: valStr('fecha_asignada_inicio') || null,
      fecha_asignada_fin: valStr('fecha_asignada_fin') || null,
      fecha_inicio_disfrutada: valStr('fecha_inicio_disfrutada') || null,
      fecha_fin_disfrutada: valStr('fecha_fin_disfrutada') || null
    });

    ['periodos_vencidos', 'ultimo_disfrutado', 'fecha_asignada_inicio', 'fecha_asignada_fin', 'fecha_inicio_disfrutada', 'fecha_fin_disfrutada'].forEach(id => {
      document.getElementById(id).value = '';
    });
    renderizarTablasDinamicas();
  });

  document.getElementById('btn-guardar-todo').addEventListener('click', async () => {
    try {
      const respuesta = await registrarTodo('/trabajadores/', appState.payload);
      alert(`${respuesta.mensaje} (ID: ${respuesta.id_trabajador})`);
      reiniciarEstado();
      renderizarTablasDinamicas();
      document.querySelectorAll('#vista-registro input').forEach(inp => inp.value = '');
      cambiarPasoFn(1);
    } catch (error) {
      alert('Error al guardar en FastAPI:\n' + error.message);
    }
  });
}
