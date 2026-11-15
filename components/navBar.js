export function navBar(brandName, links) {
    const nav = document.createElement("nav");
    nav.classList.add("navbar", "navbar-expand-lg", "px-4");

    nav.style.backgroundColor = "#1e3d59";
    nav.setAttribute("data-bs-theme", "dark");

    const container = document.createElement("div");
    container.classList.add("container-fluid");

    const brand = document.createElement("a");
    brand.classList.add("navbar-brand", "fw-bold");
    brand.href = "#";
    brand.textContent = brandName;

    const toggler = document.createElement("button");
    toggler.classList.add("navbar-toggler");
    toggler.type = "button";
    toggler.setAttribute("data-bs-toggle", "collapse");
    toggler.setAttribute("data-bs-target", "#navbarNav");
    
    const togglerIcon = document.createElement("span");
    togglerIcon.classList.add("navbar-toggler-icon");
    toggler.append(togglerIcon);

    const collapseDiv = document.createElement("div");
    collapseDiv.classList.add("collapse", "navbar-collapse");
    collapseDiv.id = "navbarNav";

    const ul = document.createElement("ul");
    ul.classList.add("navbar-nav", "ms-auto");

    links.forEach(item => {
        const li = document.createElement("li");
        li.classList.add("nav-item");

        const a = document.createElement("a");
        a.classList.add("nav-link");
        a.href = item.url;
        a.textContent = item.texto;

        li.append(a);
        ul.append(li);
    });

    collapseDiv.append(ul);
    container.append(brand, toggler, collapseDiv);
    nav.append(container);

    return nav;
}