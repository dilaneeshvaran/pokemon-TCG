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

  function renderPlayerHand() {
    if (playerCards) {
      const battleHandCards =
        JSON.parse(localStorage.getItem("battleHandCards")) || [];
      playerCards.innerHTML = "";
      const battleState = localStorage.getItem("battleState");

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
              // Met à jour la main depuis le localStorage
              const hand = JSON.parse(localStorage.getItem('battleHandCards')) || [];
              const idx = hand.findIndex(c => c.id === pokemon.id);
              if (idx !== -1) {
                if (!hand[idx].maxHp) hand[idx].maxHp = hand[idx].hp || 100;
                hand[idx].hp = Math.floor((hand[idx].maxHp || 100) * 0.5);
                hand[idx].eliminated = false;
                hand[idx].status = 'none';
                hand[idx].statusTurns = 0;
                localStorage.setItem('battleHandCards', JSON.stringify(hand));
                localStorage.removeItem('reviveMode');
                if (battleLog) battleLog.innerHTML = `<div class='battle-log-message'>${hand[idx].name} a été ressuscité !</div>`;
                renderPlayerHand();
              }
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
  }

  renderPlayerHand();

  // Ajout : écoute l'événement custom pour forcer la mise à jour de la main lors du rappel
  window.addEventListener('reviveModeActivated', renderPlayerHand);

  function displayActivePokemonPlayer() {
    if (playerActivePokemon) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      const battleState = localStorage.getItem("battleState");

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
