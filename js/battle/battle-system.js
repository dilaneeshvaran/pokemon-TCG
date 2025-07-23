import { drawPack } from "../pokemon-api.js";
import { selectNewActivePokemon } from "./select-new-active-card.js";

// Fonction utilitaire pour afficher une popup d'alerte stylisée
function showAlertPopup(message) {
  let popup = document.getElementById("customAlertPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "customAlertPopup";
    popup.className = "popup-overlay alert-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-icon">⚠️</span>
        <div class="alert-message">${message}</div>
        <button class="btn" id="closeCustomAlertBtn">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  } else {
    popup.querySelector(".alert-message").textContent = message;
    popup.classList.remove("hidden");
  }
  popup.classList.remove("hidden");
  popup.querySelector("#closeCustomAlertBtn").onclick = () => {
    popup.classList.add("hidden");
  };
}

// Fonction utilitaire pour afficher une popup de confirmation stylisée
function showConfirmPopup(message, onConfirm) {
  let popup = document.getElementById("customConfirmPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "customConfirmPopup";
    popup.className = "popup-overlay alert-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-icon">❓</span>
        <div class="alert-message">${message}</div>
        <div style="margin-top:18px;display:flex;gap:16px;justify-content:center;">
          <button class="btn" id="confirmYesBtn">Oui</button>
          <button class="btn" id="confirmNoBtn">Non</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  } else {
    popup.querySelector(".alert-message").textContent = message;
    popup.classList.remove("hidden");
  }
  popup.classList.remove("hidden");
  popup.querySelector("#confirmYesBtn").onclick = () => {
    popup.classList.add("hidden");
    if (onConfirm) onConfirm();
  };
  popup.querySelector("#confirmNoBtn").onclick = () => {
    popup.classList.add("hidden");
  };
}

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
        // Reset consecutive defend counters
        localStorage.removeItem("playerConsecutiveDefends");
        localStorage.removeItem("botConsecutiveDefends");
        // Ajout : réinitialise l'utilisation de la potion et du rappel
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
