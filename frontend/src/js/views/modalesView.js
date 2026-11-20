export function renderModalesView() {
  return /*html*/`
    <dialog id="modal-confirmacion" class="modal-peligro">
      <div class="modal-contenido">
        <h3 id="modal-titulo">⚠ Confirmar Acción</h3>
        <p id="modal-mensaje">¿Estás seguro de realizar esta acción?</p>
        <div class="modal-peligro-acciones">
          <button type="button" id="btn-modal-cancelar" class="btn-cancelar-blanco">Cancelar</button>
          <button type="button" id="btn-modal-confirmar" class="btn-confirmar-rojo">Confirmar</button>
        </div>
      </div>
    </dialog>
  `;
}
