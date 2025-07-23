import { getTypeAdvantageString } from "./card-type-advantage.js";
import { generateCardHTML } from "./helper/generateCardHTML.js";

export function updatePokemonHP(updatingCard) {
  if (updatingCard && updatingCard == "player") {
    const playerActivePokemon = document.getElementById("playerActivePokemon");
    if (playerActivePokemon) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      if (playerActivePokemonCard) {
        const typeAdvantageString = getTypeAdvantageString(
          playerActivePokemonCard.type,
          JSON.parse(localStorage.getItem("botActivePokemonCard"))?.type || ""
        );
        // Ajout : effet trailing barre de vie
        let hpPrev = playerActivePokemonCard.hpPrev;
        if (typeof hpPrev !== 'number') {
          hpPrev = playerActivePokemonCard.hp;
        }
        // On stocke la valeur précédente avant de la mettre à jour
        const prevHp = playerActivePokemonCard.hp;
        setTimeout(() => {
          playerActivePokemonCard.hpPrev = prevHp;
          localStorage.setItem("playerActivePokemonCard", JSON.stringify(playerActivePokemonCard));
        }, 0);
        // Barre de vie animée :
        // 1. Affiche la barre principale à la nouvelle valeur, la barre fantôme à l'ancienne
        // 2. Après un court délai, fait descendre la barre fantôme à la nouvelle valeur
        playerActivePokemon.innerHTML = `
          <div class=\"pokemon-card type-${playerActivePokemonCard.type}\">${generateCardHTML({...playerActivePokemonCard, hpPrev}, false, true, typeAdvantageString)}</div>
        `;
        const card = playerActivePokemon.querySelector(".pokemon-card");
        if (card) {
          card.classList.add("hp-updated");
          setTimeout(() => card.classList.remove("hp-updated"), 1000);
        }
        // Anime la barre fantôme
        setTimeout(() => {
          const ghost = playerActivePokemon.querySelector('.hp-bar-ghost');
          if (ghost) ghost.style.width = Math.max(0, Math.min(100, Math.round((playerActivePokemonCard.hp / (playerActivePokemonCard.maxHp || playerActivePokemonCard.hp || 100)) * 100))) + '%';
        }, 80);
      }
    }
  }
  if (updatingCard && updatingCard == "bot") {
    const botActivePokemon = document.getElementById("botActivePokemon");
    if (botActivePokemon) {
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      if (botActivePokemonCard) {
        const typeAdvantageString = getTypeAdvantageString(
          botActivePokemonCard.type,
          JSON.parse(localStorage.getItem("playerActivePokemonCard"))?.type || ""
        );
        // Ajout : effet trailing barre de vie
        let hpPrev = botActivePokemonCard.hpPrev;
        if (typeof hpPrev !== 'number') {
          hpPrev = botActivePokemonCard.hp;
        }
        const prevHp = botActivePokemonCard.hp;
        setTimeout(() => {
          botActivePokemonCard.hpPrev = prevHp;
          localStorage.setItem("botActivePokemonCard", JSON.stringify(botActivePokemonCard));
        }, 0);
        botActivePokemon.innerHTML = `
          <div class=\"pokemon-card type-${botActivePokemonCard.type}\">${generateCardHTML({...botActivePokemonCard, hpPrev}, false, true, typeAdvantageString)}</div>
        `;
        const card = botActivePokemon.querySelector(".pokemon-card");
        if (card) {
          card.classList.add("hp-updated");
          setTimeout(() => card.classList.remove("hp-updated"), 1000);
        }
        setTimeout(() => {
          const ghost = botActivePokemon.querySelector('.hp-bar-ghost');
          if (ghost) ghost.style.width = Math.max(0, Math.min(100, Math.round((botActivePokemonCard.hp / (botActivePokemonCard.maxHp || botActivePokemonCard.hp || 100)) * 100))) + '%';
        }, 80);
      }
    }
  }
}

export function updateBotActivePokemon(pokemon) {
  const botActivePokemon = document.getElementById("botActivePokemon");
  if (botActivePokemon) {
    const typeAdvantageString = getTypeAdvantageString(
      pokemon.type,
      JSON.parse(localStorage.getItem("playerActivePokemonCard"))?.type || ""
    );

    botActivePokemon.innerHTML = `
      <div class="pokemon-card type-${pokemon.type}">
        ${generateCardHTML(pokemon, false, true, typeAdvantageString)}
      </div>
    `;

    botActivePokemon
      .querySelector(".pokemon-card")
      .classList.add("card-updated");
    setTimeout(() => {
      const card = botActivePokemon.querySelector(".pokemon-card");
      if (card) card.classList.remove("card-updated");
    }, 1000);
    removeCardFromBotDeck(pokemon.id);
  }
}

export function updatePlayerActivePokemon(pokemon) {
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  if (playerActivePokemon) {
    const typeAdvantageString = getTypeAdvantageString(
      pokemon.type,
      JSON.parse(localStorage.getItem("botActivePokemonCard"))?.type || ""
    );

    playerActivePokemon.innerHTML = `
      <div class="pokemon-card type-${pokemon.type}">
        ${generateCardHTML(pokemon, false, true, typeAdvantageString)}
      </div>
    `;

    playerActivePokemon
      .querySelector(".pokemon-card")
      .classList.add("card-updated");
    setTimeout(() => {
      const card = playerActivePokemon.querySelector(".pokemon-card");
      if (card) card.classList.remove("card-updated");
    }, 1000);
  }
}

export function removeCardFromHand(cardId) {
  const cardElement = document.querySelector(
    `#playerCards .pokemon-card[data-pokemon-id="${cardId}"]`
  );
  if (cardElement) {
    cardElement.remove();
  }
}

export function removeCardFromBotDeck(cardId) {
  const cardElement = document.querySelector(
    `#botCards .pokemon-card[data-pokemon-id="${cardId}"]`
  );
  if (cardElement) {
    cardElement.remove();
  }
}
