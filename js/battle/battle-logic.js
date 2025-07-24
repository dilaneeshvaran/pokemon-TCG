import { getTypeAdvantageInt } from "./card-type-advantage.js";
import {
  displayPlayerActionResult,
  displayBotActionResult,
} from "./display-battle-actions.js";
import {
  updatePokemonHP,
  updateBotActivePokemon,
  updatePlayerActivePokemon,
} from "./update-battle-cards.js";
import { checkForEliminations } from "./manage-eliminations.js";

// Ajout : correspondance type -> effet de statut
const typeStatusEffect = {
  fire: "burn",
  ice: "freeze",
  poison: "poison",
  electric: "paralyze",
};

function applyStatusEffect(target, effect) {
  if (!target.status || target.status === "none") {
    target.status = effect;
    target.statusTurns = 2;
  } else if (target.status === effect) {
    // Si le même effet est déjà appliqué, on incrémente la durée (max 4)
    target.statusTurns = Math.min((target.statusTurns || 2) + 1, 4);
  } else {
    // Si un autre effet est déjà là, on le remplace
    target.status = effect;
    target.statusTurns = 2;
  }
}

function processStatusEffects(card, isPlayer, logArr) {
  if (!card.status || card.status === "none") return { canAct: true };
  let canAct = true;
  let statusMsg = "";
  if (card.status === "burn") {
    card.hp -= 20;
    statusMsg =
      (isPlayer ? "Votre" : "Le") + " Pokémon est brûlé et perd 20 PV !";
  } else if (card.status === "poison") {
    card.hp -= 20;
    statusMsg =
      (isPlayer ? "Votre" : "Le") + " Pokémon est empoisonné et perd 20 PV !";
  } else if (card.status === "freeze") {
    card.hp -= 10;
    if (Math.random() < 0.4) {
      canAct = false;
      statusMsg =
        (isPlayer ? "Votre" : "Le") +
        " Pokémon est gelé, ne peut pas attaquer et perd 10 PV !";
    } else {
      statusMsg =
        (isPlayer ? "Votre" : "Le") +
        " Pokémon est gelé mais parvient à attaquer (perd 10 PV) !";
    }
  } else if (card.status === "paralyze" || card.status === "sleep") {
    canAct = false;
    statusMsg =
      (isPlayer ? "Votre" : "Le") +
      " Pokémon est paralysé/endormi et ne peut pas attaquer !";
  }
  if (card.statusTurns !== undefined) {
    card.statusTurns--;
    if (card.statusTurns <= 0) {
      card.status = "none";
      card.statusTurns = 0;
      statusMsg +=
        (statusMsg ? " " : "") +
        ((isPlayer ? "Votre" : "Le") + " Pokémon n'est plus affecté.");
    }
  }
  if (statusMsg) logArr.push(statusMsg);
  return { canAct };
}

