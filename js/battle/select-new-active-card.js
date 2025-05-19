import { declareWinner } from "./manage-eliminations.js";
import {
  updateBotActivePokemon,
  removeCardFromHand,
  updatePlayerActivePokemon,
} from "./update-battle-cards.js";

import { updateBattleLog, MESSAGES } from "./helper/send-battle-logs.js";

export function selectNewActivePokemon(side) {
  if (side === "bot") {
    selectRandomBotCard();
  } else {
    enablePlayerCardSelection();
  }
}

//bot
function selectRandomBotCard() {
  const battleState = localStorage.getItem("battleState");
  if (battleState === "finished") {
    return;
  }
  const battleBotCards =
    JSON.parse(localStorage.getItem("battleBotCards")) || [];
  const availableCards = battleBotCards.filter((card) => !card.eliminated);

  if (availableCards.length > 0) {
    const randomIndex = Math.floor(Math.random() * availableCards.length);
    const selectedCard = availableCards[randomIndex];

    const updatedBotCards = battleBotCards.filter(
      (card) => card.id !== selectedCard.id
    );
    localStorage.setItem("battleBotCards", JSON.stringify(updatedBotCards));
    localStorage.setItem("botActivePokemonCard", JSON.stringify(selectedCard));

    setTimeout(() => {
      const battleLog = document.getElementById("battleLog");
      if (battleLog) {
        battleLog.innerHTML = `<div class="battle-log-message">L'adversaire envoie ${selectedCard.name} au combat!</div>`;
      }

      updateBotActivePokemon(selectedCard);
    }, 1000);
  } else {
    declareWinner("player");
  }
}

//player
function enablePlayerCardSelection() {
  const battleState = localStorage.getItem("battleState");
  if (battleState === "finished") {
    return;
  }
  const battleHandCards =
    JSON.parse(localStorage.getItem("battleHandCards")) || [];
  const availableCards = battleHandCards.filter((card) => !card.eliminated);

  if (availableCards.length > 0) {
    localStorage.setItem("battleState", "playerSelecting");

    updateBattleLog(MESSAGES.CHOOSE_POKEMON);

    const playerActivePokemon = document.getElementById("playerActivePokemon");
    if (playerActivePokemon) {
      playerActivePokemon.classList.add("active-card-dropzone");
    }

    enableDragForPlayerCards();
  } else {
    declareWinner("bot");
  }
}

function enableDragForPlayerCards() {
  const playerCards = document.querySelectorAll(
    "#playerCards .pokemon-card:not(.eliminated-card)"
  );
  const playerActivePokemon = document.getElementById("playerActivePokemon");

  const battleActions = document.querySelector(".battle-actions");
  if (battleActions) {
    battleActions.style.display = "none";
  }

  if (playerActivePokemon) {
    playerActivePokemon.classList.add("active-card-dropzone");

    playerActivePokemon.addEventListener("dragover", (e) => {
      e.preventDefault();
      playerActivePokemon.classList.add("dragover");
    });

    playerActivePokemon.addEventListener("dragleave", (e) => {
      playerActivePokemon.classList.remove("dragover");
    });

    playerActivePokemon.addEventListener("drop", handleCardDrop);
  }

  playerCards.forEach((card) => {
    card.setAttribute("draggable", true);
    card.classList.add("selectable-card");

    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", card.dataset.pokemonId);
    });
  });
}

function handleCardDrop(e) {
  e.preventDefault();
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  playerActivePokemon.classList.remove("dragover");
  playerActivePokemon.classList.remove("active-card-dropzone");

  const cardId = e.dataTransfer.getData("text/plain");
  const battleHandCards =
    JSON.parse(localStorage.getItem("battleHandCards")) || [];

  const cardIndex = battleHandCards.findIndex((card) => card.id == cardId);
  if (cardIndex >= 0) {
    const selectedCard = battleHandCards[cardIndex];

    battleHandCards.splice(cardIndex, 1);
    localStorage.setItem("battleHandCards", JSON.stringify(battleHandCards));
    localStorage.setItem(
      "playerActivePokemonCard",
      JSON.stringify(selectedCard)
    );

    updateBattleLog(`${selectedCard.name}, a été choisis!`);

    playerActivePokemon.removeEventListener("dragover", () => {});
    playerActivePokemon.removeEventListener("dragleave", () => {});
    playerActivePokemon.removeEventListener("drop", handleCardDrop);

    updatePlayerActivePokemon(selectedCard);

    removeCardFromHand(cardId);

    setTimeout(() => {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      if (playerActivePokemonCard) {
        localStorage.removeItem("battleState");
        const battleActions = document.querySelector(".battle-actions");

        if (battleActions) {
          battleActions.style.display = "flex";
        }
        updateBattleLog(MESSAGES.YOUR_TURN);
      }
    }, 1000);
  }
}
