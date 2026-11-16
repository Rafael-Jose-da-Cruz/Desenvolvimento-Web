const LINKS_MENU = [
    { chave: "inicio", texto: "Início", arquivo: "index.html" },
    { chave: "embarcacoes", texto: "Embarcações", arquivo: "embarcacoes.html" },
    { chave: "clientes", texto: "Clientes", arquivo: "clientes.html" },
    { chave: "locacoes", texto: "Locações", arquivo: "locacoes.html" },
    { chave: "contato", texto: "Contato", arquivo: "contato.html" }
];

function criarHeader(paginaAtiva) {
    const header = document.createElement("header");

    const links = LINKS_MENU.map(function (link) {
        const ativo = link.chave === paginaAtiva ? " active" : "";

        return `
            <li class="nav-item">
                <a class="nav-link${ativo}" href="${link.arquivo}">${link.texto}</a>
            </li>
        `;
    }).join("");

    header.innerHTML = `
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <a class="navbar-brand" href="index.html">Titanic Náutica</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#menuPrincipal" aria-controls="menuPrincipal" aria-expanded="false"
                    aria-label="Abrir menu">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="menuPrincipal">
                    <ul class="navbar-nav ms-auto">
                        ${links}
                    </ul>
                </div>
            </div>
        </nav>
    `;

    return header;
}