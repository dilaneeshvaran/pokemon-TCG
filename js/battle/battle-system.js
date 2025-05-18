import { drawPack } from "../pokemon-api.js";
import { selectNewActivePokemon } from "./select-new-active-card.js";

document.addEventListener("DOMContentLoaded", () => {
  const battleBtn = document.getElementById("battleBtn");
  const exitBattleBtn = document.getElementById("exitBattleBtn");
  checkAndRestoreBattleState();

  if (battleBtn) {
    battleBtn.addEventListener("click", () => {
      localStorage.removeItem("battleState");

      const handCards = JSON.parse(localStorage.getItem("handCards")) || [];
      const botCards = drawPack();

      const randomIndex = Math.floor(Math.random() * botCards.length);
      botCards.splice(randomIndex, 1);

      if (handCards.length > 0 && botCards.length > 0) {
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
      if (confirm("Voulez vous quitter la bataille ?")) {
        localStorage.removeItem("playerActivePokemonCard");
        localStorage.removeItem("botActivePokemonCard");
        localStorage.removeItem("battleHandCards");
        localStorage.removeItem("battleBotCards");
        localStorage.removeItem("battleState");
        window.location.href = "index.html";
      }
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
