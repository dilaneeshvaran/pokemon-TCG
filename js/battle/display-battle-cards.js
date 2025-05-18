import { getTypeAdvantageString } from "./card-type-advantage.js";
import { generateCardHTML } from "./helper/generateCardHTML.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerCards = document.getElementById("playerCards");
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  const botCards = document.getElementById("botCards");
  const botActivePokemon = document.getElementById("botActivePokemon");

  if (playerCards) {
    const battleHandCards =
      JSON.parse(localStorage.getItem("battleHandCards")) || [];
    playerCards.innerHTML = "";

    battleHandCards.forEach((pokemon) => {
      if (!pokemon.name) return;

      const card = document.createElement("div");

      if (pokemon.eliminated) {
        card.className = `pokemon-card eliminated-card type-${pokemon.type}`;
        card.dataset.pokemonId = pokemon.id;
        card.id = `pokemon-card-${pokemon.id}`;
        card.innerHTML = generateCardHTML(pokemon, true);
      } else {
        card.className = `pokemon-card type-${pokemon.type}`;
        card.dataset.pokemonId = pokemon.id;
        card.id = `pokemon-card-${pokemon.id}`;
        card.innerHTML = generateCardHTML(pokemon);
      }

      playerCards.appendChild(card);
    });
    displayActivePokemonPlayer();
  }

  function displayActivePokemonPlayer() {
    if (playerActivePokemon) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );

      if (playerActivePokemonCard && botActivePokemonCard) {
        const typeAdvantage = getTypeAdvantageString(
          playerActivePokemonCard.type,
          botActivePokemonCard.type
        );

        playerActivePokemon.innerHTML = `
      <div class="pokemon-card type-${playerActivePokemonCard.type}">
          ${generateCardHTML(
            playerActivePokemonCard,
            false,
            true,
            typeAdvantage
          )}
      </div>
      `;
      }
    }
  }

  if (botCards) {
    const battleBotCards =
      JSON.parse(localStorage.getItem("battleBotCards")) || [];

    botCards.innerHTML = "";

    battleBotCards.forEach((pokemon) => {
      if (!pokemon.name) return;

      const card = document.createElement("div");

      if (pokemon.eliminated) {
        card.className = `pokemon-card eliminated-card type-${pokemon.type}`;
        card.dataset.pokemonId = pokemon.id;
        card.id = `pokemon-card-${pokemon.id}`;
        card.innerHTML = generateCardHTML(pokemon, true);
      } else {
        card.className = `pokemon-card type-${pokemon.type}`;
        card.dataset.pokemonId = pokemon.id;
        card.id = `pokemon-card-${pokemon.id}`;
        card.innerHTML = generateCardHTML(pokemon);
      }

      botCards.appendChild(card);
    });
    displayActivePokemonBot();
  }

  function displayActivePokemonBot() {
    if (botActivePokemon) {
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );

      if (botActivePokemonCard && playerActivePokemonCard) {
        const typeAdvantage = getTypeAdvantageString(
          botActivePokemonCard.type,
          playerActivePokemonCard.type
        );

        botActivePokemon.innerHTML = `
      <div class="pokemon-card type-${botActivePokemonCard.type}">
          ${generateCardHTML(botActivePokemonCard, false, true, typeAdvantage)}
      </div>
      `;
      }
    }
  }
});
