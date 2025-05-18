const attackBtn = document.getElementById("attackBtn");
const defendBtn = document.getElementById("defendBtn");
const playerSelectedAction = document.getElementById("playerSelectedAction");
const botSelectedAction = document.getElementById("botSelectedAction");

if (attackBtn && defendBtn) {
  attackBtn.addEventListener("click", () => {
    displayPlayerAction("attack");
    const botChoice = Math.random() > 0.5 ? "attack" : "defend";
    displayBotAction(botChoice);
  });

  defendBtn.addEventListener("click", () => {
    displayPlayerAction("defend");
    const botChoice = Math.random() > 0.5 ? "attack" : "defend";
    displayBotAction(botChoice);
  });
}

function displayPlayerAction(action) {
  if (playerSelectedAction) {
    playerSelectedAction.innerHTML = createActionBadge(action);
    playerSelectedAction.className = "player-selected-action";
    playerSelectedAction.classList.add(
      action === "attack" ? "attack-badge" : "defend-badge"
    );
  }
}

function displayBotAction(action) {
  if (botSelectedAction) {
    botSelectedAction.innerHTML = createActionBadge(action);
    botSelectedAction.className = "bot-selected-action";
    botSelectedAction.classList.add(
      action === "attack" ? "attack-badge" : "defend-badge"
    );
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
