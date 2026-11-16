function criarTabela(colunas, linhas) {
    const cabecalho = colunas.map(function (coluna) {
        if (coluna && typeof coluna === "object") {
            return `<th scope="col" class="${coluna.classe || ""}">${coluna.titulo}</th>`;
        }

        return `<th scope="col">${coluna}</th>`;
    }).join("");

    const corpo = linhas.map(function (celulas) {
        const itens = celulas.map(function (celula) {
            if (celula && typeof celula === "object") {
                return `<td class="${celula.classe || ""}">${celula.conteudo}</td>`;
            }

            return `<td>${celula}</td>`;
        }).join("");

        return `<tr>${itens}</tr>`;
    }).join("");

    return `
        <div class="table-responsive">
            <table class="table table-hover align-middle mb-0">
                <thead>
                    <tr>${cabecalho}</tr>
                </thead>
                <tbody>${corpo}</tbody>
            </table>
        </div>
    `;
}
