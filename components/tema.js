document.addEventListener("DOMContentLoaded", function() {
    const btnPadrao = document.getElementById("btn-tema-padrao");
    const btnEscuro = document.getElementById("btn-tema-escuro");

    if (localStorage.getItem("modo") === "escuro") {
        document.body.classList.add("modo-escuro");
    }

    if(btnPadrao){
        btnPadrao.addEventListener("click", function() {
            document.body.classList.remove("modo-escuro");
            localStorage.removeItem("modo");
        });
    }

    if(btnEscuro){
        btnEscuro.addEventListener("click", function() {
            document.body.classList.add("modo-escuro");
            localStorage.setItem("modo", "escuro");
        });
    }

});