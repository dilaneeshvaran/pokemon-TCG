import {
  displayBotAction,
  displayPlayerAction,
} from "./display-battle-actions.js";

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

    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Tour de l'adversaire...</div>`;
    }

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
      if (battleActions) {
        battleActions.style.display = "flex";
      }

      if (battleLog) {
        battleLog.innerHTML = "Votre tour !";
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

      battleLog.innerHTML = `<div class="battle-log-message">${message}</div>`;
    }
  }
});
