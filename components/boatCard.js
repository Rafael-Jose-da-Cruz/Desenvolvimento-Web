
export function boatCard(img, label, price) {
    const card = document.createElement("div");
    card.classList.add("card", "h-100", "w-25", "shadow-sm", "border-0");

    const image = document.createElement("img");
    image.src = img;
    image.alt = label;
    image.classList.add("card-img-top");
    image.style.height = "200px";
    image.style.objectFit = "cover";

    const body = document.createElement("div");
    body.classList.add("card-body", "d-flex", "flex-column");

    const title = document.createElement("h5");
    title.classList.add("card-title", "fw-bold");
    title.textContent = label;

    const priceElement = document.createElement("p");
    priceElement.classList.add("card-text", "text-success", "fw-bold", "fs-5");
    priceElement.textContent = price;

    const button = document.createElement("button");
    button.classList.add("btn", "btn-primary", "mt-auto", "w-100");
    button.textContent = "Ver detalhes";

    body.append(title, priceElement, button);
    card.append(image, body);

    return card;
}
