export function checkForEliminations() {
  const playerActivePokemonCard = JSON.parse(
    localStorage.getItem("playerActivePokemonCard")
  );
  const botActivePokemonCard = JSON.parse(
    localStorage.getItem("botActivePokemonCard")
  );

  if (playerActivePokemonCard && playerActivePokemonCard.hp <= 0) {
    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Votre ${playerActivePokemonCard.name} est K.O. !</div>`;
    }
    eliminateActivePokemon("player");
    selectNewActivePokemon("player");
  }

  if (botActivePokemonCard && botActivePokemonCard.hp <= 0) {
    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Le ${botActivePokemonCard.name} adversaire est K.O. !</div>`;
    }
    eliminateActivePokemon("bot");
    selectNewActivePokemon("bot");
  }
}

export function eliminateActivePokemon(side) {
  const activePokemonKey =
    side === "player" ? "playerActivePokemonCard" : "botActivePokemonCard";
  const cardsKey = side === "player" ? "battleHandCards" : "battleBotCards";

  const activePokemon = JSON.parse(localStorage.getItem(activePokemonKey));
  const cards = JSON.parse(localStorage.getItem(cardsKey)) || [];

  if (!activePokemon) return;

  activePokemon.eliminated = true;

  cards.push(activePokemon);

  localStorage.setItem(cardsKey, JSON.stringify(cards));

  if (side === "player") {
    const playerCardsContainer = document.getElementById("playerCards");
    if (playerCardsContainer) {
      const card = addEliminatedCardToHand(activePokemon);
      playerCardsContainer.appendChild(card);
    }
  } else {
    const botCardsContainer = document.getElementById("botCards");
    if (botCardsContainer) {
      const card = addEliminatedCardToHand(activePokemon);
      botCardsContainer.appendChild(card);
    }
  }

  localStorage.removeItem(activePokemonKey);

  const activePokemonContainer = document.getElementById(
    side === "player" ? "playerActivePokemon" : "botActivePokemon"
  );
  if (activePokemonContainer) {
    activePokemonContainer.innerHTML = "";
  }
}

function addEliminatedCardToHand(pokemon) {
  const card = document.createElement("div");
  card.className = `pokemon-card eliminated-card type-${pokemon.type}`;
  card.dataset.pokemonId = pokemon.id;
  card.id = `pokemon-card-${pokemon.id}`;

  card.innerHTML = `
    <div class="eliminated-overlay">KO</div>
    <img src="${pokemon.image}" alt="${pokemon.name}">
    <div class="card-body">
      <h5 class="card-title">${pokemon.name}</h5>
      <div class="card-type">${pokemon.type}</div>
      <div class="stats">
        <div class="stat hp">PV: 0</div>
        <div class="stat attack">ATQ: ${pokemon.attack}</div>
        <div class="stat defense">DEF: ${pokemon.defense}</div>
      </div>
    </div>
  `;

  return card;
}
