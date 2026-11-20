// Ajusta esta URL con el puerto y ruta exacta de tu backend FastAPI
const API_FILTROS_URL = "http://127.0.0";

// Configuración maestro de columnas (6 visibles por defecto)
export const COLUMNAS_CONFIG = [
  { key: "cedula", label: "Cédula", visible: true },
  { key: "nombre_completo", label: "Nombre Completo", visible: true },
  { key: "nombre_cargo", label: "Cargo", visible: true },
  { key: "estatus_actividad", label: "Estatus", visible: true },
  { key: "nombre_ubicacion_fisica", label: "Ubicación Física", visible: true },
  { key: "telefono", label: "Teléfono", visible: true },
  // Columnas adicionales ocultas por defecto
  { key: "sexo", label: "Sexo", visible: false },
  { key: "estado_civil", label: "Estado Civil", visible: false },
  { key: "correo", label: "Correo", visible: false },
  { key: "codigo_rac", label: "Código RAC", visible: false },
  { key: "carga_horaria", label: "Carga Horaria", visible: false },
  { key: "opciones_contrato", label: "Tipo Contrato", visible: false },
  { key: "nombre_asic", label: "ASIC", visible: false },
  { key: "talla_camisa", label: "Talla Camisa", visible: false },
  { key: "talla_pantalon", label: "Talla Pantalón", visible: false },
  { key: "talla_zapatos", label: "Talla Zapatos", visible: false },
  { key: "patologias", label: "Patologías", visible: false },
  { key: "cantidad_hijos", label: "N° Hijos", visible: false },
];

// Campos disponibles para el constructor de reglas
const CAMPOS_REGLAS = [
  { key: "codigo_rac", label: "Código RAC", tipo: "numero" },
  { key: "carga_horaria", label: "Carga Horaria", tipo: "numero" },
  { key: "sexo", label: "Sexo (M/F)", tipo: "texto" },
  { key: "talla_camisa", label: "Talla Camisa", tipo: "texto" },
  { key: "talla_pantalon", label: "Talla Pantalón", tipo: "texto" },
  { key: "talla_zapatos", label: "Talla Zapatos", tipo: "numero" },
  { key: "patologias", label: "Patologías", tipo: "texto" },
];

export const estadoFiltros = {
  estatus_ids: new Set(),
  cargo_ids: new Set(),
  resultadosActuales: [],
};

// 1. Inicializar Chips de Estatus y Cargo desde tus catálogos ya cargados
export function renderizarChipsCatalogos(listaEstatus, listaCargos) {
  const contEstatus = document.getElementById("chips-estatus");
  const contCargo = document.getElementById("chips-cargo");

  if (!contEstatus || !contCargo) return;

  contEstatus.innerHTML = listaEstatus
    .map((e) => `<button type="button" class="chip-filtro" data-tipo="estatus" data-id="${e.id_estatus}">● ${e.nombre_estatus}</button>`)
    .join("");

  contCargo.innerHTML = listaCargos
    .slice(0, 8)
    .map((c) => `<button type="button" class="chip-filtro" data-tipo="cargo" data-id="${c.id_cargo}">💼 ${c.nombre_cargo}</button>`)
    .join("");

  document.querySelectorAll(".chip-filtro").forEach((btn) => {
    btn.addEventListener("click", () => {
      const id = Number(btn.dataset.id);
      const setDestino = btn.dataset.tipo === "estatus" ? estadoFiltros.estatus_ids : estadoFiltros.cargo_ids;

      if (setDestino.has(id)) {
        setDestino.delete(id);
        btn.classList.remove("activo");
      } else {
        setDestino.add(id);
        btn.classList.add("activo");
      }
      ejecutarBusquedaDinamica();
    });
  });
}

