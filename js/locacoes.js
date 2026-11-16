document.getElementById("cabecalho").appendChild(criarHeader("locacoes"));
document.getElementById("rodape").appendChild(criarFooter());

let locacoes = listarLocacoes();
let clientes = listarClientes();
let embarcacoes = listarEmbarcacoes();

const busca = document.getElementById("busca-locacao");
const filtroStatus = document.getElementById("filtro-locacao");
const contador = document.getElementById("contador-locacoes");
const card = document.getElementById("card-locacoes");
const lista = document.getElementById("lista-locacoes");
const vazio = document.getElementById("locacoes-vazio");
const mensagens = document.getElementById("mensagens");
const botaoNova = document.getElementById("nova-locacao");

const modalLocacao = new bootstrap.Modal(document.getElementById("modalLocacao"));
const formLocacao = document.getElementById("form-locacao");
const tituloModal = document.getElementById("titulo-modal-locacao");
const erroLocacao = document.getElementById("erro-locacao");
const valorPrevisto = document.getElementById("valor-previsto");

const campoId = document.getElementById("locacao-id");
const campoCliente = document.getElementById("locacao-cliente");
const campoEmbarcacao = document.getElementById("locacao-embarcacao");
const campoInicio = document.getElementById("locacao-inicio");
const campoFim = document.getElementById("locacao-fim");
const campoStatus = document.getElementById("locacao-status");

const confirmacao = criarModalConfirmacao();

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

function preencherSelect(select, itens, textoInicial) {
    select.innerHTML = `<option value="">${textoInicial}</option>`;

    itens.forEach(function (item) {
        const opcao = document.createElement("option");
        opcao.value = item.id;
        opcao.textContent = item.texto;
        select.appendChild(opcao);
    });
}

function carregarSelects() {
    clientes = listarClientes();
    embarcacoes = listarEmbarcacoes();

    preencherSelect(
        campoCliente,
        clientes.map(function (cliente) {
            return { id: cliente.id, texto: cliente.nome };
        }),
        "Selecione o cliente"
    );

    preencherSelect(
        campoEmbarcacao,
        embarcacoes.map(function (embarcacao) {
            return {
                id: embarcacao.id,
                texto: embarcacao.nome + " — " + formatarMoeda(embarcacao.precoDia) + " por dia"
            };
        }),
        "Selecione a embarcação"
    );
}

function calcularDias(inicio, fim) {
    if (!inicio || !fim) {
        return 0;
    }

    const inicioData = new Date(inicio + "T00:00:00");
    const fimData = new Date(fim + "T00:00:00");
    const diferenca = Math.round((fimData - inicioData) / 86400000);

    return diferenca > 0 ? diferenca : 0;
}

function calcularValor() {
    const dias = calcularDias(campoInicio.value, campoFim.value);
    const embarcacao = encontrarEmbarcacao(Number(campoEmbarcacao.value));

    if (!embarcacao || dias === 0) {
        valorPrevisto.textContent = "Selecione a embarcação e as datas para ver o valor.";
        return 0;
    }

    const total = dias * embarcacao.precoDia;

    valorPrevisto.textContent = dias + (dias === 1 ? " diária" : " diárias")
        + " × " + formatarMoeda(embarcacao.precoDia)
        + " = " + formatarMoeda(total);

    return total;
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

function criarLinha(locacao) {
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
        criarBadgeStatus(locacao.status),
        {
            conteudo: `<div class="d-flex flex-column flex-sm-row gap-2">
                <button type="button" class="btn btn-sm btn-outline-secondary" data-acao="editar" data-id="${locacao.id}">
                    Editar
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${locacao.id}">
                    Excluir
                </button>
            </div>`
        }
    ];
}

