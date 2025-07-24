import { generateCardHTML } from "./helper/generateCardHTML.js";
import { selectNewActivePokemon } from "./select-new-active-card.js";
import { rateTheOpponent } from "./rate-battle-opponent.js";

export function checkForEliminations() {
  const battleLog = document.getElementById("battleLog");

  const playerActivePokemonCard = JSON.parse(
    localStorage.getItem("playerActivePokemonCard")
  );
  const botActivePokemonCard = JSON.parse(
    localStorage.getItem("botActivePokemonCard")
  );

  if (
    playerActivePokemonCard &&
    botActivePokemonCard &&
    playerActivePokemonCard.hp <= 0 &&
    botActivePokemonCard.hp <= 0
  ) {
    lastCardsEliminationCheck(
      playerActivePokemonCard,
      botActivePokemonCard,
      battleLog
    );
    return;
  }

  if (playerActivePokemonCard && playerActivePokemonCard.hp <= 0) {
    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Votre ${playerActivePokemonCard.name} est K.O. !</div>`;
    }
    // add attack special after defeat player
    const botSpecialAttacks = parseInt(
      localStorage.getItem("botSpecialAttacks") || "0"
    );
    localStorage.setItem(
      "botSpecialAttacks",
      (botSpecialAttacks + 1).toString()
    );

    eliminateActivePokemon("player");
    selectNewActivePokemon("player");
  }

  if (botActivePokemonCard && botActivePokemonCard.hp <= 0) {
    if (battleLog) {
      battleLog.innerHTML = `<div class="battle-log-message">Le ${botActivePokemonCard.name} adversaire est K.O. !</div>`;
    }
    // increment player special attack after defeat enemy
    const playerSpecialAttacks = parseInt(
      localStorage.getItem("playerSpecialAttacks") || "0"
    );
    localStorage.setItem(
      "playerSpecialAttacks",
      (playerSpecialAttacks + 1).toString()
    );

    // update the special attack button state
    const updateSpecialAttackButtonState =
      window.updateSpecialAttackButtonState;
    if (updateSpecialAttackButtonState) {
      setTimeout(() => updateSpecialAttackButtonState(), 100);
    }

    eliminateActivePokemon("bot");
    selectNewActivePokemon("bot");
  }
}

function lastCardsEliminationCheck(
  playerActivePokemonCard,
  botActivePokemonCard,
  battleLog
) {
  if (
    playerActivePokemonCard &&
    playerActivePokemonCard.hp <= 0 &&
    botActivePokemonCard &&
    botActivePokemonCard.hp <= 0
  ) {
    // both pokemon eliminated = still increment special attack counters
    const playerSpecialAttacks = parseInt(
      localStorage.getItem("playerSpecialAttacks") || "0"
    );
    const botSpecialAttacks = parseInt(
      localStorage.getItem("botSpecialAttacks") || "0"
    );
    localStorage.setItem(
      "playerSpecialAttacks",
      (playerSpecialAttacks + 1).toString()
    );
    localStorage.setItem(
      "botSpecialAttacks",
      (botSpecialAttacks + 1).toString()
    );

    const playerHand = (
      JSON.parse(localStorage.getItem("battleHandCards")) || []
    ).filter((c) => !c.eliminated);
    const botHand = (
      JSON.parse(localStorage.getItem("battleBotCards")) || []
    ).filter((c) => !c.eliminated);

    if (playerHand.length === 0 && botHand.length === 0) {
      if (playerActivePokemonCard.attack > botActivePokemonCard.attack) {
        declareWinner("player");
      } else if (playerActivePokemonCard.attack < botActivePokemonCard.attack) {
        declareWinner("bot");
      } else {
        // draw = hide battle actions and counters
        const battleActions = document.querySelector(".battle-actions");
        const potionCounter = document.getElementById("potionCounter");
        const reviveCounter = document.getElementById("reviveCounter");

        if (battleActions) {
          battleActions.style.display = "none";
        }
        // hide the item counters when battle ends in draw
        if (potionCounter) {
          potionCounter.style.display = "none";
        }
        if (reviveCounter) {
          reviveCounter.style.display = "none";
        }

        localStorage.setItem("battleState", "finished");

        if (battleLog) {
          battleLog.innerHTML = `<div class="battle-log-message">Match nul ! </div>`;
        }
        setTimeout(() => {
          rateTheOpponent();
        }, 5000);
      }
      eliminateActivePokemon("player");
      eliminateActivePokemon("bot");
      return;
    } else {
      if (battleLog) {
        battleLog.innerHTML = `<div class="battle-log-message">Les 2 Pokémons sont en PLS ! </div>`;
      }
      eliminateActivePokemon("player");
      eliminateActivePokemon("bot");
      setTimeout(() => {
        selectNewActivePokemon("player");
        selectNewActivePokemon("bot");
      }, 1000);
    }
  }
}

export function eliminateActivePokemon(side) {
  const activePokemonKey =
    side === "player" ? "playerActivePokemonCard" : "botActivePokemonCard";
  const cardsLocalStorageKey =
    side === "player" ? "battleHandCards" : "battleBotCards";

  const activePokemon = JSON.parse(localStorage.getItem(activePokemonKey));
  const cards = JSON.parse(localStorage.getItem(cardsLocalStorageKey)) || [];

  if (!activePokemon) return;

  activePokemon.eliminated = true;
  activePokemon.hp = 0;
  cards.push(activePokemon);

  localStorage.setItem(cardsLocalStorageKey, JSON.stringify(cards));

  localStorage.removeItem(activePokemonKey);

  if (localStorage.getItem("battleState") !== "finished") {
    const activePokemonContainer = document.getElementById(
      side === "player" ? "playerActivePokemon" : "botActivePokemon"
    );
    if (activePokemonContainer) {
      activePokemonContainer.innerHTML = "";
    }
  }

  if (side === "player") {
    const playerCardsContainer = document.getElementById("playerCards");
    if (playerCardsContainer) {
      const card = addEliminatedCardToHand(activePokemon);
      playerCardsContainer.appendChild(card);
    }
  } else {
    const botCardsContainer = document.getElementById("botCards");
    if (botCardsContainer) {
      const card = addEliminatedCardToHand(activePokemon);
      botCardsContainer.appendChild(card);
    }
  }
}

function addEliminatedCardToHand(pokemon) {
  const card = document.createElement("div");
  card.className = `pokemon-card eliminated-card type-${pokemon.type}`;
  card.dataset.pokemonId = pokemon.id;
  card.id = `pokemon-card-${pokemon.id}`;

  card.innerHTML = generateCardHTML(pokemon, true);

  return card;
}

export function declareWinner(winner) {
  const battleLog = document.getElementById("battleLog");
  const battleActions = document.querySelector(".battle-actions");
  const potionCounter = document.getElementById("potionCounter");
  const reviveCounter = document.getElementById("reviveCounter");

  if (battleActions) {
    battleActions.style.display = "none";
  }

  // Hide the item counters when battle ends
  if (potionCounter) {
    potionCounter.style.display = "none";
  }
  if (reviveCounter) {
    reviveCounter.style.display = "none";
  }

  localStorage.setItem("battleState", "finished");

  if (battleLog) {
    if (winner === "player") {
      battleLog.innerHTML = `<div class="battle-log-message winner-message">Vous avez gagné le combat!</div>`;
    } else {
      battleLog.innerHTML = `<div class="battle-log-message loser-message">Vous avez perdu le combat!</div>`;
    }
  }
  setTimeout(() => {
    rateTheOpponent();
  }, 5000);
}
