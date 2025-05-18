import { generateCardHTML } from "./helper/generateCardHTML.js";

export function checkForEliminations() {
  const battleLog = document.getElementById("battleLog");

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
  const cardsLocalStorageKey =
    side === "player" ? "battleHandCards" : "battleBotCards";

  const activePokemon = JSON.parse(localStorage.getItem(activePokemonKey));
  const cards = JSON.parse(localStorage.getItem(cardsLocalStorageKey)) || [];

  if (!activePokemon) return;

  activePokemon.eliminated = true;
  activePokemon.hp = 0;
  cards.push(activePokemon);

  localStorage.setItem(cardsLocalStorageKey, JSON.stringify(cards));

  localStorage.removeItem(activePokemonKey);

  const activePokemonContainer = document.getElementById(
    side === "player" ? "playerActivePokemon" : "botActivePokemon"
  );
  if (activePokemonContainer) {
    activePokemonContainer.innerHTML = "";
  }

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
}

function addEliminatedCardToHand(pokemon) {
  const card = document.createElement("div");
  card.className = `pokemon-card eliminated-card type-${pokemon.type}`;
  card.dataset.pokemonId = pokemon.id;
  card.id = `pokemon-card-${pokemon.id}`;

  card.innerHTML = generateCardHTML(pokemon, true);

  return card;
}