export function processBattleActions(playerAction, botAction) {
  const playerActivePokemonCard = JSON.parse(
    localStorage.getItem("playerActivePokemonCard")
  );
  const botActivePokemonCard = JSON.parse(
    localStorage.getItem("botActivePokemonCard")
  );

  // tracking continuous defend actions
  let playerConsecutiveDefends = parseInt(
    localStorage.getItem("playerConsecutiveDefends") || "0"
  );
  let botConsecutiveDefends = parseInt(
    localStorage.getItem("botConsecutiveDefends") || "0"
  );

  // check if defend is allowed (max 2 in a row)
  let playerActionAllowed = playerAction;
  let botActionAllowed = botAction;

  if (playerAction === "defend" && playerConsecutiveDefends >= 2) {
    playerActionAllowed = "attack"; // force attack if blocked 2 times in a row
  }
  if (botAction === "defend" && botConsecutiveDefends >= 2) {
    botActionAllowed = "attack"; // force attack if blocked 2 times in a row
  }

  // update consecutive defend counter
  if (playerActionAllowed === "defend") {
    playerConsecutiveDefends++;
  } else {
    playerConsecutiveDefends = 0;
  }

  if (botActionAllowed === "defend") {
    botConsecutiveDefends++;
  } else {
    botConsecutiveDefends = 0;
  }

  // save updated counters
  localStorage.setItem(
    "playerConsecutiveDefends",
    playerConsecutiveDefends.toString()
  );
  localStorage.setItem(
    "botConsecutiveDefends",
    botConsecutiveDefends.toString()
  );

  //get the type advantage
  const playerTypeBonus = getTypeAdvantageInt(
    playerActivePokemonCard.type,
    botActivePokemonCard.type
  );
  const botTypeBonus = getTypeAdvantageInt(
    botActivePokemonCard.type,
    playerActivePokemonCard.type
  );

  let playerDamageTaken = 0;
  let botDamageTaken = 0;
  let battleMessage = "";
  let statusMessages = [];

  // add messages for forced actions bcoz of consecutive defends
  if (playerAction === "defend" && playerActionAllowed === "attack") {
    statusMessages.push(
      "Vous ne pouvez plus vous défendre après 2 tours consécutifs ! Action forcée : Attaque"
    );
  }

  // Appliquer les effets de statut AVANT les actions
  const playerStatus = processStatusEffects(
    playerActivePokemonCard,
    true,
    statusMessages
  );
  const botStatus = processStatusEffects(
    botActivePokemonCard,
    false,
    statusMessages
  );

  //logic
  // Cas attaque spéciale
  // Si gelé/paralysé et ne peut pas agir, l'action devient "none"
  let playerSpecialFailed = false;
  let botSpecialFailed = false;
  if (playerStatus.canAct && playerActionAllowed === "special") {
    if (Math.random() < 0.5) {
      playerSpecialFailed = true;
    }
  }
  if (botStatus.canAct && botActionAllowed === "special") {
    if (Math.random() < 0.5) {
      botSpecialFailed = true;
    }
  }
  const playerRealAction = playerStatus.canAct
    ? playerSpecialFailed
      ? "fail_special"
      : playerActionAllowed
    : "none";
  const botRealAction = botStatus.canAct
    ? botSpecialFailed
      ? "fail_special"
      : botActionAllowed
    : "none";

  if (playerRealAction === "fail_special" && botRealAction === "fail_special") {
    battleMessage = "Les deux attaques spéciales échouent !";
  } else if (playerRealAction === "fail_special") {
    battleMessage = "Votre attaque spéciale échoue !";
  } else if (botRealAction === "fail_special") {
    battleMessage = "L'attaque spéciale adverse échoue !";
  } else if (playerRealAction === "special" && botRealAction === "special") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Deux attaques spéciales ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerRealAction === "special" && botRealAction === "defend") {
    let attackPower = playerActivePokemonCard.attack + playerTypeBonus;
    let remainingDamage = Math.max(
      0,
      attackPower - botActivePokemonCard.defense
    );
    botDamageTaken = remainingDamage;
    botActivePokemonCard.hp -= botDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `Votre attaque spéciale a percé la défense et infligé ${botDamageTaken} dégâts !`;
    } else {
      battleMessage = "L'adversaire a bloqué votre attaque spéciale !";
    }
  } else if (playerRealAction === "defend" && botRealAction === "special") {
    let attackPower = botActivePokemonCard.attack + botTypeBonus;
    let remainingDamage = Math.max(
      0,
      attackPower - playerActivePokemonCard.defense
    );
    playerDamageTaken = remainingDamage;
    playerActivePokemonCard.hp -= playerDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `L'attaque spéciale adverse a percé votre défense et vous a infligé ${playerDamageTaken} dégâts !`;
    } else {
      battleMessage = "Vous avez bloqué l'attaque spéciale de l'adversaire !";
    }
  } else if (playerRealAction === "special" && botRealAction === "attack") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Vous utilisez une attaque spéciale ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerRealAction === "attack" && botRealAction === "special") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `L'adversaire utilise une attaque spéciale ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerRealAction === "attack" && botRealAction === "attack") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Vous avez infligé ${botDamageTaken} dégâts et subi ${playerDamageTaken} dégâts!`;
  } else if (playerRealAction === "attack" && botRealAction === "defend") {
    let attackPower = playerActivePokemonCard.attack + playerTypeBonus;
    let remainingDamage = Math.max(
      0,
      attackPower - botActivePokemonCard.defense
    );
    botDamageTaken = remainingDamage;
    botActivePokemonCard.hp -= botDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `Votre attaque a percé la défense et infligé ${botDamageTaken} dégâts!`;
    } else {
      battleMessage = "L'adversaire a bloqué votre attaque!";
    }
  } else if (playerRealAction === "defend" && botRealAction === "attack") {
    let attackPower = botActivePokemonCard.attack + botTypeBonus;
    let remainingDamage = Math.max(
      0,
      attackPower - playerActivePokemonCard.defense
    );
    playerDamageTaken = remainingDamage;
    playerActivePokemonCard.hp -= playerDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `L'attaque adverse a percé votre défense et vous a infligé ${playerDamageTaken} dégâts!`;
    } else {
      battleMessage = "Vous avez bloqué l'attaque de l'adversaire!";
    }
  } else if (playerRealAction === "none" && botRealAction === "none") {
    battleMessage = "Aucun des deux Pokémon n'a pu agir ce tour !";
  } else if (playerRealAction === "none") {
    battleMessage = "Votre Pokémon n'a pas pu agir ce tour !";
  } else if (botRealAction === "none") {
    battleMessage = "Le Pokémon adverse n'a pas pu agir ce tour !";
  } else {
    battleMessage = "Les deux joueurs se défendent. Rien ne se passe!";
  }

  // Application des effets de statut lors d'une attaque spéciale
  if (playerRealAction === "special" && !playerSpecialFailed) {
    const effect = typeStatusEffect[playerActivePokemonCard.type];
    if (effect && Math.random() < 0.8) {
      applyStatusEffect(botActivePokemonCard, effect);
      statusMessages.push(
        `Votre attaque spéciale inflige l'effet ${
          effect === "burn"
            ? "brûlure"
            : effect === "freeze"
            ? "gel"
            : effect === "poison"
            ? "empoisonnement"
            : effect === "paralyze"
            ? "paralysie"
            : effect
        } !`
      );
      // MAJ visuelle immédiate
      updateBotActivePokemon(botActivePokemonCard);
    }
  }
  if (botRealAction === "special" && !botSpecialFailed) {
    const effect = typeStatusEffect[botActivePokemonCard.type];
    if (effect && Math.random() < 0.8) {
      applyStatusEffect(playerActivePokemonCard, effect);
      statusMessages.push(
        `L'attaque spéciale adverse inflige l'effet ${
          effect === "burn"
            ? "brûlure"
            : effect === "freeze"
            ? "gel"
            : effect === "poison"
            ? "empoisonnement"
            : effect === "paralyze"
            ? "paralysie"
            : effect
        } !`
      );
      // MAJ visuelle immédiate
      updatePlayerActivePokemon(playerActivePokemonCard);
    }
  }

  if (playerActivePokemonCard.hp < 0) playerActivePokemonCard.hp = 0;
  if (botActivePokemonCard.hp < 0) botActivePokemonCard.hp = 0;

  //enregistrer les nouveau stats de la carte
  localStorage.setItem(
    "playerActivePokemonCard",
    JSON.stringify(playerActivePokemonCard)
  );
  localStorage.setItem(
    "botActivePokemonCard",
    JSON.stringify(botActivePokemonCard)
  );

  //affiche les resultats
  const battleLog = document.getElementById("battleLog");

  if (battleLog) {
    let logHtml = `<div class="battle-log-message">${battleMessage}</div>`;
    if (statusMessages.length > 0) {
      logHtml += statusMessages
        .map(
          (msg) => `<div class='battle-log-message status-message'>${msg}</div>`
        )
        .join("");
    }
    battleLog.innerHTML = logHtml;
  }

  setTimeout(() => {
    if (playerDamageTaken > 0) {
      updatePokemonHP("player");
      displayPlayerActionResult(`-${playerDamageTaken} PV`);
    } else if (botDamageTaken === 0 && botAction === "attack") {
      displayPlayerActionResult("Bloqué!");
    }

    if (botDamageTaken > 0) {
      updatePokemonHP("bot");
      displayBotActionResult(`-${botDamageTaken} PV`);
    } else if (playerDamageTaken === 0 && playerAction === "attack") {
      displayBotActionResult("Bloqué!");
    }
  }, 1000);

  setTimeout(() => {
    checkForEliminations();
  }, 2000);
}
