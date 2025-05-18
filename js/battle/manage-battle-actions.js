import {
  displayBotAction,
  displayPlayerAction,
} from "./display-battle-actions.js";

import { updateBattleLog, MESSAGES } from "./helper/send-battle-logs.js";

import { processBattleActions } from "./battle-logic.js";

document.addEventListener("DOMContentLoaded", () => {
  const attackBtn = document.getElementById("attackBtn");
  const defendBtn = document.getElementById("defendBtn");
  const battleLog = document.getElementById("battleLog");
  const battleActions = document.querySelector(".battle-actions");
  const playerSelectedAction = document.getElementById("playerSelectedAction");
  const botSelectedAction = document.getElementById("botSelectedAction");

  if (attackBtn && defendBtn) {
    attackBtn.addEventListener("click", () => handlePlayerAction("attack"));
    defendBtn.addEventListener("click", () => handlePlayerAction("defend"));
  }

  async function handlePlayerAction(playerAction) {
    if (battleActions) {
      battleActions.style.display = "none";
    }

    displayPlayerAction(playerAction);
    updateBattleLog(MESSAGES.OPPONENT_TURN);

    const delayInSeconds = Math.floor(Math.random() * 3) + 2;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));

    const botChoice = Math.random() > 0.5 ? "attack" : "defend";
    displayBotAction(botChoice);

    processBattleLog(playerAction, botChoice);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    processBattleActions(playerAction, botChoice);
    await new Promise((resolve) => setTimeout(resolve, 2000));

    if (playerSelectedAction) {
      playerSelectedAction.innerHTML = "";
    }

    if (botSelectedAction) {
      botSelectedAction.innerHTML = "";
    }

    setTimeout(() => {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      if (playerActivePokemonCard) {
        if (battleActions) {
          battleActions.style.display = "flex";
        }
        updateBattleLog(MESSAGES.YOUR_TURN);
      } else {
        localStorage.setItem("battleState", "botSelecting");
      }
    }, 1000);
  }

  function processBattleLog(playerAction, botAction) {
    if (battleLog) {
      let message = "";

      if (playerAction === "attack" && botAction === "attack") {
        message = "Les deux joueurs attaquent!";
      } else if (playerAction === "attack" && botAction === "defend") {
        message = "Vous attaquez, l'adversaire se défend!";
      } else if (playerAction === "defend" && botAction === "attack") {
        message = "Vous vous défendez, l'adversaire attaque!";
      } else {
        message = "Les deux joueurs se défendent!";
      }

      updateBattleLog(message);
    }
  }
});