function atualizarLista() {
    const termo = normalizarTexto(busca.value);
    const statusEscolhido = filtroStatus.value;

    const encontradas = locacoes.filter(function (locacao) {
        const cliente = encontrarCliente(locacao.clienteId);

        const combinaBusca = termo === ""
            || (cliente && normalizarTexto(cliente.nome).includes(termo));
        const combinaStatus = statusEscolhido === "" || locacao.status === statusEscolhido;

        return combinaBusca && combinaStatus;
    });

    contador.textContent = encontradas.length + (encontradas.length === 1 ? " locação" : " locações");
    card.classList.toggle("d-none", encontradas.length === 0);
    vazio.classList.toggle("d-none", encontradas.length > 0);

    lista.innerHTML = criarTabela(
        [
            "Cliente",
            { titulo: "Embarcação", classe: "d-none d-lg-table-cell" },
            "Período",
            { titulo: "Valor total", classe: "d-none d-lg-table-cell" },
            "Status",
            "Ações"
        ],
        encontradas.map(criarLinha)
    );
}

function limparFormulario() {
    formLocacao.reset();
    formLocacao.classList.remove("was-validated");
    erroLocacao.innerHTML = "";
    campoId.value = "";
    carregarSelects();
    valorPrevisto.textContent = "Selecione a embarcação e as datas para ver o valor.";
}

function abrirFormulario(locacao) {
    limparFormulario();

    if (locacao) {
        tituloModal.textContent = "Editar locação";
        campoId.value = locacao.id;
        campoCliente.value = locacao.clienteId;
        campoEmbarcacao.value = locacao.embarcacaoId;
        campoInicio.value = locacao.dataInicio;
        campoFim.value = locacao.dataFim;
        campoStatus.value = locacao.status;
        calcularValor();
    } else {
        tituloModal.textContent = "Nova locação";
    }

    modalLocacao.show();
}

function excluir(locacao) {
    const cliente = encontrarCliente(locacao.clienteId);

    confirmacao.abrir("Excluir esta locação de " + (cliente ? cliente.nome : "cliente removido") + "?", function () {
        excluirLocacao(locacao.id);
        locacoes = listarLocacoes();
        atualizarLista();
        mostrarAlerta(mensagens, "Locação excluída com sucesso.", "success");
    });
}

botaoNova.addEventListener("click", function () {
    abrirFormulario(null);
});

busca.addEventListener("input", atualizarLista);
filtroStatus.addEventListener("change", atualizarLista);

campoEmbarcacao.addEventListener("change", calcularValor);
campoInicio.addEventListener("change", calcularValor);
campoFim.addEventListener("change", calcularValor);

formLocacao.addEventListener("submit", function (evento) {
    evento.preventDefault();
    erroLocacao.innerHTML = "";

    if (!formLocacao.checkValidity()) {
        formLocacao.classList.add("was-validated");
        return;
    }

    const locacao = {
        id: Number(campoId.value) || 0,
        clienteId: Number(campoCliente.value),
        embarcacaoId: Number(campoEmbarcacao.value),
        dataInicio: campoInicio.value,
        dataFim: campoFim.value,
        status: campoStatus.value,
        valorTotal: 0
    };

    if (locacao.dataFim <= locacao.dataInicio) {
        mostrarAlerta(erroLocacao, "A data de devolução deve ser depois da data de retirada.", "danger");
        return;
    }

    const temConflito = locacoes.some(function (item) {
        if (item.id === locacao.id || item.status !== "ativa" || locacao.status !== "ativa") {
            return false;
        }

        if (item.embarcacaoId !== locacao.embarcacaoId) {
            return false;
        }

        return item.dataInicio <= locacao.dataFim && item.dataFim >= locacao.dataInicio;
    });

    if (temConflito) {
        mostrarAlerta(erroLocacao, "Esta embarcação já possui uma locação ativa nesse período.", "danger");
        return;
    }

    const embarcacao = encontrarEmbarcacao(locacao.embarcacaoId);
    locacao.valorTotal = calcularDias(locacao.dataInicio, locacao.dataFim) * embarcacao.precoDia;

    const editando = locacao.id !== 0;

    salvarLocacao(locacao);
    locacoes = listarLocacoes();
    modalLocacao.hide();
    atualizarLista();

    mostrarAlerta(
        mensagens,
        editando ? "Locação atualizada com sucesso." : "Locação cadastrada com sucesso.",
        "success"
    );
});

lista.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-acao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const locacao = locacoes.find(function (item) {
        return item.id === id;
    });

    if (!locacao) {
        return;
    }

    if (botao.dataset.acao === "editar") {
        abrirFormulario(locacao);
    } else {
        excluir(locacao);
    }
});

carregarSelects();
atualizarLista();