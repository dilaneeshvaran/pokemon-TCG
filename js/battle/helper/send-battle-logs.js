export function updateBattleLog(message) {
  const battleLog = document.getElementById("battleLog");
  if (battleLog) {
    battleLog.innerHTML = `<div class="battle-log-message">${message}</div>`;
  }
}
export const MESSAGES = {
  YOUR_TURN: "Votre tour !",
  CHOOSE_POKEMON: "Choisissez une nouvelle carte Pokémon!",
  OPPONENT_TURN: "Tour de l'adversaire...",
};
