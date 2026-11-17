import {
  obtenerCatalogos,
  registrarTrabajadorCompleto,
  obtenerConsolidado,
  buscarConsolidadoPorCedula,
} from './services/api.js';


let pasoActual = 1;
const totalPasos = 5;

document.addEventListener('DOMContentLoaded', async () => {
  inicializarPestanas();
  inicializarWizard();
  inicializarEventosDinamicos();
  await cargarCatalogosEnSelects();
  await cargarTablaConsolidada();
});

/* --- 1. Navegación por Pestañas --- */
function inicializarPestanas() {
  const botones = document.querySelectorAll('.tab-btn');
  const contenidos = document.querySelectorAll('.tab-content');

  botones.forEach((btn) => {
    btn.addEventListener('click', () => {
      botones.forEach((b) => b.classList.remove('active'));
      contenidos.forEach((c) => c.classList.remove('active'));

      btn.classList.add('active');
      const destino = document.getElementById(btn.dataset.target);
      if (destino) destino.classList.add('active');

      if (btn.dataset.target === 'tab-consulta') {
        cargarTablaConsolidada();
      }
    });
  });
}

/* --- 2. Carga Dinámica de los 9 Catálogos --- */
async function cargarCatalogosEnSelects() {
  try {
    const catalogos = await obtenerCatalogos();
    const mapaSelects = {
      id_sexo: catalogos.sexos || [],
      id_estado_civil: catalogos.estados_civiles || [],
      id_nivel_academico: catalogos.niveles_academicos || [],
      id_cargo: catalogos.cargos || [],
      id_tipo_contrato: catalogos.tipos_contrato || [],
      id_estatus_laboral: catalogos.estatus_laborales || [],
      id_ubicacion_administrativa: catalogos.ubicaciones_administrativas || [],
      id_ubicacion_fisica: catalogos.ubicaciones_fisicas || [],
      id_tipo_sangre: catalogos.tipos_sangre || [],
    };

    Object.entries(mapaSelects).forEach(([selectId, items]) => {
      const select = document.getElementById(selectId);
      if (!select) return;

      select.innerHTML = '<option value="">Seleccione...</option>';
      items.forEach((item) => {
        const option = document.createElement('option');
        option.value = item.id;
        option.textContent = item.nombre || item.descripcion;
        select.appendChild(option);
      });
    });
  } catch (error) {
    mostrarAlerta('Error al cargar los catálogos del servidor.', 'error');
  }
}

/* --- 3. Navegación del Wizard (5 Pantallas) --- */
function inicializarWizard() {
  const btnAnterior = document.getElementById('btn-prev');
  const btnSiguiente = document.getElementById('btn-next');
  const form = document.getElementById('form-trabajador');

  btnAnterior?.addEventListener('click', () => {
    if (pasoActual > 1) {
      pasoActual--;
      actualizarVistaWizard();
    }
  });

  btnSiguiente?.addEventListener('click', () => {
    if (!validarPasoActual()) return;
    if (pasoActual < totalPasos) {
      pasoActual++;
      actualizarVistaWizard();
    }
  });

  form?.addEventListener('submit', manejarEnvioFormulario);
  actualizarVistaWizard();
}


/* --- Continuación de Parte 1 --- */
function actualizarVistaWizard() {
  document.querySelectorAll('.wizard-panel').forEach((panel, index) => {
    panel.classList.toggle('active', index + 1 === pasoActual);
  });

  document.querySelectorAll('.step-indicator').forEach((ind, index) => {
    ind.classList.remove('active', 'completed');
    if (index + 1 === pasoActual) ind.classList.add('active');
    if (index + 1 < pasoActual) ind.classList.add('completed');
  });

  const btnAnterior = document.getElementById('btn-prev');
  const btnSiguiente = document.getElementById('btn-next');
  const btnGuardar = document.getElementById('btn-submit');

  if (btnAnterior) btnAnterior.style.display = pasoActual === 1 ? 'none' : 'inline-block';
  if (btnSiguiente) btnSiguiente.style.display = pasoActual === totalPasos ? 'none' : 'inline-block';
  if (btnGuardar) btnGuardar.style.display = pasoActual === totalPasos ? 'inline-block' : 'none';
}

