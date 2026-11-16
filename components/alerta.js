function mostrarAlerta(container, mensagem, tipo) {
    container.innerHTML = "";

    const alerta = document.createElement("div");
    alerta.className = "alert alert-" + tipo + " alert-dismissible fade show mb-0";
    alerta.setAttribute("role", "alert");
    alerta.textContent = mensagem;

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "btn-close";
    botao.setAttribute("data-bs-dismiss", "alert");
    botao.setAttribute("aria-label", "Fechar");

    alerta.appendChild(botao);
    container.appendChild(alerta);
}