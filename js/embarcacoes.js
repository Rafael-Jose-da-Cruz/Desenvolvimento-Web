document.getElementById("cabecalho").appendChild(criarHeader("embarcacoes"));
document.getElementById("rodape").appendChild(criarFooter());

let embarcacoes = listarEmbarcacoes();

const busca = document.getElementById("busca-embarcacao");
const filtroTipo = document.getElementById("filtro-tipo");
const filtroStatus = document.getElementById("filtro-status");
const botaoLimpar = document.getElementById("limpar-filtros");
const botaoNova = document.getElementById("nova-embarcacao");
const botaoExportar = document.getElementById("exportar-embarcacoes");
const botaoImportar = document.getElementById("importar-embarcacoes");
const campoArquivo = document.getElementById("arquivo-embarcacoes");
const contador = document.getElementById("contador-embarcacoes");
const lista = document.getElementById("lista-embarcacoes");
const vazio = document.getElementById("embarcacoes-vazio");
const mensagens = document.getElementById("mensagens");

const modalDetalhes = new bootstrap.Modal(document.getElementById("modalDetalhes"));
const modalEmbarcacao = new bootstrap.Modal(document.getElementById("modalEmbarcacao"));
const formEmbarcacao = document.getElementById("form-embarcacao");
const tituloModal = document.getElementById("titulo-modal-embarcacao");
const erroEmbarcacao = document.getElementById("erro-embarcacao");

const campoId = document.getElementById("embarcacao-id");
const campoNome = document.getElementById("embarcacao-nome");
const campoTipo = document.getElementById("embarcacao-tipo");
const campoCapacidade = document.getElementById("embarcacao-capacidade");
const campoPreco = document.getElementById("embarcacao-preco");
const campoStatus = document.getElementById("embarcacao-status");
const campoImagem = document.getElementById("embarcacao-imagem");
const campoDescricao = document.getElementById("embarcacao-descricao");

const confirmacao = criarModalConfirmacao();

function carregarTipos() {
    const selecionado = filtroTipo.value;
    const tipos = [];

    embarcacoes.forEach(function (embarcacao) {
        if (!tipos.includes(embarcacao.tipo)) {
            tipos.push(embarcacao.tipo);
        }
    });

    tipos.sort();

    filtroTipo.innerHTML = '<option value="">Todos os tipos</option>';

    tipos.forEach(function (tipo) {
        const opcao = document.createElement("option");
        opcao.value = tipo;
        opcao.textContent = tipo;
        filtroTipo.appendChild(opcao);
    });

    filtroTipo.value = selecionado;
}

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

    lista.innerHTML = encontradas.map(function (embarcacao) {
        return criarCardEmbarcacao(embarcacao, true);
    }).join("");
}

function abrirDetalhes(embarcacao) {
    const disponivel = embarcacao.status === "disponivel";

    document.getElementById("tituloDetalhes").textContent = embarcacao.nome;

    document.getElementById("corpoDetalhes").innerHTML = `
        <img src="${escaparHtml(embarcacao.imagem)}" alt="Embarcação ${escaparHtml(embarcacao.nome)}"
            class="w-100 rounded mb-3 imagem-detalhe">
        <p class="text-secondary">${escaparHtml(embarcacao.descricao)}</p>
        <ul class="list-unstyled mb-0">
            <li class="mb-2"><strong>Capacidade:</strong> ${embarcacao.capacidade} pessoas</li>
            <li class="mb-2"><strong>Tipo:</strong> ${escaparHtml(embarcacao.tipo)}</li>
            <li class="mb-2"><strong>Diária:</strong> ${formatarMoeda(embarcacao.precoDia)}</li>
            <li><strong>Status:</strong> ${disponivel ? "Disponível" : "Em manutenção"}</li>
        </ul>
    `;

    const botaoReservar = document.getElementById("botaoReservar");
    botaoReservar.classList.toggle("disabled", !disponivel);
    botaoReservar.setAttribute("aria-disabled", String(!disponivel));

    modalDetalhes.show();
}

function limparFormulario() {
    formEmbarcacao.reset();
    formEmbarcacao.classList.remove("was-validated");
    erroEmbarcacao.innerHTML = "";
    campoId.value = "";
}

