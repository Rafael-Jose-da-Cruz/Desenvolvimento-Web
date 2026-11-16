function criarModalConfirmacao() {
    const elemento = document.createElement("div");
    elemento.className = "modal fade";
    elemento.tabIndex = -1;

    elemento.innerHTML = `
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-header">
                    <h2 class="modal-title fs-5">Confirmar exclusão</h2>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Fechar"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0" data-texto-confirmacao></p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-danger" data-confirmar>Excluir</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(elemento);

    const modal = new bootstrap.Modal(elemento);
    const texto = elemento.querySelector("[data-texto-confirmacao]");
    const botaoConfirmar = elemento.querySelector("[data-confirmar]");
    let acaoConfirmada = null;

    botaoConfirmar.addEventListener("click", function () {
        modal.hide();

        if (acaoConfirmada) {
            acaoConfirmada();
        }
    });

    return {
        abrir: function (mensagem, acao) {
            texto.textContent = mensagem;
            acaoConfirmada = acao;
            modal.show();
        }
    };
}