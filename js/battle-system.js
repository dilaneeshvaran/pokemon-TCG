document.addEventListener("DOMContentLoaded", () => {
  const battleBtn = document.getElementById("battleBtn");
  const exitBattleBtn = document.getElementById("exitBattleBtn");

  if (battleBtn) {
    battleBtn.addEventListener("click", () => {
      const handCards = JSON.parse(localStorage.getItem("handCards")) || [];

      if (handCards.length > 0) {
        localStorage.setItem(
          "playerActivePokemonCard",
          JSON.stringify(handCards[0])
        );
        handCards.shift();
        localStorage.setItem("battleCards", JSON.stringify(handCards));
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
