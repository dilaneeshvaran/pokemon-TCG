import { getTypeAdvantageInt } from "./card-type-advantage.js";
import {
  displayBotAction,
  displayPlayerAction,
} from "./display-battle-actions.js";

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
    displayPlayerAction(playerAction);

    if (battleActions) {
      battleActions.style.display = "none";
    }

    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Tour de l'adversaire...</div>`;
    }

    const delayInSeconds = Math.floor(Math.random() * 4) + 2;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));

    const botChoice = Math.random() > 0.5 ? "attack" : "defend";
    displayBotAction(botChoice);

    processBattleLog(playerAction, botChoice);
    processBattleActions();

    setTimeout(() => {
      if (playerSelectedAction) {
        playerSelectedAction.innerHTML = "";
      }

      if (botSelectedAction) {
        botSelectedAction.innerHTML = "";
      }

      if (battleActions) {
        battleActions.style.display = "flex";
      }

      if (battleLog) {
        battleLog.innerHTML = "";
      }
    }, 2000);
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

  function processBattleActions() {
    const playerActivePokemonCard = JSON.parse(
      localStorage.getItem("playerActivePokemonCard")
    );
    const botActivePokemonCard = JSON.parse(
      localStorage.getItem("botActivePokemonCard")
    );
  }
});
