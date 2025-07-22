import { getTypeAdvantageString } from "./card-type-advantage.js";
import { generateCardHTML } from "./helper/generateCardHTML.js";
import { selectNewActivePokemon } from "./select-new-active-card.js";

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
        // Ajout : rendre la carte KO cliquable si reviveMode
        if (localStorage.getItem('reviveMode') === '1') {
          card.classList.add('revive-selectable');
          card.style.cursor = 'pointer';
          card.title = 'Cliquez pour ressusciter ce Pokémon';
          card.addEventListener('click', () => {
            // Résurrection
            if (!pokemon.maxHp) pokemon.maxHp = pokemon.hp || 100;
            pokemon.hp = Math.floor((pokemon.maxHp || 100) * 0.5);
            pokemon.eliminated = false;
            pokemon.status = 'none';
            pokemon.statusTurns = 0;
            // Met à jour la main
            const hand = JSON.parse(localStorage.getItem('battleHandCards')) || [];
            const idx = hand.findIndex(c => c.id === pokemon.id);
            if (idx !== -1) hand[idx] = pokemon;
            localStorage.setItem('battleHandCards', JSON.stringify(hand));
            localStorage.removeItem('reviveMode');
            // Message et refresh
            if (battleLog) battleLog.innerHTML = `<div class='battle-log-message'>${pokemon.name} a été ressuscité !</div>`;
            setTimeout(() => window.location.reload(), 900);
          });
        }
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
        let statusHtml = "";
        if (playerActivePokemonCard.status && playerActivePokemonCard.status !== 'none') {
          const statusMap = { burn: '🔥 Brûlure', freeze: '❄️ Gel', poison: '☠️ Poison', paralyze: '⚡ Paralysie' };
          statusHtml = `<div class='status-indicator'>${statusMap[playerActivePokemonCard.status] || playerActivePokemonCard.status}</div>`;
        }

        playerActivePokemon.innerHTML = `
        <div class="pokemon-card type-${playerActivePokemonCard.type}">
            ${generateCardHTML(
              playerActivePokemonCard,
              false,
              true,
              typeAdvantage
            )}
            ${statusHtml}
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
        let statusHtml = "";
        if (botActivePokemonCard.status && botActivePokemonCard.status !== 'none') {
          const statusMap = { burn: '🔥 Brûlure', freeze: '❄️ Gel', poison: '☠️ Poison', paralyze: '⚡ Paralysie' };
          statusHtml = `<div class='status-indicator'>${statusMap[botActivePokemonCard.status] || botActivePokemonCard.status}</div>`;
        }

        botActivePokemon.innerHTML = `
        <div class="pokemon-card type-${botActivePokemonCard.type}">
            ${generateCardHTML(
              botActivePokemonCard,
              false,
              true,
              typeAdvantage
            )}
            ${statusHtml}
        </div>
        `;
      }
    }
  }
  if (localStorage.getItem("battleState") === "playerSelecting") {
    selectNewActivePokemon("player");
  }
});
