const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export async function obtenerCatalogos() {
  const response = await fetch(`${API_URL}/catalogos/`);
  if (!response.ok) {
    throw new Error("No se pudieron cargar los catálogos desde el servidor.");
  }
  return await response.json();
}

export async function registrarTrabajadorCompleto(payload) {
  const response = await fetch(`${API_URL}/trabajadores/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.detail || "Error al registrar el trabajador.");
  }
  return data;
}

export async function obtenerConsolidado() {
  const response = await fetch(`${API_URL}/trabajadores/consolidado`);
  if (!response.ok) {
    throw new Error("Error al consultar la vista consolidada.");
  }
  return await response.json();
}

export async function buscarConsolidadoPorCedula(cedula) {
  const response = await fetch(`${API_URL}/trabajadores/consolidado/${encodeURIComponent(cedula)}`);
  if (!response.ok) {
    throw new Error("No se encontró el trabajador con esa cédula.");
  }
  return await response.json();
}
