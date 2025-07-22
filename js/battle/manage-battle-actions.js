import {
  displayBotAction,
  displayPlayerAction,
} from "./display-battle-actions.js";

import { updateBattleLog, MESSAGES } from "./helper/send-battle-logs.js";
import { getTypeAdvantageInt } from "./card-type-advantage.js";

import { processBattleActions } from "./battle-logic.js";

document.addEventListener("DOMContentLoaded", () => {
  const attackBtn = document.getElementById("attackBtn");
  const defendBtn = document.getElementById("defendBtn");
  // Ajout du bouton attaque spéciale
  let specialBtn = document.getElementById("specialAttackBtn");
  if (!specialBtn) {
    specialBtn = document.createElement("button");
    specialBtn.id = "specialAttackBtn";
    specialBtn.textContent = "Attaque spéciale";
    specialBtn.className = "battle-btn special-btn";
    if (attackBtn && attackBtn.parentNode) {
      attackBtn.parentNode.insertBefore(specialBtn, defendBtn);
    }
  }

  const battleLog = document.getElementById("battleLog");
  const battleActions = document.querySelector(".battle-actions");
  const playerSelectedAction = document.getElementById("playerSelectedAction");
  const botSelectedAction = document.getElementById("botSelectedAction");

  if (attackBtn && defendBtn && specialBtn) {
    attackBtn.addEventListener("click", () => handlePlayerAction("attack"));
    defendBtn.addEventListener("click", () => handlePlayerAction("defend"));
    specialBtn.addEventListener("click", () => handlePlayerAction("special"));
  }

  //exporter pour l'acces global de la fonction handlePlayerAction
  window.handlePlayerAction = handlePlayerAction;

  // Rendre la fonction accessible globalement pour le bot
  window.getTypeAdvantageInt = getTypeAdvantageInt;

  async function handlePlayerAction(playerAction) {
    if (battleActions) {
      battleActions.style.display = "none";
    }

    displayPlayerAction(playerAction);
    updateBattleLog(MESSAGES.OPPONENT_TURN);

    const delayInSeconds = Math.floor(Math.random() * 3) + 2;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));

    // Le bot peut aussi choisir l'attaque spéciale
    // Bot intelligent
    const playerActivePokemonCard = JSON.parse(localStorage.getItem("playerActivePokemonCard"));
    const botActivePokemonCard = JSON.parse(localStorage.getItem("botActivePokemonCard"));
    let botChoice = "attack";
    if (botActivePokemonCard && playerActivePokemonCard) {
      // Si PV bot < 40%, privilégier défense
      if (botActivePokemonCard.hp / (botActivePokemonCard.maxHp || 100) < 0.4) {
        botChoice = Math.random() < 0.7 ? "defend" : "attack";
      } else {
        // Si avantage de type, privilégier attaque spéciale
        const getTypeAdvantageInt = window.getTypeAdvantageInt || ((a,b)=>0);
        let typeBonus = 0;
        try {
          typeBonus = getTypeAdvantageInt(botActivePokemonCard.type, playerActivePokemonCard.type);
        } catch(e) {}
        if (typeBonus > 0) {
          botChoice = Math.random() < 0.7 ? "special" : "attack";
        } else {
          botChoice = Math.random() < 0.5 ? "attack" : "special";
        }
      }
    }
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
        if (localStorage.getItem("battleState") !== "finished") {
          if (battleActions) {
            battleActions.style.display = "flex";
          }

          updateBattleLog(MESSAGES.YOUR_TURN);
        }
      } else {
        localStorage.setItem("battleState", "botSelecting");
      }
    }, 1000);
  }

  function processBattleLog(playerAction, botAction) {
    if (battleLog) {
      let message = "";

      if (playerAction === "special" && botAction === "special") {
        message = "Deux attaques spéciales s'entrechoquent !";
      } else if (playerAction === "special" && botAction === "defend") {
        message = "Vous lancez une attaque spéciale, l'adversaire se défend !";
      } else if (playerAction === "defend" && botAction === "special") {
        message = "Vous vous défendez, l'adversaire lance une attaque spéciale !";
      } else if (playerAction === "special" && botAction === "attack") {
        message = "Vous lancez une attaque spéciale, l'adversaire attaque normalement !";
      } else if (playerAction === "attack" && botAction === "special") {
        message = "Vous attaquez normalement, l'adversaire lance une attaque spéciale !";
      } else if (playerAction === "attack" && botAction === "attack") {
        message = "Les deux joueurs attaquent !";
      } else if (playerAction === "attack" && botAction === "defend") {
        message = "Vous attaquez, l'adversaire se défend !";
      } else if (playerAction === "defend" && botAction === "attack") {
        message = "Vous vous défendez, l'adversaire attaque !";
      } else {
        message = "Les deux joueurs se défendent !";
      }

      updateBattleLog(message);
    }
  }
});