function validarPasoActual() {
  const panelActivo = document.querySelector(`.wizard-panel[data-step="${pasoActual}"]`);
  if (!panelActivo) return true;

  const campos = panelActivo.querySelectorAll('input[required], select[required]');
  for (const campo of campos) {
    if (!campo.checkValidity()) {
      campo.reportValidity();
      return false;
    }
  }
  return true;
}

/* --- 4. Agregado Dinámico de Hijos y Vacaciones (1:N) --- */
function inicializarEventosDinamicos() {
  document.getElementById('btn-add-hijo')?.addEventListener('click', agregarBloqueHijo);
  document.getElementById('btn-add-vacacion')?.addEventListener('click', agregarBloqueVacacion);
  document.getElementById('btn-buscar-cedula')?.addEventListener('click', manejarBusquedaCedula);
  document.getElementById('btn-limpiar-busqueda')?.addEventListener('click', cargarTablaConsolidada);
}

function agregarBloqueHijo() {
  const contenedor = document.getElementById('lista-hijos');
  const div = document.createElement('div');
  div.className = 'dynamic-item hijo-item';
  div.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label>Nombres y Apellidos *</label>
        <input type="text" name="hijo_nombre" required />
      </div>
      <div class="form-group">
        <label>Fecha de Nacimiento *</label>
        <input type="date" name="hijo_fecha_nacimiento" required />
      </div>
      <div class="form-group">
        <label>Sexo *</label>
        <select name="hijo_sexo" required>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
    </div>
    <button type="button" class="btn btn-danger btn-remove">Eliminar Hijo</button>
  `;
  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  contenedor.appendChild(div);
}

function agregarBloqueVacacion() {
  const contenedor = document.getElementById('lista-vacaciones');
  const div = document.createElement('div');
  div.className = 'dynamic-item vacacion-item';
  div.innerHTML = `
    <div class="form-grid">
      <div class="form-group">
        <label>Período (Ej. 2025-2026) *</label>
        <input type="text" name="vac_periodo" required />
      </div>
      <div class="form-group">
        <label>Fecha Inicio *</label>
        <input type="date" name="vac_fecha_inicio" required />
      </div>
      <div class="form-group">
        <label>Fecha Fin *</label>
        <input type="date" name="vac_fecha_fin" required />
      </div>
      <div class="form-group">
        <label>Días Disfrutados *</label>
        <input type="number" name="vac_dias" min="1" required />
      </div>
    </div>
    <button type="button" class="btn btn-danger btn-remove">Eliminar Vacación</button>
  `;
  div.querySelector('.btn-remove').addEventListener('click', () => div.remove());
  contenedor.appendChild(div);
}


/* --- Continuación de Parte 2 --- */
function construirPayloadCompleto() {
  const val = (id) => document.getElementById(id)?.value?.trim() || null;
  const num = (id) => {
    const v = document.getElementById(id)?.value;
    return v ? Number(v) : null;
  };

  const hijos = Array.from(document.querySelectorAll('.hijo-item')).map((item) => ({
    nombre_completo: item.querySelector('[name="hijo_nombre"]').value.trim(),
    fecha_nacimiento: item.querySelector('[name="hijo_fecha_nacimiento"]').value,
    sexo: item.querySelector('[name="hijo_sexo"]').value,
  }));

  const vacaciones = Array.from(document.querySelectorAll('.vacacion-item')).map((item) => ({
    periodo: item.querySelector('[name="vac_periodo"]').value.trim(),
    fecha_inicio: item.querySelector('[name="vac_fecha_inicio"]').value,
    fecha_fin: item.querySelector('[name="vac_fecha_fin"]').value,
    dias_disfrutados: Number(item.querySelector('[name="vac_dias"]').value),
  }));

  return {
    trabajador: {
      cedula: val('cedula'),
      nombres: val('nombres'),
      apellidos: val('apellidos'),
      fecha_nacimiento: val('fecha_nacimiento'),
      id_sexo: num('id_sexo'),
      id_estado_civil: num('id_estado_civil'),
      id_nivel_academico: num('id_nivel_academico'),
      telefono: val('telefono'),
      correo: val('correo'),
      direccion: val('direccion'),
    },
    datos_laborales: {
      fecha_ingreso: val('fecha_ingreso'),
      id_cargo: num('id_cargo'),
      id_tipo_contrato: num('id_tipo_contrato'),
      id_estatus_laboral: num('id_estatus_laboral'),
      salario_base: num('salario_base'),
    },
    ubicacion_laboral: {
      id_ubicacion_administrativa: num('id_ubicacion_administrativa'),
      id_ubicacion_fisica: num('id_ubicacion_fisica'),
      piso_oficina: val('piso_oficina'),
    },
    salud_dotacion: {
      id_tipo_sangre: num('id_tipo_sangre'),
      alergias: val('alergias'),
      talla_camisa: val('talla_camisa'),
      talla_pantalon: val('talla_pantalon'),
      talla_calzado: val('talla_calzado'),
    },
    hijos,
    vacaciones,
  };
}

async function manejarEnvioFormulario(evento) {
  evento.preventDefault();
  if (!validarPasoActual()) return;

  try {
    const payload = construirPayloadCompleto();
    await registrarTrabajadorCompleto(payload);


    mostrarAlerta('Trabajador y registros asociados guardados correctamente.', 'success');
    evento.target.reset();
    document.getElementById('lista-hijos').innerHTML = '';
    document.getElementById('lista-vacaciones').innerHTML = '';
    pasoActual = 1;
    actualizarVistaWizard();
  } catch (error) {
    mostrarAlerta(error.message || 'Error al registrar el trabajador.', 'error');
  }
}

/* --- 6. Tabla Consolidada (vista_consolidado_trabajador) --- */
async function cargarTablaConsolidada() {
  try {
    const registros = await obtenerConsolidado();
    renderizarTabla(registros);
  } catch (error) {
    mostrarAlerta('No se pudo cargar el listado consolidado.', 'error');
  }
}

async function manejarBusquedaCedula() {
  const cedula = document.getElementById('input-buscar-cedula')?.value?.trim();
  if (!cedula) return cargarTablaConsolidada();

  try {
    const resultado = await buscarConsolidadoPorCedula(cedula);
    const lista = Array.isArray(resultado) ? resultado : resultado ? [resultado] : [];
    renderizarTabla(lista);
  } catch (error) {
    renderizarTabla([]);
    mostrarAlerta('No se encontró ningún trabajador con esa cédula.', 'error');
  }
}

function renderizarTabla(registros) {
  const tbody = document.getElementById('tbody-consolidado');
  if (!tbody) return;

  if (!registros.length) {
    tbody.innerHTML = '<tr><td colspan="7">No hay registros disponibles.</td></tr>';
    return;
  }

  tbody.innerHTML = registros
    .map(
      (r) => `
      <tr>
        <td>${r.cedula ?? ''}</td>
        <td>${r.nombres ?? ''} ${r.apellidos ?? ''}</td>
        <td>${r.cargo ?? r.nombre_cargo ?? ''}</td>
        <td>${r.ubicacion_administrativa ?? ''}</td>
        <td>${r.estatus_laboral ?? ''}</td>
        <td>${r.cantidad_hijos ?? 0}</td>
        <td>${r.dias_vacaciones_acumulados ?? 0}</td>
      </tr>
    `
    )
    .join('');
}

function mostrarAlerta(mensaje, tipo) {
  const alerta = document.getElementById('app-alert');
  if (!alerta) return;

  alerta.textContent = mensaje;
  alerta.className = `alert ${tipo}`;
  setTimeout(() => {
    alerta.className = 'alert';
  }, 5000);
}
