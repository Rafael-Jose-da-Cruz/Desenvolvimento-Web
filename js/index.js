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
import { boatCard } from "../components/boatCard.js";

const boat = boatCard("https://placehold.co/600x400", "Lancha Premium do Véio da Lancha", "R$ 250.000,00");

const div = document.querySelector("#app");
div.append(boat);
