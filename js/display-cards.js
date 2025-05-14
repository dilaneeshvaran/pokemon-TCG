const handContainer = document.getElementById("handContainer");
const deckContainer = document.getElementById("deckContainer");

let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];

export function displayDeckCards() {
  deckContainer.innerHTML = "";

  if (!deckCards || deckCards.length === 0 || deckCards[0].id === undefined) {
    deckContainer.innerHTML = "<p>Votre pioche est vide. Tirez des cartes!</p>";
    return;
  }

  deckCards.forEach((pokemon) => {
    if (!pokemon.name) return;

    const card = document.createElement("div");
    card.className = "pokemon-card";
    card.dataset.pokemonId = pokemon.id;
    card.innerHTML = `
      <div class="card-header">
        <h3>${pokemon.name}</h3>
        <span class="type ${pokemon.type}">${pokemon.type}</span>
      </div>
      <div class="card-image">
        <img src="${pokemon.image}" alt="${pokemon.name}">
      </div>
      <div class="card-stats">
        <p>HP: ${pokemon.hp}</p>
        <p>Attack: ${pokemon.attack}</p>
        <p>Defense: ${pokemon.defense}</p>
        <p>Speed: ${pokemon.speed}</p>
      </div>
    `;

    deckContainer.appendChild(card);
  });
}

document.addEventListener("DOMContentLoaded", displayDeckCards);
window.addEventListener("storage", function (e) {
  if (e.key === "deckCards") {
    deckCards = JSON.parse(e.newValue) || [];
    displayDeckCards();
  }
});
