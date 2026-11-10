import { boatCard } from "../components/boatCard.js";

const boat = boatCard("https://placehold.co/600x400", "Lancha Premium do Véio da Lancha", "R$ 250.000,00");

const div = document.querySelector("#app");
div.append(boat);