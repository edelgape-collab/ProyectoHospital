export function renderConsultaSidebarView() {
  return /*html*/`
    <div id="controles-consulta-sidebar" class="mt-12">
      <p id="mensaje-ayuda-busqueda" class="texto-ayuda-busqueda">
        Presione <strong>Buscar</strong>, tecla <strong>Enter</strong> o seleccione una vista para cargar los registros.
      </p>
      <div class="barra-busqueda-superior">
        <div class="campo-buscador">
          <div class="autocomplete-ghost-wrapper">
            <input type="text" id="input-buscar-fantasma" class="input-ghost" disabled tabindex="-1" />
            <input type="text" id="input-buscar-cedula" class="input-real" placeholder="Buscar cédula, nombre, cargo..." autocomplete="off" />
          </div>
        </div>
        <div class="flex-botones-busqueda">
          <button type="button" id="btn-buscar-cedula" class="btn-azul-claro btn-pequeno">Buscar</button>
          <button type="button" id="btn-limpiar-consulta" class="btn-azul-claro btn-pequeno m-0">Limpiar</button>
          <button type="button" id="btn-toggle-filtros-avanzados" class="btn-azul-claro btn-pequeno m-0">+ Filtros Avanzados</button>
          <button type="button" id="btn-toggle-columnas" class="btn-azul-claro btn-pequeno m-0">⚙ Filtrar columnas (6)</button>
        </div>
      </div>

      <!-- PESTAÑAS DE VISTAS AL 50% -->
      <div class="tabs-modo barra-vistas-consulta">
        <button type="button" class="btn-filtro-vista" data-vista="consolidada">Vista Consolidada</button>
        <button type="button" class="btn-filtro-vista" data-vista="basicos">Datos Básicos</button>
        <button type="button" class="btn-filtro-vista" data-vista="laborales">Laborales</button>
        <button type="button" class="btn-filtro-vista" data-vista="ubicacion">Ubicación</button>
        <button type="button" class="btn-filtro-vista" data-vista="salud">Salud</button>
        <button type="button" class="btn-filtro-vista" data-vista="hijos">Hijos</button>
        <button type="button" class="btn-filtro-vista" data-vista="vacaciones">Vacaciones</button>
      </div>
    </div>

    <!-- ZONA DE CHIPS AL FINAL DE LA SECCIÓN IZQUIERDA -->
    <div id="zona-chips-rapidos" class="sidebar-inferior zona-chips-contenedor">
      <div class="fila-chips">
        <strong class="etiqueta-chips">Estatus:</strong>
        <div id="chips-estatus" class="lista-chips"></div>
      </div>
      <div class="fila-chips">
        <strong class="etiqueta-chips">Cargos frecuentes:</strong>
        <div id="chips-cargo" class="lista-chips"></div>
      </div>
    </div>
  `;
}
