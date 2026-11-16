function criarCardEmbarcacao(embarcacao, comAcoes) {
    const disponivel = embarcacao.status === "disponivel";

    const acoes = comAcoes ? `
        <div class="d-flex gap-2 mt-2">
            <button type="button" class="btn btn-sm btn-outline-secondary flex-fill"
                data-acao="editar" data-id="${embarcacao.id}">
                Editar
            </button>
            <button type="button" class="btn btn-sm btn-outline-danger flex-fill"
                data-acao="excluir" data-id="${embarcacao.id}">
                Excluir
            </button>
        </div>
    ` : "";

    return `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card h-100">
                <img
                    src="${escaparHtml(embarcacao.imagem)}"
                    alt="Embarcação ${escaparHtml(embarcacao.nome)}"
                    class="card-img-top imagem-embarcacao"
                    loading="lazy"
                >
                <div class="card-body d-flex flex-column">
                    <h3 class="h5 mb-1">${escaparHtml(embarcacao.nome)}</h3>
                    <p class="text-secondary small mb-2">
                        ${escaparHtml(embarcacao.tipo)} · até ${embarcacao.capacidade} pessoas
                    </p>
                    <p class="mb-2">
                        <span class="fw-bold">${formatarMoeda(embarcacao.precoDia)}</span>
                        <span class="text-secondary small">/ dia</span>
                    </p>
                    <p class="mb-3">
                        ${disponivel
                            ? '<span class="badge text-bg-success">Disponível</span>'
                            : '<span class="badge text-bg-secondary">Em manutenção</span>'}
                    </p>
                    <button type="button" class="btn btn-outline-primary btn-sm mt-auto"
                        data-embarcacao="${embarcacao.id}">
                        Ver detalhes
                    </button>
                    ${acoes}
                </div>
            </div>
        </div>
    `;
}