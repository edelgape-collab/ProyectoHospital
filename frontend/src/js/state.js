// src/js/state.js

const crearEstadoInicial = () => ({
  // Nivel raíz: Datos Básicos (15 campos)
  nacionalidad: '',
  cedula: '',
  nombre_1: '',
  nombre_2: '',
  apellido_1: '',
  apellido_2: '',
  fecha_nacimiento: '',
  sexo: '',
  estado_civil: '',
  direccion_habitacion: '',
  telefono: '',
  correo: '',
  centro_votacion: '',
  observaciones: '',
  id_estatus: null,

  // Sub-objeto 1: Datos Laborales (8 campos)
  datos_laborales: {
    codigo_rac: null,
    carga_horaria: null,
    fecha_ingreso_apn: '',
    fecha_ingreso_mpps: '',
    id_horario: null,
    id_estatus_contrato: null,
    id_cargo: null,
    id_nivel_grado: null
  },

  // Sub-objeto 2: Ubicación Laboral (4 campos)
  ubicacion_laboral: {
    id_ubicacion_administrativa: null,
    id_ubicacion_fisica: null,
    id_asic: null,
    id_red: null
  },

  // Sub-objeto 3: Salud y Dotación (5 campos)
  salud_dotacion: {
    talla_pantalon: '',
    talla_camisa: '',
    talla_zapatos: null,
    patologias: '',
    tratamiento: ''
  },

  // Lista dinámica 1: Hijos (8 campos por objeto)
  hijos: [],

  // Lista dinámica 2: Vacaciones (6 campos por objeto)
  vacaciones: []
});

export const appState = {
  pasoActual: 1,
  totalPasos: 6,
  idEditando: null, 
  payload: crearEstadoInicial()
};

// Actualiza los campos del nivel raíz (Paso 1)
export function actualizarDatosBasicos(datos) {
  Object.assign(appState.payload, datos);
}

// Actualiza los sub-objetos (Pasos 2, 3 y 4)
export function actualizarSubSeccion(seccion, datos) {
  if (appState.payload[seccion] && !Array.isArray(appState.payload[seccion])) {
    appState.payload[seccion] = {
      ...appState.payload[seccion],
      ...datos
    };
  }
}

// Agrega un registro a 'hijos' o 'vacaciones' (Pasos 5 y 6)
export function agregarItemLista(lista, item) {
  if (Array.isArray(appState.payload[lista])) {
    appState.payload[lista].push(item);
  }
}

// Elimina un registro de 'hijos' o 'vacaciones' por su índice
export function eliminarItemLista(lista, indice) {
  if (Array.isArray(appState.payload[lista])) {
    appState.payload[lista].splice(indice, 1);
  }
}

// Reinicia el formulario completo en memoria
export function reiniciarEstado() {
  appState.pasoActual = 1;
  appState.idEditando = null;
  appState.payload = crearEstadoInicial();
}



export function cargarEstadoEdicion(detalle) {
  appState.pasoActual = 1;
  appState.idEditando = detalle.id_trabajador;
  const base = crearEstadoInicial();

  // Cargar nivel raíz
  Object.keys(base).forEach(k => {
    if (typeof base[k] !== 'object' || base[k] === null) {
      base[k] = detalle[k] ?? base[k];
    }
  });

  // Cargar sub-objetos y listas
  base.datos_laborales = { ...base.datos_laborales, ...(detalle.datos_laborales || {}) };
  base.ubicacion_laboral = { ...base.ubicacion_laboral, ...(detalle.ubicacion_laboral || {}) };
  base.salud_dotacion = { ...base.salud_dotacion, ...(detalle.salud_dotacion || {}) };
  base.hijos = Array.isArray(detalle.hijos) ? [...detalle.hijos] : [];
  base.vacaciones = Array.isArray(detalle.vacaciones) ? [...detalle.vacaciones] : [];

  appState.payload = base;
}