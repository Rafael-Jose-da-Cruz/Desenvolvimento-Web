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

const locacoesFaturadas = locacoes.filter(function (locacao) {
    return locacao.status === "ativa" || locacao.status === "finalizada";
});

const receita = locacoesFaturadas.reduce(function (total, locacao) {
    return total + Number(locacao.valorTotal);
}, 0);

const ticketMedio = locacoesFaturadas.length > 0 ? receita / locacoesFaturadas.length : 0;

const frotaOcupada = embarcacoes.filter(function (embarcacao) {
    return locacoesAtivas.some(function (locacao) {
        return locacao.embarcacaoId === embarcacao.id;
    });
});

const ocupacao = embarcacoes.length > 0
    ? Math.round((frotaOcupada.length / embarcacoes.length) * 100)
    : 0;

document.getElementById("kpi-disponiveis").textContent = disponiveis.length + " / " + embarcacoes.length;
document.getElementById("kpi-clientes").textContent = clientes.length;
document.getElementById("kpi-ativas").textContent = locacoesAtivas.length;
document.getElementById("kpi-receita").textContent = formatarMoeda(receita);
document.getElementById("kpi-ticket").textContent = formatarMoeda(ticketMedio);
document.getElementById("kpi-ocupacao").textContent = ocupacao + "%";

function encontrarCliente(id) {
    return clientes.find(function (cliente) {
        return cliente.id === id;
    });
}

function encontrarEmbarcacao(id) {
    return embarcacoes.find(function (embarcacao) {
        return embarcacao.id === id;
    });
}

function criarBadgeStatus(status) {
    if (status === "ativa") {
        return '<span class="badge text-bg-success">Ativa</span>';
    }

    if (status === "finalizada") {
        return '<span class="badge text-bg-secondary">Finalizada</span>';
    }

    return '<span class="badge text-bg-danger">Cancelada</span>';
}

function criarLinhaPesquisa(locacao) {
    const cliente = encontrarCliente(locacao.clienteId);
    const embarcacao = encontrarEmbarcacao(locacao.embarcacaoId);
    const nomeEmbarcacao = embarcacao
        ? escaparHtml(embarcacao.nome)
        : '<span class="text-secondary">Embarcação removida</span>';

    return [
        {
            conteudo: (cliente
                ? `<span class="fw-semibold">${escaparHtml(cliente.nome)}</span>`
                : '<span class="text-secondary">Cliente removido</span>')
                + `<div class="small text-secondary d-lg-none">${nomeEmbarcacao}</div>`
        },
        { conteudo: nomeEmbarcacao, classe: "d-none d-lg-table-cell" },
        {
            conteudo: formatarData(locacao.dataInicio) + " a " + formatarData(locacao.dataFim)
                + `<div class="small text-secondary d-lg-none">${formatarMoeda(locacao.valorTotal)}</div>`
        },
        { conteudo: formatarMoeda(locacao.valorTotal), classe: "d-none d-lg-table-cell" },
        criarBadgeStatus(locacao.status)
    ];
}

const formPesquisa = document.getElementById("form-pesquisa");
const campoPesquisa = document.getElementById("pesquisa-texto");
const filtroStatus = document.getElementById("pesquisa-status");
const filtroEmbarcacao = document.getElementById("pesquisa-embarcacao");
const contadorPesquisa = document.getElementById("contador-pesquisa");
const cardPesquisa = document.getElementById("card-pesquisa");
const listaPesquisa = document.getElementById("lista-pesquisa");
const pesquisaVazia = document.getElementById("pesquisa-vazia");

embarcacoes.forEach(function (embarcacao) {
    const opcao = document.createElement("option");
    opcao.value = embarcacao.id;
    opcao.textContent = embarcacao.nome;
    filtroEmbarcacao.appendChild(opcao);
});

function atualizarPesquisa() {
    const termo = normalizarTexto(campoPesquisa.value);
    const statusEscolhido = filtroStatus.value;
    const embarcacaoEscolhida = filtroEmbarcacao.value === "" ? 0 : Number(filtroEmbarcacao.value);

    const encontradas = locacoes.filter(function (locacao) {
        const cliente = encontrarCliente(locacao.clienteId);
        const embarcacao = encontrarEmbarcacao(locacao.embarcacaoId);

        const combinaTexto = termo === ""
            || (cliente && normalizarTexto(cliente.nome).includes(termo))
            || (embarcacao && normalizarTexto(embarcacao.nome).includes(termo));
        const combinaStatus = statusEscolhido === "" || locacao.status === statusEscolhido;
        const combinaEmbarcacao = embarcacaoEscolhida === 0 || locacao.embarcacaoId === embarcacaoEscolhida;

        return combinaTexto && combinaStatus && combinaEmbarcacao;
    }).sort(function (a, b) {
        return b.dataInicio.localeCompare(a.dataInicio);
    });

    contadorPesquisa.textContent = encontradas.length
        + (encontradas.length === 1 ? " locação encontrada" : " locações encontradas");
    cardPesquisa.classList.toggle("d-none", encontradas.length === 0);
    pesquisaVazia.classList.toggle("d-none", encontradas.length > 0);

    listaPesquisa.innerHTML = criarTabela(
        [
            "Cliente",
            { titulo: "Embarcação", classe: "d-none d-lg-table-cell" },
            "Período",
            { titulo: "Valor total", classe: "d-none d-lg-table-cell" },
            "Status"
        ],
        encontradas.map(criarLinhaPesquisa)
    );
}

formPesquisa.addEventListener("submit", function (evento) {
    evento.preventDefault();
    atualizarPesquisa();
});

campoPesquisa.addEventListener("input", atualizarPesquisa);
filtroStatus.addEventListener("change", atualizarPesquisa);
filtroEmbarcacao.addEventListener("change", atualizarPesquisa);

document.getElementById("limpar-pesquisa").addEventListener("click", function () {
    formPesquisa.reset();
    atualizarPesquisa();
});

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
        .map(function (embarcacao) {
            return criarCardEmbarcacao(embarcacao);
        })
        .join("");
}

destaques.addEventListener("click", function (evento) {
    if (evento.target.closest("[data-embarcacao]")) {
        window.location.href = "embarcacoes.html";
    }
});

atualizarPesquisa();
