export function displayDeckCardsCatalog(filterName = "", filterType = "") {
  let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];

  deckContainer.innerHTML = "";

  if (!deckCards || deckCards.length === 0) {
    deckContainer.innerHTML = "<p>Votre pioche est vide. Tirez des cartes!</p>";
    return;
  }

  // ✅ Filtrage
  const filteredDeck = deckCards.filter((pokemon) => {
    const matchName = pokemon.name?.toLowerCase().includes(filterName.toLowerCase());
    const matchType = filterType ? pokemon.type?.toLowerCase() === filterType.toLowerCase() : true;
    return matchName && matchType;
  });

  if (filteredDeck.length === 0) {
    deckContainer.innerHTML = "<p>Aucune carte ne correspond à ce filtre.</p>";
    return;
  }

  filteredDeck.forEach((pokemon) => {
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

    deckContainer.appendChild(card);
  });
}

const searchInput = document.getElementById("searchInput");
const typeFilter = document.getElementById("typeFilter");

function applyFilters() {
  const nameValue = searchInput.value.trim();
  const typeValue = typeFilter.value;
  displayDeckCardsCatalog(nameValue, typeValue);
}

searchInput.addEventListener("input", applyFilters);
typeFilter.addEventListener("change", applyFilters);