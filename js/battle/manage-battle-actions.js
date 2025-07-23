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
  const potionBtn = document.getElementById("potionBtn");
  const reviveBtn = document.getElementById("reviveBtn");
  let potionUsed = false;
  if (localStorage.getItem("potionUsedOnce") === "1") potionUsed = true;
  let reviveUsed = false;
  if (localStorage.getItem("reviveUsedOnce") === "1") reviveUsed = true;
  let reviveMode = false;
  const battleLog = document.getElementById("battleLog");
  const battleActions = document.querySelector(".battle-actions");
  const playerSelectedAction = document.getElementById("playerSelectedAction");
  const botSelectedAction = document.getElementById("botSelectedAction");

  // update defend button state based on consecutive defends
  function updateDefendButtonState() {
    const playerConsecutiveDefends = parseInt(
      localStorage.getItem("playerConsecutiveDefends") || "0"
    );
    if (defendBtn) {
      if (playerConsecutiveDefends >= 2) {
        defendBtn.disabled = true;
        defendBtn.classList.add("defend-blocked");
        defendBtn.title =
          "Vous ne pouvez pas vous défendre plus de 2 fois consécutivement";
      } else {
        defendBtn.disabled = false;
        defendBtn.classList.remove("defend-blocked");
        defendBtn.title = "";
      }
    }
  }

  // Make the function globally accessible
  window.updateDefendButtonState = updateDefendButtonState;

  // Call this function initially and after each battle turn
  updateDefendButtonState();

  if (battleActions) {
    if (attackBtn)
      attackBtn.addEventListener("click", () => handlePlayerAction("attack"));
    if (defendBtn)
      defendBtn.addEventListener("click", () => handlePlayerAction("defend"));
    if (specialBtn)
      specialBtn.addEventListener("click", () => handlePlayerAction("special"));
    if (potionBtn) {
      if (potionUsed) {
        potionBtn.disabled = true;
        potionBtn.classList.add("item-used");
      }
      potionBtn.addEventListener("click", () => {
        if (potionUsed) {
          alert(
            "Vous ne pouvez utiliser la Potion qu'une seule fois par partie !"
          );
          return;
        }
        localStorage.setItem("potionUsedOnce", "1");
        let playerActive = JSON.parse(
          localStorage.getItem("playerActivePokemonCard")
        );
        if (!playerActive) return;
        if (!playerActive.maxHp) playerActive.maxHp = playerActive.hp;
        playerActive.hp = Math.min(playerActive.hp + 50, playerActive.maxHp);
        playerActive.status = "none";
        playerActive.statusTurns = 0;
        localStorage.setItem(
          "playerActivePokemonCard",
          JSON.stringify(playerActive)
        );
        updateBattleLog(
          "Vous utilisez une Potion ! Votre Pokémon est soigné de 50 PV et guéri de tout statut."
        );
        potionBtn.disabled = true;
        potionBtn.classList.add("item-used");
        potionUsed = true;
        setTimeout(() => window.location.reload(), 800);
      });
    }
    if (reviveBtn) {
      if (reviveUsed) {
        reviveBtn.disabled = true;
        reviveBtn.classList.add("item-used");
      }
      reviveBtn.addEventListener("click", () => {
        if (reviveUsed) {
          alert(
            "Vous ne pouvez utiliser le Rappel qu'une seule fois par partie !"
          );
          return;
        }
        // Marque le rappel comme utilisé pour toute la partie
        localStorage.setItem("reviveUsedOnce", "1");
        let hand = JSON.parse(localStorage.getItem("battleHandCards")) || [];
        if (!hand.some((card) => card.eliminated)) {
          updateBattleLog("Aucun Pokémon K.O. à ressusciter !");
          return;
        }
        reviveMode = true;
        localStorage.setItem("reviveMode", "1");
        updateBattleLog("Cliquez sur un Pokémon K.O. à ressusciter !");
        reviveBtn.disabled = true;
        reviveBtn.classList.add("item-used");
        reviveUsed = true;
        // Déclenche un événement custom pour forcer l'affichage des cartes KO cliquables
        window.dispatchEvent(new Event("reviveModeActivated"));
      });
    }
  }

  //exporter pour l'acces global de la fonction handlePlayerAction
  window.handlePlayerAction = handlePlayerAction;

  // Rendre la fonction accessible globalement pour le bot
  window.getTypeAdvantageInt = getTypeAdvantageInt;

  async function handlePlayerAction(playerAction) {
    // Check if defend is allowed
    if (playerAction === "defend") {
      const playerConsecutiveDefends = parseInt(
        localStorage.getItem("playerConsecutiveDefends") || "0"
      );
      if (playerConsecutiveDefends >= 2) {
        alert(
          "Vous ne pouvez pas vous défendre plus de 2 fois consécutivement !"
        );
        return;
      }
    }

    if (battleActions) {
      battleActions.style.display = "none";
    }

    displayPlayerAction(playerAction);
    updateBattleLog(MESSAGES.OPPONENT_TURN);

    const delayInSeconds = Math.floor(Math.random() * 3) + 2;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));

    // Le bot peut aussi choisir l'attaque spéciale
    // Bot intelligent
    const playerActivePokemonCard = JSON.parse(
      localStorage.getItem("playerActivePokemonCard")
    );
    const botActivePokemonCard = JSON.parse(
      localStorage.getItem("botActivePokemonCard")
    );
    const botConsecutiveDefends = parseInt(
      localStorage.getItem("botConsecutiveDefends") || "0"
    );

    let botChoice = "attack";
    if (botActivePokemonCard && playerActivePokemonCard) {
      //si pv bot < 40%, privilégier defense (sauf si limite atteinte)
      if (
        botActivePokemonCard.hp / (botActivePokemonCard.maxHp || 100) < 0.4 &&
        botConsecutiveDefends < 2
      ) {
        botChoice = Math.random() < 0.7 ? "defend" : "attack";
      } else {
        // Si avantage de type, privilégier attaque spéciale
        const getTypeAdvantageInt = window.getTypeAdvantageInt || ((a, b) => 0);
        let typeBonus = 0;
        try {
          typeBonus = getTypeAdvantageInt(
            botActivePokemonCard.type,
            playerActivePokemonCard.type
          );
        } catch (e) {}
        if (typeBonus > 0) {
          botChoice = Math.random() < 0.7 ? "special" : "attack";
        } else {
          botChoice = Math.random() < 0.5 ? "attack" : "special";
        }
      }
    }
    displayBotAction(botChoice);

    processBattleLog(playerAction, botChoice);
    await new Promise((resolve) => setTimeout(resolve, 3500));

    processBattleActions(playerAction, botChoice);
    await new Promise((resolve) => setTimeout(resolve, 3500));

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
          updateDefendButtonState(); // update defend button state after each turn
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
        message =
          "Vous vous défendez, l'adversaire lance une attaque spéciale !";
      } else if (playerAction === "special" && botAction === "attack") {
        message =
          "Vous lancez une attaque spéciale, l'adversaire attaque normalement !";
      } else if (playerAction === "attack" && botAction === "special") {
        message =
          "Vous attaquez normalement, l'adversaire lance une attaque spéciale !";
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
