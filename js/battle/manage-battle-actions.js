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
    // insert the special items buttons into the main actions div (battle actions)
    const mainActions = document.querySelector(".main-actions");
    if (mainActions && defendBtn) {
      mainActions.insertBefore(specialBtn, defendBtn);
    }
  }
  const potionBtn = document.getElementById("potionBtn");
  const reviveBtn = document.getElementById("reviveBtn");
  const potionCounter = document.getElementById("potionCounter");
  const reviveCounter = document.getElementById("reviveCounter");

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

  // update item counters display
  function updateItemCounters() {
    const potionUsedOnce = localStorage.getItem("potionUsedOnce") === "1";
    const reviveUsedOnce = localStorage.getItem("reviveUsedOnce") === "1";

    if (potionCounter) {
      potionCounter.textContent = potionUsedOnce ? "0" : "1";
      if (potionUsedOnce) {
        potionCounter.classList.add("used");
      } else {
        potionCounter.classList.remove("used");
      }
    }

    if (reviveCounter) {
      reviveCounter.textContent = reviveUsedOnce ? "0" : "1";
      if (reviveUsedOnce) {
        reviveCounter.classList.add("used");
      } else {
        reviveCounter.classList.remove("used");
      }
    }
  }

  // update special attack button state based on available special attacks
  function updateSpecialAttackButtonState() {
    const playerSpecialAttacks = parseInt(
      localStorage.getItem("playerSpecialAttacks") || "0"
    );
    if (specialBtn) {
      if (playerSpecialAttacks <= 0) {
        specialBtn.disabled = true;
        specialBtn.classList.add("special-disabled");
        specialBtn.textContent = `Attaque spéciale (0)`;
        specialBtn.title =
          "Vous devez éliminer un Pokémon adverse pour obtenir une attaque spéciale";
      } else {
        specialBtn.disabled = false;
        specialBtn.classList.remove("special-disabled");
        specialBtn.textContent = `Attaque spéciale (${playerSpecialAttacks})`;
        specialBtn.title = "";
      }
    }
  }

  // Make the function globally accessible
  window.updateDefendButtonState = updateDefendButtonState;
  window.updateSpecialAttackButtonState = updateSpecialAttackButtonState;
  window.updateItemCounters = updateItemCounters;

  // Call this function initially and after each battle turn
  updateDefendButtonState();
  updateSpecialAttackButtonState();
  updateItemCounters();

  // process selected battle actions
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
        updateItemCounters(); // Update counter display
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
        updateItemCounters(); // Update counter display
        // Declenche un évenement custom pour forcer l'affichage des cartes ko cliquables
        window.dispatchEvent(new Event("reviveModeActivated"));
      });
    }
  }

  //exporter pour l'acces global pour le bot
  window.handlePlayerAction = handlePlayerAction;
  window.getTypeAdvantageInt = getTypeAdvantageInt;

  async function handlePlayerAction(playerAction) {
    //check if defend is allowed
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

    // Check if special attack is available
    if (playerAction === "special") {
      const playerSpecialAttacks = parseInt(
        localStorage.getItem("playerSpecialAttacks") || "0"
      );
      if (playerSpecialAttacks <= 0) {
        alert(
          "Vous devez éliminer un Pokémon adverse pour obtenir une attaque spéciale !"
        );
        return;
      }
      // Decrement the special attack counter
      localStorage.setItem(
        "playerSpecialAttacks",
        (playerSpecialAttacks - 1).toString()
      );
      updateSpecialAttackButtonState();
    }

    if (battleActions) {
      battleActions.style.display = "none";
    }

    displayPlayerAction(playerAction);
    updateBattleLog(MESSAGES.OPPONENT_TURN);

    const delayInSeconds = Math.floor(Math.random() * 3) + 2;
    await new Promise((resolve) => setTimeout(resolve, delayInSeconds * 1000));

    // Le bot peut aussi choisir l'attaque speciale - bot intelligent
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
      const botSpecialAttacks = parseInt(
        localStorage.getItem("botSpecialAttacks") || "0"
      );

      // si pv bot < 40%, priviléger defense (sauf si limite atteinte)
      if (
        botActivePokemonCard.hp / (botActivePokemonCard.maxHp || 100) < 0.4 &&
        botConsecutiveDefends < 2
      ) {
        botChoice = Math.random() < 0.7 ? "defend" : "attack";
      } else if (botSpecialAttacks > 0) {
        // Si le bot a des attaques spéciales disponibles, il peut les utiliser
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
        // Decrement bots special attack counter when using special attack
        if (botChoice === "special") {
          localStorage.setItem(
            "botSpecialAttacks",
            (botSpecialAttacks - 1).toString()
          );
        }
      } else {
        // si pas d'attaque speciale disponible, choix entre attaque et defense
        botChoice = Math.random() < 0.6 ? "attack" : "defend";
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
          updateSpecialAttackButtonState(); // update special attack button state after each turn
          updateItemCounters(); // update item counters after each turn
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
