const playerSelectedAction = document.getElementById("playerSelectedAction");
const botSelectedAction = document.getElementById("botSelectedAction");

export function displayPlayerAction(action) {
  if (playerSelectedAction) {
    playerSelectedAction.innerHTML = createActionBadge(action);
    playerSelectedAction.className = "player-selected-action";
  }
}

export function displayBotAction(action) {
  if (botSelectedAction) {
    botSelectedAction.innerHTML = createActionBadge(action);
    botSelectedAction.className = "bot-selected-action";
  }
}

function createActionBadge(action) {
  const icon = action === "attack" ? "⚔️" : "🛡️";
  const text = action === "attack" ? "Attaque" : "Défense";
  return `<div class="action-badge ${action}-badge">
              <span class="action-icon">${icon}</span>
              <span class="action-text">${text}</span>
            </div>`;
}
