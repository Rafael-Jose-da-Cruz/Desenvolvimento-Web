function exportarEmbarcacoesCsv() {
    const linhas = ["nome;tipo;capacidade;precoDia;status;descricao"];

    listarEmbarcacoes().forEach(function (embarcacao) {
        const campos = [
            embarcacao.nome,
            embarcacao.tipo,
            embarcacao.capacidade,
            embarcacao.precoDia,
            embarcacao.status,
            embarcacao.descricao
        ];

        linhas.push(campos.map(function (campo) {
            const texto = String(campo === undefined || campo === null ? "" : campo)
                .replace(/\r?\n/g, " ");
            return '"' + texto.replace(/"/g, '""') + '"';
        }).join(";"));
    });

    const blob = new Blob(["\uFEFF" + linhas.join("\r\n")], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);
    link.download = "embarcacoes.csv";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(link.href);
}

function separarLinhaCsv(linha) {
    const campos = [];
    let campo = "";
    let aspas = false;

    for (let indice = 0; indice < linha.length; indice++) {
        const caractere = linha[indice];

        if (caractere === '"') {
            if (aspas && linha[indice + 1] === '"') {
                campo += '"';
                indice += 1;
            } else {
                aspas = !aspas;
            }
        } else if (caractere === ";" && !aspas) {
            campos.push(campo);
            campo = "";
        } else {
            campo += caractere;
        }
    }

    campos.push(campo);
    return campos;
}

function importarEmbarcacoesCsv(arquivo) {
    return new Promise(function (resolver, rejeitar) {
        const leitor = new FileReader();

        leitor.onload = function () {
            const linhas = String(leitor.result)
                .replace(/^\uFEFF/, "")
                .split(/\r?\n/)
                .filter(function (linha) {
                    return linha.trim() !== "";
                });

            let importadas = 0;

            linhas.slice(1).forEach(function (linha) {
                const campos = separarLinhaCsv(linha);
                const nome = (campos[0] || "").trim();
                const tipo = (campos[1] || "").trim();
                const capacidade = Number(campos[2]);
                const precoDia = Number(String(campos[3] || "").replace(",", "."));

                if (nome === "" || tipo === ""
                    || !Number.isFinite(capacidade) || capacidade <= 0
                    || !Number.isFinite(precoDia) || precoDia <= 0) {
                    return;
                }

                salvarEmbarcacao({
                    nome: nome,
                    tipo: tipo,
                    capacidade: capacidade,
                    precoDia: precoDia,
                    status: (campos[4] || "").trim() === "manutencao" ? "manutencao" : "disponivel",
                    imagem: "https://placehold.co/640x420/1e3d59/ffffff?text=" + encodeURIComponent(nome),
                    descricao: (campos[5] || "").trim() || "Sem descrição cadastrada."
                });

                importadas += 1;
            });

            resolver(importadas);
        };

        leitor.onerror = function () {
            rejeitar(leitor.error);
        };

        leitor.readAsText(arquivo, "UTF-8");
    });
}
