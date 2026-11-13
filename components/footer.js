export function footer(companyName) {
    const footerElement = document.createElement("footer");
    footerElement.classList.add("bg-dark", "text-white", "text-center", "py-4", "mt-auto");
    footerElement.setAttribute("data-bs-theme", "dark");

    const container = document.createElement("div");
    container.classList.add("container");

    const p = document.createElement("p");
    p.classList.add("mb-0", "small");
    
    const anoAtual = new Date().getFullYear();
    p.textContent = `© ${anoAtual} ${companyName}. Todos os direitos reservados.`;

    container.append(p);
    footerElement.append(container);

    return footerElement;
}