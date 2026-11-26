export function renderConsultaView() {
  return /*html*/`
    <!--<h2>Administración de Personal</#h2> -->

    <!-- PANEL DE CONSTRUCTOR DE REGLAS DINÁMICAS -->
    <div id="panel-filtros-avanzados" class="oculto panel-desplegable">
      <div class="cabecera-panel-reglas">
        <strong>Constructor de Reglas de Búsqueda</strong>
        <button type="button" id="btn-agregar-regla" class="btn-primario btn-pequeno">+ Añadir Condición</button>
      </div>
      <div id="contenedor-reglas" class="contenedor-reglas-lista"></div>
    </div>

    <!-- PANEL DE SELECTOR DE COLUMNAS DINÁMICAS -->
    <div id="panel-selector-columnas" class="oculto panel-desplegable">
      <strong class="titulo-bloque-panel">Selecciona las columnas a mostrar en pantalla y reportes:</strong>
      <div id="grid-checkboxes-columnas" class="grid-campos grid-columnas-dinamicas"></div>
    </div>

    <!-- TABLA DE RESULTADOS -->
    <div class="tabla-contenedor oculto">
      <table id="tabla-resultados">
        <thead id="tabla-resultados-head"></thead>
        <tbody id="tabla-resultados-body"></tbody>
      </table>
    </div>


    <!-- EXPORTACIÓN -->
    <div id="barra-exportacion-masiva" class="oculto barra-exportacion">
      <button type="button" id="btn-exportar-excel-masivo" class="btn-verde" onclick="window.exportarExcelMasivo()">Excel consolidado (.xlsx)</button>
      <button type="button" id="btn-imprimir-tabla-masiva" class="btn-primario" onclick="window.imprimirPdfMasivo()">PDF Consolidado (6 Tablas)</button>
    </div>

    <div id="ficha-informe-trabajador" class="oculto"></div>
  `;
}
