export function rateTheOpponent() {
  const attackBtn = document.getElementById("attackBtn");
  const defendBtn = document.getElementById("defendBtn");
  const battleLog = document.getElementById("battleLog");

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
    attackBtn.removeEventListener("click", window.handlePlayerAction);
    attackBtn.addEventListener("click", submitRatingAndReturn);
  }

  if (defendBtn) {
    defendBtn.textContent = "Ignorer et retour à l'accueil";
    defendBtn.removeEventListener("click", window.handlePlayerAction);
    defendBtn.addEventListener("click", ignoreRatingAndReturn);
  }

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

  window.location.href = "index.html";
}
