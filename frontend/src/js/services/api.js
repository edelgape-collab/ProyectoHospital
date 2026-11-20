// src/js/services/api.js

//const URL_V1 = import.meta.env.VITE_API_URL;
const esLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
const URL_V1 = esLocal
  ? import.meta.env.VITE_API_URL
  : (import.meta.env.VITE_API_TUNNEL_URL || import.meta.env.VITE_API_URL);



/**
 * Envía el paquete JSON consolidado de las 6 tablas hacia FastAPI
 * @param {string} endpoint - Ruta en router trabajadores (ej: '/trabajadores/')
 * @param {object} payload - Objeto completo appState.payload
 */
export async function registrarTodo(endpoint, payload) {
  const response = await fetch(`${URL_V1}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detalle = Array.isArray(errorData.detail)
      ? errorData.detail.map(err => `${err.loc.slice(1).join('.')}: ${err.msg}`).join(' | ')
      : errorData.detail || `Error HTTP ${response.status}`;
    throw new Error(detalle);
  }

  return await response.json();
}

/**
 * Consulta cualquier vista GET (consolidada, por tabla o catálogos)
 * @param {string} endpoint - Ruta relativa después de /api/v1
 */
export async function consultarGet(endpoint) {
  const response = await fetch(`${URL_V1}${endpoint}`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json'
    }
  });

  if (!response.ok) {
    throw new Error(`Error al consultar ${endpoint} (HTTP ${response.status})`);
  }

  return await response.json();
}


/**
 * Actualiza un trabajador existente y sus 6 módulos (PUT)
 */
export async function actualizarTodo(endpoint, payload) {
  const response = await fetch(`${URL_V1}${endpoint}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    const detalle = Array.isArray(errorData.detail)
      ? errorData.detail.map(err => `${err.loc.slice(1).join('.')}: ${err.msg}`).join(' | ')
      : errorData.detail || `Error HTTP ${response.status}`;
    throw new Error(detalle);
  }

  return await response.json();
}

/**
 * Elimina un trabajador por su ID (DELETE)
 */
export async function eliminarRegistro(endpoint) {
  const response = await fetch(`${URL_V1}${endpoint}`, {
    method: 'DELETE',
    headers: { 'Accept': 'application/json' }
  });

  if (!response.ok) {
    throw new Error(`Error al eliminar (HTTP ${response.status})`);
  }

  return await response.json();
}


export async function consultarPost(endpoint, payload) {
  const response = await fetch(`${URL_V1}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    throw new Error(`Error al consultar ${endpoint} (HTTP ${response.status})`);
  }

  return await response.json();
}
