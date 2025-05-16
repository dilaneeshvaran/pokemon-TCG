const handContainer = document.getElementById("handContainer");
const deckContainer = document.getElementById("deckContainer");

export function displayDeckCards() {
  let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];

  deckContainer.innerHTML = "";

  if (!deckCards || deckCards.length === 0 || deckCards[0].id === undefined) {
    deckContainer.innerHTML = "<p>Votre pioche est vide. Tirez des cartes!</p>";
    return;
  }

  deckCards.forEach((pokemon) => {
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

    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
      </div>
    `;

    handContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  displayDeckCards();
  displayHandCards();
});