function abrirFormulario(embarcacao) {
    limparFormulario();

    if (embarcacao) {
        tituloModal.textContent = "Editar embarcação";
        campoId.value = embarcacao.id;
        campoNome.value = embarcacao.nome;
        campoTipo.value = embarcacao.tipo;
        campoCapacidade.value = embarcacao.capacidade;
        campoPreco.value = embarcacao.precoDia;
        campoStatus.value = embarcacao.status;
        campoImagem.value = embarcacao.imagem;
        campoDescricao.value = embarcacao.descricao;
    } else {
        tituloModal.textContent = "Nova embarcação";
    }

    modalEmbarcacao.show();
}

function excluir(embarcacao) {
    const locacoes = listarLocacoes().filter(function (locacao) {
        return locacao.embarcacaoId === embarcacao.id;
    });

    if (locacoes.length > 0) {
        mostrarAlerta(
            mensagens,
            "Não é possível excluir " + embarcacao.nome + ": existem locações vinculadas a esta embarcação.",
            "danger"
        );
        return;
    }

    confirmacao.abrir("Excluir a embarcação " + embarcacao.nome + "?", function () {
        excluirEmbarcacao(embarcacao.id);
        embarcacoes = listarEmbarcacoes();
        carregarTipos();
        mostrarEmbarcacoes();
        mostrarAlerta(mensagens, "Embarcação excluída com sucesso.", "success");
    });
}

botaoNova.addEventListener("click", function () {
    abrirFormulario(null);
});

botaoExportar.addEventListener("click", function () {
    exportarEmbarcacoesCsv();
    mostrarAlerta(mensagens, "Arquivo CSV gerado com sucesso.", "success");
});

botaoImportar.addEventListener("click", function () {
    campoArquivo.click();
});

campoArquivo.addEventListener("change", function () {
    const arquivo = campoArquivo.files[0];

    if (!arquivo) {
        return;
    }

    importarEmbarcacoesCsv(arquivo).then(function (importadas) {
        embarcacoes = listarEmbarcacoes();
        carregarTipos();
        mostrarEmbarcacoes();
        mostrarAlerta(
            mensagens,
            importadas + (importadas === 1 ? " embarcação importada do CSV." : " embarcações importadas do CSV."),
            importadas > 0 ? "success" : "warning"
        );
    }).catch(function () {
        mostrarAlerta(mensagens, "Não foi possível ler o arquivo selecionado.", "danger");
    }).finally(function () {
        campoArquivo.value = "";
    });
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

formEmbarcacao.addEventListener("submit", function (evento) {
    evento.preventDefault();
    erroEmbarcacao.innerHTML = "";

    if (!formEmbarcacao.checkValidity()) {
        formEmbarcacao.classList.add("was-validated");
        return;
    }

    const embarcacao = {
        id: Number(campoId.value) || 0,
        nome: campoNome.value.trim(),
        tipo: campoTipo.value,
        capacidade: Number(campoCapacidade.value),
        precoDia: Number(campoPreco.value),
        status: campoStatus.value,
        imagem: campoImagem.value.trim(),
        descricao: campoDescricao.value.trim() || "Sem descrição cadastrada."
    };

    if (!embarcacao.imagem) {
        embarcacao.imagem = "https://placehold.co/640x420/1e3d59/ffffff?text="
            + encodeURIComponent(embarcacao.nome);
    }

    const editando = embarcacao.id !== 0;

    salvarEmbarcacao(embarcacao);
    embarcacoes = listarEmbarcacoes();
    modalEmbarcacao.hide();
    carregarTipos();
    mostrarEmbarcacoes();

    mostrarAlerta(
        mensagens,
        editando ? "Embarcação atualizada com sucesso." : "Embarcação cadastrada com sucesso.",
        "success"
    );
});

lista.addEventListener("click", function (evento) {
    const botaoAcao = evento.target.closest("[data-acao]");

    if (botaoAcao) {
        const id = Number(botaoAcao.dataset.id);
        const embarcacao = embarcacoes.find(function (item) {
            return item.id === id;
        });

        if (!embarcacao) {
            return;
        }

        if (botaoAcao.dataset.acao === "editar") {
            abrirFormulario(embarcacao);
        } else {
            excluir(embarcacao);
        }

        return;
    }

    const botaoDetalhes = evento.target.closest("[data-embarcacao]");

    if (!botaoDetalhes) {
        return;
    }

    const id = Number(botaoDetalhes.dataset.embarcacao);
    const embarcacao = embarcacoes.find(function (item) {
        return item.id === id;
    });

    if (embarcacao) {
        abrirDetalhes(embarcacao);
    }
});

carregarTipos();
mostrarEmbarcacoes();