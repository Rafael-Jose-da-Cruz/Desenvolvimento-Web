document.addEventListener("DOMContentLoaded", function () {
    const selectFiltro = document.getElementById("filtro-status");
    const cardsDuvidas = document.querySelectorAll(".card-duvida");

    if (selectFiltro) {
        selectFiltro.addEventListener("change", function () {
            const categoriaSelecionada = this.value;

            cardsDuvidas.forEach(function (card) {
                const categoriaCard = card.getAttribute("data-categoria");

                if (categoriaSelecionada === "" || categoriaCard === categoriaSelecionada) {
                    card.classList.remove("d-none");
                } else {
                    card.classList.add("d-none");
                }
            });
        });
    }
});