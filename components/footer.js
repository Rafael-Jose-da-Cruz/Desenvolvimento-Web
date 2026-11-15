// Componente de rodapé usado em todas as páginas

function criarFooter() {
    const footer = document.createElement("footer");
    footer.className = "bg-dark text-white text-center py-3";

    footer.innerHTML = `
        <div class="container">
            <p class="small mb-0">© ${new Date().getFullYear()} Titanic Náutica</p>
        </div>
    `;

    return footer;
}