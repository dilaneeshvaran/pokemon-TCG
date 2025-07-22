import { showCardDetails } from "../display-card-details.js";

const deckContainer = document.getElementById("deckContainer");

// groupe cards while preserving order
export function groupCardsByIdPreservingOrder(cards) {
  const groupedCards = {};
  const cardOrder = []; // Track the order of first appearance

  cards.forEach((pokemon) => {
    const key = pokemon.id;
    if (!groupedCards[key]) {
      groupedCards[key] = { ...pokemon, count: 1 };
      cardOrder.push(key); // Store the order when first encountered
    } else {
      groupedCards[key].count++;
    }
  });

  return { groupedCards, cardOrder };
}

export function displayDeckCardsCatalog(filterName = "", filterType = "") {
  const deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
  const deckTypeFilter = document.getElementById("deckTypeFilter");
  deckContainer.innerHTML = "";

  if (!deckCards || deckCards.length === 0) {
    deckContainer.innerHTML = "<p>Votre pioche est vide. Tirez des cartes!</p>";
    if (deckTypeFilter) {
      deckTypeFilter.innerHTML = '<option value="">Tous les types</option>';
    }
    return;
  }

  if (deckTypeFilter) {
    const currentValue = deckTypeFilter.value;
    const uniqueTypes = [
      ...new Set(deckCards.map((p) => p.type).filter(Boolean)),
    ];

    deckTypeFilter.innerHTML = '<option value="">Tous les types</option>';
    uniqueTypes.forEach((type) => {
      const option = document.createElement("option");
      option.value = type;
      option.textContent = type.charAt(0).toUpperCase() + type.slice(1);
      deckTypeFilter.appendChild(option);
    });

    deckTypeFilter.value = currentValue;
  }

  const filteredDeck = deckCards.filter((pokemon) => {
    const nameMatch = pokemon.name
      .toLowerCase()
      .includes(filterName.toLowerCase());
    const typeMatch = filterType ? pokemon.type === filterType : true;
    return nameMatch && typeMatch;
  });

  if (filteredDeck.length === 0) {
    deckContainer.innerHTML = "<p>Aucune carte ne correspond à ce filtre.</p>";
    return;
  }

  const { groupedCards, cardOrder } =
    groupCardsByIdPreservingOrder(filteredDeck);

  // Display cards in the original order they appeared
  cardOrder.forEach((cardId) => {
    const pokemon = groupedCards[cardId];
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
          pokemon.count > 1
            ? `<div class="card-count">x${pokemon.count}</div>`
            : ""
        }
      </div>
    `;

    card.addEventListener("click", () => {
      showCardDetails(pokemon);
    });

    deckContainer.appendChild(card);
  });
}

const deckSearchInput = document.getElementById("deckSearchInput");
const deckTypeFilter = document.getElementById("deckTypeFilter");

// Initialize catalog display
document.addEventListener("DOMContentLoaded", () => {
  displayDeckCardsCatalog();
});

if (deckSearchInput && deckTypeFilter) {
  deckSearchInput.addEventListener("input", () => {
    displayDeckCardsCatalog(deckSearchInput.value, deckTypeFilter.value);
  });

  deckTypeFilter.addEventListener("change", () => {
    displayDeckCardsCatalog(deckSearchInput.value, deckTypeFilter.value);
  });
}