// 2. Renderizar Selector de Columnas
export function inicializarSelectorColumnas() {
  const grid = document.getElementById("grid-checkboxes-columnas");
  if (!grid) return;

  grid.innerHTML = COLUMNAS_CONFIG.map(
    (col, idx) => `
    <label class="label-checkbox-columna">
      <input type="checkbox" data-col-idx="${idx}" ${col.visible ? "checked" : ""} />
      ${col.label}
    </label>
  `
  ).join("");

  grid.querySelectorAll("input[type='checkbox']").forEach((chk) => {
    chk.addEventListener("change", (e) => {
      const idx = Number(e.target.dataset.colIdx);
      COLUMNAS_CONFIG[idx].visible = e.target.checked;
      const activas = COLUMNAS_CONFIG.filter((c) => c.visible).length;
      const btnCol = document.getElementById("btn-toggle-columnas");
      if (btnCol) btnCol.textContent = `⚙ Columnas (${activas})`;
      renderizarTablaDinamica(estadoFiltros.resultadosActuales);
    });
  });
}

// 3. Constructor de Reglas Dinámicas (+ Añadir Condición)
export function agregarFilaRegla() {
  const contenedor = document.getElementById("contenedor-reglas");
  if (!contenedor) return;

  const fila = document.createElement("div");
  fila.className = "fila-regla";

  const opcionesCampos = CAMPOS_REGLAS.map((c) => `<option value="${c.key}">${c.label}</option>`).join("");

  fila.innerHTML = `
    <select class="regla-campo">${opcionesCampos}</select>
    <select class="regla-operador">
      <option value="igual">Es igual a</option>
      <option value="contiene">Contiene</option>
      <option value="mayor_que">Mayor que</option>
      <option value="menor_que">Menor que</option>
    </select>
    <input type="text" class="regla-valor" placeholder="Valor..." />
    <button type="button" class="btn-eliminar-regla" title="Eliminar condición">✖</button>
  `;

  fila.querySelector(".btn-eliminar-regla").addEventListener("click", () => {
    fila.remove();
    ejecutarBusquedaDinamica();
  });

  fila.querySelector(".regla-campo").addEventListener("change", ejecutarBusquedaDinamica);
  fila.querySelector(".regla-operador").addEventListener("change", ejecutarBusquedaDinamica);
  fila.querySelector(".regla-valor").addEventListener("input", () => {
    clearTimeout(window._timerRegla);
    window._timerRegla = setTimeout(ejecutarBusquedaDinamica, 350);
  });

  contenedor.appendChild(fila);
}

// 4. Ejecutar consulta al Backend FastAPI
export async function ejecutarBusquedaDinamica() {
  const reglas = [];
  document.querySelectorAll(".fila-regla").forEach((fila) => {
    const valor = fila.querySelector(".regla-valor").value.trim();
    if (valor !== "") {
      reglas.push({
        campo: fila.querySelector(".regla-campo").value,
        operador: fila.querySelector(".regla-operador").value,
        valor: valor,
      });
    }
  });

  const payload = {
    busqueda_libre: document.getElementById("input-buscar-cedula")?.value || "",
    estatus_ids: Array.from(estadoFiltros.estatus_ids),
    cargo_ids: Array.from(estadoFiltros.cargo_ids),
    reglas: reglas,
  };

  try {
    const resp = await fetch(API_FILTROS_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error("Error del servidor:", resp.status, await resp.text());
      return;
    }

    const datos = await resp.json();
    estadoFiltros.resultadosActuales = datos;
    renderizarTablaDinamica(datos);
  } catch (error) {
    console.error("Error de conexión con el backend:", error);
  }
}

// 5. Dibujar Tabla solo con columnas activas
export function renderizarTablaDinamica(datos) {
  const thead = document.getElementById("tabla-resultados-head");
  const tbody = document.getElementById("tabla-resultados-body");
  if (!thead || !tbody) return;

  const activas = COLUMNAS_CONFIG.filter((c) => c.visible);

  thead.innerHTML = `<tr>${activas.map((c) => `<th>${c.label}</th>`).join("")}<th>Acciones</th></tr>`;

  if (!datos.length) {
    tbody.innerHTML = `<tr><td colspan="${activas.length + 1}">No se encontraron trabajadores con esos filtros.</td></tr>`;
    return;
  }

  tbody.innerHTML = datos
    .map(
      (persona) => `
      <tr>
        ${activas.map((c) => `<td>${persona[c.key] ?? "-"}</td>`).join("")}
        <td><button type="button" class="btn-azul-claro m-0" data-ver-ficha="${persona.id_trabajador}">Ver Ficha</button></td>
      </tr>`
    )
    .join("");

  document.getElementById("barra-exportacion-masiva")?.classList.remove("oculto");
}
