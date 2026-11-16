document.getElementById("cabecalho").appendChild(criarHeader("clientes"));
document.getElementById("rodape").appendChild(criarFooter());

let clientes = listarClientes();

const busca = document.getElementById("busca-cliente");
const contador = document.getElementById("contador-clientes");
const card = document.getElementById("card-clientes");
const lista = document.getElementById("lista-clientes");
const vazio = document.getElementById("clientes-vazio");
const mensagens = document.getElementById("mensagens");
const botaoNovo = document.getElementById("novo-cliente");

const modalCliente = new bootstrap.Modal(document.getElementById("modalCliente"));
const formCliente = document.getElementById("form-cliente");
const tituloModal = document.getElementById("titulo-modal-cliente");
const erroCliente = document.getElementById("erro-cliente");

const campoId = document.getElementById("cliente-id");
const campoNome = document.getElementById("cliente-nome");
const campoEmail = document.getElementById("cliente-email");
const campoTelefone = document.getElementById("cliente-telefone");
const campoCpf = document.getElementById("cliente-cpf");
const campoCidade = document.getElementById("cliente-cidade");

const confirmacao = criarModalConfirmacao();

function contarLocacoes(clienteId) {
    return listarLocacoes().filter(function (locacao) {
        return locacao.clienteId === clienteId;
    }).length;
}

function criarLinha(cliente) {
    const locacoes = contarLocacoes(cliente.id);

    return [
        {
            conteudo: `<span class="fw-semibold">${escaparHtml(cliente.nome)}</span>
                <div class="small text-secondary d-lg-none">${escaparHtml(cliente.telefone)}</div>`
        },
        { conteudo: escaparHtml(cliente.email), classe: "d-none d-lg-table-cell" },
        { conteudo: escaparHtml(cliente.telefone), classe: "d-none d-lg-table-cell" },
        { conteudo: escaparHtml(cliente.cidade), classe: "d-none d-lg-table-cell" },
        locacoes === 0 ? '<span class="text-secondary">Nenhuma</span>' : locacoes,
        {
            conteudo: `<div class="d-flex flex-column flex-sm-row gap-2">
                <button type="button" class="btn btn-sm btn-outline-secondary" data-acao="editar" data-id="${cliente.id}">
                    Editar
                </button>
                <button type="button" class="btn btn-sm btn-outline-danger" data-acao="excluir" data-id="${cliente.id}">
                    Excluir
                </button>
            </div>`
        }
    ];
}

function atualizarLista() {
    const termo = normalizarTexto(busca.value);

    const encontrados = clientes.filter(function (cliente) {
        return termo === ""
            || normalizarTexto(cliente.nome).includes(termo)
            || normalizarTexto(cliente.email).includes(termo)
            || normalizarTexto(cliente.cidade).includes(termo);
    });

    contador.textContent = encontrados.length + (encontrados.length === 1 ? " cliente" : " clientes");
    card.classList.toggle("d-none", encontrados.length === 0);
    vazio.classList.toggle("d-none", encontrados.length > 0);

    lista.innerHTML = criarTabela(
        [
            "Nome",
            { titulo: "E-mail", classe: "d-none d-lg-table-cell" },
            { titulo: "Telefone", classe: "d-none d-lg-table-cell" },
            { titulo: "Cidade", classe: "d-none d-lg-table-cell" },
            "Locações",
            "Ações"
        ],
        encontrados.map(criarLinha)
    );
}

function limparFormulario() {
    formCliente.reset();
    formCliente.classList.remove("was-validated");
    erroCliente.innerHTML = "";
    campoId.value = "";
}

function abrirFormulario(cliente) {
    limparFormulario();

    if (cliente) {
        tituloModal.textContent = "Editar cliente";
        campoId.value = cliente.id;
        campoNome.value = cliente.nome;
        campoEmail.value = cliente.email;
        campoTelefone.value = cliente.telefone;
        campoCpf.value = cliente.cpf;
        campoCidade.value = cliente.cidade;
    } else {
        tituloModal.textContent = "Novo cliente";
    }

    modalCliente.show();
}

botaoNovo.addEventListener("click", function () {
    abrirFormulario(null);
});

busca.addEventListener("input", atualizarLista);

formCliente.addEventListener("submit", function (evento) {
    evento.preventDefault();
    erroCliente.innerHTML = "";

    if (!formCliente.checkValidity()) {
        formCliente.classList.add("was-validated");
        return;
    }

    const cliente = {
        id: Number(campoId.value) || 0,
        nome: campoNome.value.trim(),
        email: campoEmail.value.trim(),
        telefone: campoTelefone.value.trim(),
        cpf: campoCpf.value.trim(),
        cidade: campoCidade.value.trim()
    };

    const emailRepetido = clientes.some(function (item) {
        return item.id !== cliente.id && normalizarTexto(item.email) === normalizarTexto(cliente.email);
    });

    if (emailRepetido) {
        mostrarAlerta(erroCliente, "Já existe um cliente cadastrado com este e-mail.", "danger");
        return;
    }

    const editando = cliente.id !== 0;

    salvarCliente(cliente);
    clientes = listarClientes();
    modalCliente.hide();
    atualizarLista();

    mostrarAlerta(
        mensagens,
        editando ? "Cliente atualizado com sucesso." : "Cliente cadastrado com sucesso.",
        "success"
    );
});

lista.addEventListener("click", function (evento) {
    const botao = evento.target.closest("[data-acao]");

    if (!botao) {
        return;
    }

    const id = Number(botao.dataset.id);
    const cliente = clientes.find(function (item) {
        return item.id === id;
    });

    if (!cliente) {
        return;
    }

    if (botao.dataset.acao === "editar") {
        abrirFormulario(cliente);
        return;
    }

    if (contarLocacoes(id) > 0) {
        mostrarAlerta(
            mensagens,
            "Não é possível excluir " + cliente.nome + ": existem locações vinculadas a este cliente.",
            "danger"
        );
        return;
    }

    confirmacao.abrir("Excluir o cliente " + cliente.nome + "?", function () {
        excluirCliente(id);
        clientes = listarClientes();
        atualizarLista();
        mostrarAlerta(mensagens, "Cliente excluído com sucesso.", "success");
    });
});

atualizarLista();