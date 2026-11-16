const CHAVE_DADOS = "titanic:dados";

const DADOS_INICIAIS = {
    embarcacoes: [
        {
            id: 1,
            nome: "Lancha Sunset",
            tipo: "Lancha",
            capacidade: 10,
            precoDia: 1200,
            status: "disponivel",
            imagem: "https://placehold.co/640x420/1e3d59/ffffff?text=Lancha+Sunset",
            descricao: "Lancha rápida com solário na proa, estofamento novo e som bluetooth. Ideal para passeios em família e day use na Lagoa da Conceição."
        },
        {
            id: 2,
            nome: "Iate Azimut",
            tipo: "Iate",
            capacidade: 12,
            precoDia: 3500,
            status: "disponivel",
            imagem: "https://placehold.co/640x420/12283a/ffffff?text=Iate+Azimut",
            descricao: "Iate de luxo com dois camarotes, cozinha equipada e área externa ampla. Perfeito para eventos e roteiros de fim de semana."
        },
        {
            id: 3,
            nome: "Veleiro Horizonte",
            tipo: "Veleiro",
            capacidade: 6,
            precoDia: 800,
            status: "manutencao",
            imagem: "https://placehold.co/640x420/2f6690/ffffff?text=Veleiro+Horizonte",
            descricao: "Veleiro clássico para quem gosta de navegar com o vento. Está em manutenção preventiva e volta ao catálogo em breve."
        },
        {
            id: 4,
            nome: "Catamarã Coral",
            tipo: "Catamarã",
            capacidade: 16,
            precoDia: 2200,
            status: "disponivel",
            imagem: "https://placehold.co/640x420/0d5c63/ffffff?text=Catamara+Coral",
            descricao: "Catamarã espaçoso com rede de descanso, churrasqueira e plataforma de banho. A escolha certa para grupos maiores."
        }
    ],
    clientes: [
        {
            id: 1,
            nome: "Marina Alves",
            email: "marina.alves@email.com",
            telefone: "(48) 99812-3344",
            cpf: "123.456.789-00",
            cidade: "Florianópolis - SC"
        },
        {
            id: 2,
            nome: "Carlos Menezes",
            email: "carlos.menezes@email.com",
            telefone: "(47) 99123-4567",
            cpf: "987.654.321-00",
            cidade: "Balneário Camboriú - SC"
        },
        {
            id: 3,
            nome: "Juliana Prado",
            email: "juliana.prado@email.com",
            telefone: "(47) 98888-1122",
            cpf: "456.789.123-00",
            cidade: "Itajaí - SC"
        }
    ],
    locacoes: [
        {
            id: 1,
            clienteId: 1,
            embarcacaoId: 1,
            dataInicio: "2026-11-20",
            dataFim: "2026-11-22",
            status: "ativa",
            valorTotal: 2400
        },
        {
            id: 2,
            clienteId: 2,
            embarcacaoId: 4,
            dataInicio: "2026-11-08",
            dataFim: "2026-11-10",
            status: "finalizada",
            valorTotal: 4400
        },
        {
            id: 3,
            clienteId: 3,
            embarcacaoId: 2,
            dataInicio: "2026-12-05",
            dataFim: "2026-12-07",
            status: "ativa",
            valorTotal: 7000
        }
    ]
};

function lerDados() {
    const dadosSalvos = localStorage.getItem(CHAVE_DADOS);

    if (!dadosSalvos) {
        salvarDados(DADOS_INICIAIS);
        return DADOS_INICIAIS;
    }

    try {
        return JSON.parse(dadosSalvos);
    } catch (erro) {
        salvarDados(DADOS_INICIAIS);
        return DADOS_INICIAIS;
    }
}

function salvarDados(dados) {
    localStorage.setItem(CHAVE_DADOS, JSON.stringify(dados));
}

function listarEmbarcacoes() {
    return lerDados().embarcacoes;
}

function listarClientes() {
    return lerDados().clientes;
}

function listarLocacoes() {
    return lerDados().locacoes;
}

function proximoId(lista) {
    let maiorId = 0;

    lista.forEach(function (item) {
        if (item.id > maiorId) {
            maiorId = item.id;
        }
    });

    return maiorId + 1;
}

function salvarCliente(cliente) {
    const dados = lerDados();

    if (cliente.id) {
        const indice = dados.clientes.findIndex(function (item) {
            return item.id === cliente.id;
        });

        if (indice !== -1) {
            dados.clientes[indice] = cliente;
        }
    } else {
        cliente.id = proximoId(dados.clientes);
        dados.clientes.push(cliente);
    }

    salvarDados(dados);
    return cliente;
}

function excluirCliente(id) {
    const dados = lerDados();

    dados.clientes = dados.clientes.filter(function (cliente) {
        return cliente.id !== id;
    });

    salvarDados(dados);
}

function salvarEmbarcacao(embarcacao) {
    const dados = lerDados();

    if (embarcacao.id) {
        const indice = dados.embarcacoes.findIndex(function (item) {
            return item.id === embarcacao.id;
        });

        if (indice !== -1) {
            dados.embarcacoes[indice] = embarcacao;
        }
    } else {
        embarcacao.id = proximoId(dados.embarcacoes);
        dados.embarcacoes.push(embarcacao);
    }

    salvarDados(dados);
    return embarcacao;
}

function excluirEmbarcacao(id) {
    const dados = lerDados();

    dados.embarcacoes = dados.embarcacoes.filter(function (embarcacao) {
        return embarcacao.id !== id;
    });

    salvarDados(dados);
}

function salvarLocacao(locacao) {
    const dados = lerDados();

    if (locacao.id) {
        const indice = dados.locacoes.findIndex(function (item) {
            return item.id === locacao.id;
        });

        if (indice !== -1) {
            dados.locacoes[indice] = locacao;
        }
    } else {
        locacao.id = proximoId(dados.locacoes);
        dados.locacoes.push(locacao);
    }

    salvarDados(dados);
    return locacao;
}

function excluirLocacao(id) {
    const dados = lerDados();

    dados.locacoes = dados.locacoes.filter(function (locacao) {
        return locacao.id !== id;
    });

    salvarDados(dados);
}