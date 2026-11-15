// Funções auxiliares usadas em mais de uma página, incluir quando precisar formatar moeda ou data

function formatarMoeda(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) {
        return "—";
    }

    const partes = data.split("-");

    if (partes.length !== 3) {
        return data;
    }

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}
