document.getElementById("cabecalho").appendChild(criarHeader("inicio"));
document.getElementById("rodape").appendChild(criarFooter());

const embarcacoes = listarEmbarcacoes();
const clientes = listarClientes();
const locacoes = listarLocacoes();

const disponiveis = embarcacoes.filter(function (embarcacao) {
    return embarcacao.status === "disponivel";
});

const locacoesAtivas = locacoes.filter(function (locacao) {
    return locacao.status === "ativa";
});

document.getElementById("total-embarcacoes").textContent = disponiveis.length;
document.getElementById("total-clientes").textContent = clientes.length;
document.getElementById("total-locacoes").textContent = locacoesAtivas.length;

const destaques = document.getElementById("embarcacoes-destaque");

if (disponiveis.length === 0) {
    destaques.innerHTML = `
        <div class="col-12">
            <p class="text-secondary text-center py-4 mb-0">
                Nenhuma embarcação disponível no momento.
            </p>
        </div>
    `;
} else {
    destaques.innerHTML = disponiveis
        .slice(0, 3)
        .map(criarCardEmbarcacao)
        .join("");
}

destaques.addEventListener("click", function (evento) {
    if (evento.target.closest("[data-embarcacao]")) {
        window.location.href = "embarcacoes.html";
    }
});
