// src/js/pages/consultaFiltros.js
import { TODAS_LAS_COLUMNAS, CAMPOS_REGLAS } from '../config/columnasConfig.js';

export const estadoConsulta = {
  todosLosRegistros: [],
  datosCache: [],
  estatusSeleccionados: new Set(),
  cargosSeleccionados: new Set(),
  usarColumnasPersonalizadas: false,
  listaSugerencias: [],
  sugerenciaActual: ''
};

// 1. Sugerencias para el Ghost Input
export function actualizarSugerenciasBusqueda(listaRegistros) {
  const setValores = new Set();
  listaRegistros.forEach(item => {
    if (item.nombre_1 && item.apellido_1) {
      setValores.add(`${item.nombre_1} ${item.apellido_1}`);
      setValores.add(`${item.apellido_1} ${item.nombre_1}`);
    }
    Object.entries(item).forEach(([clave, valor]) => {
      if (valor !== null && valor !== undefined && !clave.startsWith('id_')) {
        const texto = String(valor).trim();
        if (texto.length >= 2) setValores.add(texto);
      }
    });
  });
  estadoConsulta.listaSugerencias = Array.from(setValores);
}

// 2. Chips rápidos de Estatus y Cargo
export function construirChipsDesdeRegistros(lista, onFiltrar) {
  const contEstatus = document.getElementById('chips-estatus');
  const contCargo = document.getElementById('chips-cargo');
  if (!contEstatus || !contCargo) return;

  const estatusUnicos = Array.from(new Set(lista.map(r => r.estatus_actividad).filter(Boolean))).sort();
  const cargosUnicos = Array.from(new Set(lista.map(r => r.nombre_cargo).filter(Boolean))).sort();

  contEstatus.innerHTML = estatusUnicos.map(est => `
    <button type="button" class="chip-filtro ${estadoConsulta.estatusSeleccionados.has(est) ? 'activo' : ''}" data-tipo="estatus" data-valor="${est}">
      ● ${est}
    </button>
  `).join('');

  contCargo.innerHTML = cargosUnicos.slice(0, 10).map(car => `
    <button type="button" class="chip-filtro ${estadoConsulta.cargosSeleccionados.has(car) ? 'activo' : ''}" data-tipo="cargo" data-valor="${car}">
      💼 ${car}
    </button>
  `).join('');

  document.querySelectorAll('.chip-filtro').forEach(btn => {
    btn.addEventListener('click', () => {
      const val = btn.dataset.valor;
      const setObjetivo = btn.dataset.tipo === 'estatus'
        ? estadoConsulta.estatusSeleccionados
        : estadoConsulta.cargosSeleccionados;

      if (setObjetivo.has(val)) {
        setObjetivo.delete(val);
        btn.classList.remove('activo');
      } else {
        setObjetivo.add(val);
        btn.classList.add('activo');
      }
      onFiltrar();
    });
  });
}

// 3. Selector de Columnas Dinámicas
export function inicializarCheckboxesColumnas(onRenderTabla) {
  const grid = document.getElementById('grid-checkboxes-columnas');
  if (!grid) return;

  grid.innerHTML = TODAS_LAS_COLUMNAS.map((col, idx) => `
    <label class="label-checkbox-columna">
      <input type="checkbox" data-col-idx="${idx}" ${col.visible ? 'checked' : ''} />
      ${col.label}
    </label>
  `).join('');

  grid.querySelectorAll('input[type="checkbox"]').forEach(chk => {
    chk.addEventListener('change', (e) => {
      const idx = Number(e.target.dataset.colIdx);
      TODAS_LAS_COLUMNAS[idx].visible = e.target.checked;
      estadoConsulta.usarColumnasPersonalizadas = true;
      document.querySelectorAll('.btn-filtro-vista').forEach(b => b.classList.remove('activo'));

      const activas = TODAS_LAS_COLUMNAS.filter(c => c.visible).length;
      const btnCol = document.getElementById('btn-toggle-columnas');
      if (btnCol) btnCol.textContent = `⚙ Columnas (${activas})`;

      onRenderTabla('personalizada');
    });
  });
}

// 4. Constructor de Reglas Dinámicas
export function agregarFilaReglaDinamica(onFiltrar) {
  const contenedor = document.getElementById('contenedor-reglas');
  if (!contenedor) return;

  const fila = document.createElement('div');
  fila.className = 'fila-regla';

  const opciones = CAMPOS_REGLAS.map(c => `<option value="${c.key}">${c.label}</option>`).join('');
  fila.innerHTML = `
    <select class="regla-campo">${opciones}</select>
    <select class="regla-operador">
      <option value="igual">Es igual a</option>
      <option value="contiene">Contiene</option>
      <option value="mayor_que">Mayor que</option>
      <option value="menor_que">Menor que</option>
    </select>
    <input type="text" class="regla-valor" placeholder="Escriba valor..." />
    <button type="button" class="btn-eliminar-regla" title="Eliminar">✖</button>
  `;

  fila.querySelector('.btn-eliminar-regla').addEventListener('click', () => {
    fila.remove();
    onFiltrar();
  });

  fila.querySelector('.regla-campo').addEventListener('change', onFiltrar);
  fila.querySelector('.regla-operador').addEventListener('change', onFiltrar);
  fila.querySelector('.regla-valor').addEventListener('input', () => {
    clearTimeout(window._timerRegla);
    window._timerRegla = setTimeout(onFiltrar, 250);
  });

  contenedor.appendChild(fila);
}

// 5. Motor de Filtrado en Memoria
export function filtrarRegistrosEnMemoria() {
  const textoLibre = (document.getElementById('input-buscar-cedula')?.value || '').trim().toLowerCase();

  const reglasActivas = [];
  document.querySelectorAll('.fila-regla').forEach(fila => {
    const val = fila.querySelector('.regla-valor').value.trim();
    if (val !== '') {
      reglasActivas.push({
        campo: fila.querySelector('.regla-campo').value,
        operador: fila.querySelector('.regla-operador').value,
        valor: val.toLowerCase()
      });
    }
  });

  estadoConsulta.datosCache = estadoConsulta.todosLosRegistros.filter(fila => {
    if (estadoConsulta.estatusSeleccionados.size > 0 && !estadoConsulta.estatusSeleccionados.has(fila.estatus_actividad)) return false;
    if (estadoConsulta.cargosSeleccionados.size > 0 && !estadoConsulta.cargosSeleccionados.has(fila.nombre_cargo)) return false;

    for (const r of reglasActivas) {
      const datoCrudo = fila[r.campo];
      if (datoCrudo === null || datoCrudo === undefined) return false;
      const datoStr = String(datoCrudo).toLowerCase();

      if (r.operador === 'igual' && datoStr !== r.valor) return false;
      if (r.operador === 'contiene' && !datoStr.includes(r.valor)) return false;
      if (r.operador === 'mayor_que' && !(Number(datoCrudo) > Number(r.valor))) return false;
      if (r.operador === 'menor_que' && !(Number(datoCrudo) < Number(r.valor))) return false;
    }

    if (textoLibre) {
      const palabras = textoLibre.split(/\s+/);
      const textoFila = Object.values(fila)
        .filter(v => v !== null && v !== undefined)
        .map(v => String(v).toLowerCase())
        .join(' ');
      if (!palabras.every(p => textoFila.includes(p))) return false;
    }

    return true;
  });
}
