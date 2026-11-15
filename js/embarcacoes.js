document.getElementById("cabecalho").appendChild(criarHeader("embarcacoes"));
document.getElementById("rodape").appendChild(criarFooter());

const embarcacoes = listarEmbarcacoes();

const busca = document.getElementById("busca-embarcacao");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroStatus = document.getElementById("filtro-status");
const botaoLimpar = document.getElementById("limpar-filtros");
const contador = document.getElementById("contador-embarcacoes");
const lista = document.getElementById("lista-embarcacoes");
const vazio = document.getElementById("embarcacoes-vazio");

const modalDetalhes = new bootstrap.Modal(document.getElementById("modalDetalhes"));

// Remove acentos e deixa o texto em minúsculo para facilitar a busca
function normalizarTexto(texto) {
    return String(texto)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim();
}

// Preenche o select de tipos com os tipos que existem no cadastro
const tipos = [];

embarcacoes.forEach(function (embarcacao) {
    if (!tipos.includes(embarcacao.tipo)) {
        tipos.push(embarcacao.tipo);
    }
});

tipos.sort();

tipos.forEach(function (tipo) {
    const opcao = document.createElement("option");
    opcao.value = tipo;
    opcao.textContent = tipo;
    filtroTipo.appendChild(opcao);
});

function mostrarEmbarcacoes() {
    const termo = normalizarTexto(busca.value);
    const tipoEscolhido = filtroTipo.value;
    const statusEscolhido = filtroStatus.value;

    const encontradas = embarcacoes.filter(function (embarcacao) {
        const combinaBusca = termo === "" || normalizarTexto(embarcacao.nome).includes(termo);
        const combinaTipo = tipoEscolhido === "" || embarcacao.tipo === tipoEscolhido;
        const combinaStatus = statusEscolhido === "" || embarcacao.status === statusEscolhido;

        return combinaBusca && combinaTipo && combinaStatus;
    });

    contador.textContent = encontradas.length + (encontradas.length === 1 ? " embarcação" : " embarcações");

    vazio.classList.toggle("d-none", encontradas.length > 0);
    lista.innerHTML = encontradas.map(criarCardEmbarcacao).join("");
}

function abrirDetalhes(embarcacao) {
    const disponivel = embarcacao.status === "disponivel";

    document.getElementById("tituloDetalhes").textContent = embarcacao.nome;

    document.getElementById("corpoDetalhes").innerHTML = `
        <img src="${embarcacao.imagem}" alt="Embarcação ${embarcacao.nome}"
            class="w-100 rounded mb-3 imagem-detalhe">
        <p class="text-secondary">${embarcacao.descricao}</p>
        <ul class="list-unstyled mb-0">
            <li class="mb-2"><strong>Capacidade:</strong> ${embarcacao.capacidade} pessoas</li>
            <li class="mb-2"><strong>Tipo:</strong> ${embarcacao.tipo}</li>
            <li class="mb-2"><strong>Diária:</strong> ${formatarMoeda(embarcacao.precoDia)}</li>
            <li><strong>Status:</strong> ${disponivel ? "Disponível" : "Em manutenção"}</li>
        </ul>
    `;

    const botaoReservar = document.getElementById("botaoReservar");
    botaoReservar.classList.toggle("disabled", !disponivel);
    botaoReservar.setAttribute("aria-disabled", String(!disponivel));

    modalDetalhes.show();
}

// Clique nos cards da lista
lista.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-embarcacao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.embarcacao);
    const embarcacao = embarcacoes.find(function (item) {
        return item.id === id;
    });

    if (embarcacao) {
        abrirDetalhes(embarcacao);
    }
});

busca.addEventListener("input", mostrarEmbarcacoes);
filtroTipo.addEventListener("change", mostrarEmbarcacoes);
filtroStatus.addEventListener("change", mostrarEmbarcacoes);

botaoLimpar.addEventListener("click", function () {
    busca.value = "";
    filtroTipo.value = "";
    filtroStatus.value = "";
    mostrarEmbarcacoes();
    busca.focus();
});

mostrarEmbarcacoes();
