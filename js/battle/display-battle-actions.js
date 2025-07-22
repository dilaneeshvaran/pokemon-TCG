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
  let icon = "";
  let text = "";
  let extraClass = "";
  if (action === "attack") {
    icon = "⚔️";
    text = "Attaque";
  } else if (action === "defend") {
    icon = "🛡️";
    text = "Défense";
  } else if (action === "special") {
    icon = "✨";
    text = "Attaque spéciale";
    extraClass = "special-anim";
  }
  return `<div class="action-badge ${action}-badge ${extraClass}">
              <span class="action-icon">${icon}</span>
              <span class="action-text">${text}</span>
            </div>`;
}

export function displayPlayerActionResult(resultText) {
  if (playerSelectedAction) {
    playerSelectedAction.innerHTML = createResultBadge(resultText);
  }
}

export function displayBotActionResult(resultText) {
  if (botSelectedAction) {
    botSelectedAction.innerHTML = createResultBadge(resultText);
  }
}

function createResultBadge(text) {
  let resultBadgeClass = "";
  if (text == "Bloqué!") {
    resultBadgeClass = "blocked";
  } else if (text.toLowerCase().includes("spéciale")) {
    resultBadgeClass = "special-anim";
  } else {
    resultBadgeClass = "damage";
  }
  return `<div class="result-badge ${resultBadgeClass}-badge">
              <span class="action-text">${text}</span>
            </div>`;
}
