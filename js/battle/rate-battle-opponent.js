export function rateTheOpponent() {
  const attackBtn = document.getElementById("attackBtn");
  const defendBtn = document.getElementById("defendBtn");
  const specialBtn = document.getElementById("specialAttackBtn");
  const potionBtn = document.getElementById("potionBtn");
  const reviveBtn = document.getElementById("reviveBtn");
  const potionCounter = document.getElementById("potionCounter");
  const reviveCounter = document.getElementById("reviveCounter");
  const battleLog = document.getElementById("battleLog");
  const battleActions = document.querySelector(".battle-actions");

  if (battleLog) {
    battleLog.innerHTML = `
      <div class="rating-system">
        <h3 class="rating-title">Laissez une note à l'adversaire</h3>
        <div class="stars-container">
          <span class="star" data-value="1">★</span>
          <span class="star" data-value="2">★</span>
          <span class="star" data-value="3">★</span>
          <span class="star" data-value="4">★</span>
          <span class="star" data-value="5">★</span>
        </div>
      </div>
    `;
  }

  if (attackBtn) {
    attackBtn.textContent = "Valider et retourner à l'accueil";
    attackBtn.classList.add("rating-submit-btn");
    attackBtn.removeEventListener("click", window.handlePlayerAction);
    attackBtn.addEventListener("click", submitRatingAndReturn);
  }

  if (defendBtn) {
    defendBtn.textContent = "Ignorer et retour à l'accueil";
    defendBtn.classList.add("rating-ignore-btn");
    defendBtn.removeEventListener("click", window.handlePlayerAction);
    defendBtn.addEventListener("click", ignoreRatingAndReturn);
  }

  // Hide the special attack, potion, and rappel buttons during rating
  if (specialBtn) {
    specialBtn.style.display = "none";
  }
  if (potionBtn) {
    potionBtn.style.display = "none";
  }
  if (reviveBtn) {
    reviveBtn.style.display = "none";
  }
  // hide special item counters during rating
  if (potionCounter) {
    potionCounter.style.display = "none";
  }
  if (reviveCounter) {
    reviveCounter.style.display = "none";
  }

  battleActions.style.display = "flex";

  initializeRating();
}

function initializeRating() {
  const stars = document.querySelectorAll(".star");

  stars.forEach((star) => {
    star.addEventListener("click", function () {
      const value = this.getAttribute("data-value");

      stars.forEach((s) => s.classList.remove("selected"));

      stars.forEach((s) => {
        if (s.getAttribute("data-value") <= value) {
          s.classList.add("selected");
        }
      });
    });
  });
}

function submitRatingAndReturn() {
  /*   const stars = document.querySelectorAll(".star.selected");
  const rating = stars.length;
  console.log(`Vous avez noté: ${rating} étoiles`); */

  resetBattleStateAndRedirect();
}

function ignoreRatingAndReturn() {
  resetBattleStateAndRedirect();
}

function resetBattleStateAndRedirect() {
  localStorage.removeItem("playerActivePokemonCard");
  localStorage.removeItem("botActivePokemonCard");
  localStorage.removeItem("battleHandCards");
  localStorage.removeItem("battleBotCards");
  localStorage.removeItem("battleState");
  // Ajout : réinitialise l'utilisation de la potion et du rappel
  localStorage.removeItem("potionUsedOnce");
  localStorage.removeItem("reviveUsedOnce");

  window.location.href = "index.html";
}
