import { getTypeAdvantageString } from "./card-type-advantage.js";
import { generateCardHTML } from "./helper/generateCardHTML.js";

export function updatePokemonHP(updatingCard) {
  if (updatingCard && updatingCard == "player") {
    const playerHP = document.querySelector("#playerActivePokemon .hp");
    if (playerHP) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      if (playerActivePokemonCard) {
        playerHP.innerHTML = `PV: ${playerActivePokemonCard.hp}`;
        playerHP.classList.add("hp-updated");
        setTimeout(() => playerHP.classList.remove("hp-updated"), 1000);
      }
    }
  }
  if (updatingCard && updatingCard == "bot") {
    const botHP = document.querySelector("#botActivePokemon .hp");
    if (botHP) {
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      if (botActivePokemonCard) {
        botHP.innerHTML = `PV: ${botActivePokemonCard.hp}`;
        botHP.classList.add("hp-updated");
        setTimeout(() => botHP.classList.remove("hp-updated"), 1000);
      }
    }
  }
}

export function updateBotActivePokemon(pokemon) {
  const botActivePokemon = document.getElementById("botActivePokemon");
  if (botActivePokemon) {
    const typeAdvantageString = getTypeAdvantageString(
      pokemon.type,
      JSON.parse(localStorage.getItem("playerActivePokemonCard"))?.type || ""
    );

    botActivePokemon.innerHTML = `
      <div class="pokemon-card type-${pokemon.type}">
        ${generateCardHTML(pokemon, false, true, typeAdvantageString)}
      </div>
    `;

    botActivePokemon
      .querySelector(".pokemon-card")
      .classList.add("card-updated");
    setTimeout(() => {
      const card = botActivePokemon.querySelector(".pokemon-card");
      if (card) card.classList.remove("card-updated");
    }, 1000);
  }
}

export function updatePlayerActivePokemon(pokemon) {
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  if (playerActivePokemon) {
    const typeAdvantageString = getTypeAdvantageString(
      pokemon.type,
      JSON.parse(localStorage.getItem("botActivePokemonCard"))?.type || ""
    );

    playerActivePokemon.innerHTML = `
      <div class="pokemon-card type-${pokemon.type}">
        ${generateCardHTML(pokemon, false, true, typeAdvantageString)}
      </div>
    `;

    playerActivePokemon
      .querySelector(".pokemon-card")
      .classList.add("card-updated");
    setTimeout(() => {
      const card = playerActivePokemon.querySelector(".pokemon-card");
      if (card) card.classList.remove("card-updated");
    }, 1000);
  }
}

export function removeCardFromHand(cardId) {
  const cardElement = document.querySelector(
    `#playerCards .pokemon-card[data-pokemon-id="${cardId}"]`
  );
  if (cardElement) {
    cardElement.remove();
  }
}
