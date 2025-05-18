export function updatePokemonHP(updatingCard) {
  if (updatingCard && updatingCard == "player") {
    const playerHP = document.querySelector("#playerActivePokemon .hp");
    if (playerHP) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      if (playerActivePokemonCard) {
        playerHP.innerHTML = `PV: ${playerActivePokemonCard.hp}`;
        playerHP.classList.add("hp-updated");
        setTimeout(() => playerHP.classList.remove("hp-updated"), 1000);
      }
    }
  }
  if (updatingCard && updatingCard == "bot") {
    const botHP = document.querySelector("#botActivePokemon .hp");
    if (botHP) {
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      if (botActivePokemonCard) {
        botHP.innerHTML = `PV: ${botActivePokemonCard.hp}`;
        botHP.classList.add("hp-updated");
        setTimeout(() => botHP.classList.remove("hp-updated"), 1000);
      }
    }
  }
}
