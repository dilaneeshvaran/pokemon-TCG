import { showCardDetails } from "./display-card-details.js";
import { groupCardsByIdPreservingOrder } from "./catalog/catalog.js";

const handContainer = document.getElementById("handContainer");
const deckContainer = document.getElementById("deckContainer");

export function displayDeckCards() {
  let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];

  deckContainer.innerHTML = "";

  if (!deckCards || deckCards.length === 0) {
    deckContainer.innerHTML = "<p>Votre pioche est vide. Tirez des cartes!</p>";
    return;
  }

  // group cards by id while preserving order
  const { groupedCards, cardOrder } = groupCardsByIdPreservingOrder(deckCards);

  cardOrder.forEach((cardId) => {
    const pokemon = groupedCards[cardId];
    if (!pokemon.name) return;

    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.type}`;
    card.dataset.pokemonId = pokemon.id;
    card.id = `pokemon-card-${pokemon.id}`;

    card.setAttribute("draggable", true);

    card.innerHTML = `
  <img src="${pokemon.image}" alt="${pokemon.name}">
  <div class="card-body">
    <h5 class="card-title">${pokemon.name}</h5>
    <div class="card-type">${pokemon.type}</div>
    ${
      pokemon.count > 1 ? `<div class="card-count">x${pokemon.count}</div>` : ""
    }
  </div>
`;

    card.addEventListener("click", () => {
      showCardDetails(pokemon);
    });

    deckContainer.appendChild(card);
  });
}

export function displayHandCards() {
  let handCards = JSON.parse(localStorage.getItem("handCards")) || [];

  handContainer.innerHTML = "";

  if (!handCards || handCards.length === 0) {
    handContainer.innerHTML =
      "<p>Votre main est vide. Glissez des cartes ici!</p>";
    return;
  }

  handCards.forEach((pokemon) => {
    if (!pokemon.name) return;

    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.type}`;
    card.dataset.pokemonId = pokemon.id;
    card.id = `pokemon-card-${pokemon.id}`;
    card.setAttribute("draggable", true);

    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
      </div>
    `;

    card.addEventListener("click", () => {
      showCardDetails(pokemon);
    });

    handContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayDeckCards();
  displayHandCards();
});
