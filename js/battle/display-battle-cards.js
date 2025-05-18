import { getTypeAdvantageString } from "./card-type-advantage.js";
import { generateCardHTML } from "./helper/generateCardHTML.js";

document.addEventListener("DOMContentLoaded", () => {
  const playerCards = document.getElementById("playerCards");
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  const botCards = document.getElementById("botCards");
  const botActivePokemon = document.getElementById("botActivePokemon");
  const battleState = localStorage.getItem("battleState");
  const battleLog = document.getElementById("battleLog");

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

        if (battleState === "playerSelecting") {
          card.setAttribute("draggable", true);
          card.classList.add("selectable-card");
        }
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

      if (battleState === "playerSelecting") {
        if (battleLog) {
          battleLog.innerHTML = `<div class="battle-log-message">Choisissez une nouvelle carte Pokémon!</div>`;
        }
        playerActivePokemon.classList.add("active-card-dropzone");
        return;
      }

      if (playerActivePokemonCard) {
        const typeAdvantage = botActivePokemonCard
          ? getTypeAdvantageString(
              playerActivePokemonCard.type,
              botActivePokemonCard.type
            )
          : "";

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

      if (battleState === "botSelecting") {
        if (battleLog) {
          battleLog.innerHTML = `<div class="battle-log-message">L'adversaire choisit une carte...</div>`;
        }
        return;
      }

      if (botActivePokemonCard) {
        const typeAdvantage = playerActivePokemonCard
          ? getTypeAdvantageString(
              botActivePokemonCard.type,
              playerActivePokemonCard.type
            )
          : "";

        botActivePokemon.innerHTML = `
        <div class="pokemon-card type-${botActivePokemonCard.type}">
            ${generateCardHTML(
              botActivePokemonCard,
              false,
              true,
              typeAdvantage
            )}
        </div>
        `;
      }
    }
  }
});
