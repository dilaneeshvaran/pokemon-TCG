import { drawPack } from "./pokemon-api.js";

document.addEventListener("DOMContentLoaded", () => {
  const battleBtn = document.getElementById("battleBtn");
  const exitBattleBtn = document.getElementById("exitBattleBtn");

  if (battleBtn) {
    battleBtn.addEventListener("click", () => {
      const handCards = JSON.parse(localStorage.getItem("handCards")) || [];
      const botCards = drawPack();

      const randomIndex = Math.floor(Math.random() * botCards.length);
      botCards.splice(randomIndex, 1);

      if (handCards.length > 0 && botCards.length > 0) {
        localStorage.setItem(
          "playerActivePokemonCard",
          JSON.stringify(handCards[0])
        );
        localStorage.setItem("botActivePokemon", JSON.stringify(botCards[0]));
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
        window.location.href = "index.html";
      }
    });
  }
});
