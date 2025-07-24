import { drawPack } from "../pokemon-api.js";
import { selectNewActivePokemon } from "./select-new-active-card.js";
import { showAlertPopup, showConfirmPopup } from "./helper/popup-utilities.js";

document.addEventListener("DOMContentLoaded", () => {
  const battleBtn = document.getElementById("battleBtn");
  const exitBattleBtn = document.getElementById("exitBattleBtn");

  checkAndRestoreBattleState();

  if (battleBtn) {
    battleBtn.addEventListener("click", () => {
      const handCards = JSON.parse(localStorage.getItem("handCards")) || [];

      if (handCards.length === 0) {
        showAlertPopup(
          "Vous devez avoir au moins 1 carte dans votre main pour commencer une bataille."
        );
        return;
      }

      localStorage.removeItem("battleState");

      // reset consecutive defend counter for new battle
      localStorage.setItem("playerConsecutiveDefends", "0");
      localStorage.setItem("botConsecutiveDefends", "0");

      // init special attack counters to 0 at start of battle
      localStorage.setItem("playerSpecialAttacks", "0");
      localStorage.setItem("botSpecialAttacks", "0");

      const botCards = drawPack();

      const randomIndex = Math.floor(Math.random() * botCards.length);
      botCards.splice(randomIndex, 1);

      if (botCards.length > 0) {
        localStorage.setItem(
          "playerActivePokemonCard",
          JSON.stringify(handCards[0])
        );
        localStorage.setItem(
          "botActivePokemonCard",
          JSON.stringify(botCards[0])
        );
        handCards.shift();
        botCards.shift();
        localStorage.setItem("battleHandCards", JSON.stringify(handCards));
        localStorage.setItem("battleBotCards", JSON.stringify(botCards));
      }

      window.location.href = "battle.html";
    });
  }

  if (exitBattleBtn) {
    exitBattleBtn.addEventListener("click", () => {
      showConfirmPopup("Voulez-vous quitter la bataille ?", () => {
        localStorage.removeItem("playerActivePokemonCard");
        localStorage.removeItem("botActivePokemonCard");
        localStorage.removeItem("battleHandCards");
        localStorage.removeItem("battleBotCards");
        localStorage.removeItem("battleState");
        // reset consecutive defend counters
        localStorage.removeItem("playerConsecutiveDefends");
        localStorage.removeItem("botConsecutiveDefends");
        // reset special attack counters
        localStorage.removeItem("playerSpecialAttacks");
        localStorage.removeItem("botSpecialAttacks");
        // reinitialise l'utilisation de la potion et du rappel
        localStorage.removeItem("potionUsedOnce");
        localStorage.removeItem("reviveUsedOnce");
        window.location.href = "index.html";
      });
    });
  }

  function checkAndRestoreBattleState() {
    const battleHandCards = JSON.parse(localStorage.getItem("battleHandCards"));
    const battleBotCards = JSON.parse(localStorage.getItem("battleBotCards"));
    const playerActivePokemonCard = JSON.parse(
      localStorage.getItem("playerActivePokemonCard")
    );
    const botActivePokemonCard = JSON.parse(
      localStorage.getItem("botActivePokemonCard")
    );

    if (battleHandCards && battleBotCards) {
      if (!playerActivePokemonCard && botActivePokemonCard) {
        localStorage.setItem("battleState", "playerSelecting");
        selectNewActivePokemon("player");
      } else if (playerActivePokemonCard && !botActivePokemonCard) {
        localStorage.setItem("battleState", "botSelecting");
        selectNewActivePokemon("bot");
      }
    }
  }
});
