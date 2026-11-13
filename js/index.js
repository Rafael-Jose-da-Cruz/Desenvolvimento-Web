import { navBar } from "../components/navBar.js";

const meusLinks = [
    { texto: "Início", url: "#" },
    { texto: "Sobre", url: "#sobre" },
    { texto: "Contato", url: "#contato" }
];

const menuCriado = navBar("Nome do Site", meusLinks)

document.body.prepend(menuCriado);

const rodapeCriado = footer("Nome");
document.body.append(rodapeCriado);
