import { getTypeAdvantageInt } from "./card-type-advantage.js";
import {
  displayPlayerActionResult,
  displayBotActionResult,
} from "./display-battle-actions.js";
import { updatePokemonHP } from "./update-battle-cards.js";
import { checkForEliminations } from "./manage-eliminations.js";

export function processBattleActions(playerAction, botAction) {
  const playerActivePokemonCard = JSON.parse(
    localStorage.getItem("playerActivePokemonCard")
  );
  const botActivePokemonCard = JSON.parse(
    localStorage.getItem("botActivePokemonCard")
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

  //logic
  // Cas attaque spéciale
  if (playerAction === "special" && botAction === "special") {
    playerDamageTaken = Math.round(botActivePokemonCard.attack * 1.5) + botTypeBonus;
    botDamageTaken = Math.round(playerActivePokemonCard.attack * 1.5) + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Deux attaques spéciales ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerAction === "special" && botAction === "defend") {
    let attackPower = Math.round(playerActivePokemonCard.attack * 1.5) + playerTypeBonus;
    let remainingDamage = Math.max(0, attackPower - botActivePokemonCard.defense);
    botDamageTaken = remainingDamage;
    botActivePokemonCard.hp -= botDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `Votre attaque spéciale a percé la défense et infligé ${botDamageTaken} dégâts !`;
    } else {
      battleMessage = "L'adversaire a bloqué votre attaque spéciale !";
    }
  } else if (playerAction === "defend" && botAction === "special") {
    let attackPower = Math.round(botActivePokemonCard.attack * 1.5) + botTypeBonus;
    let remainingDamage = Math.max(0, attackPower - playerActivePokemonCard.defense);
    playerDamageTaken = remainingDamage;
    playerActivePokemonCard.hp -= playerDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `L'attaque spéciale adverse a percé votre défense et vous a infligé ${playerDamageTaken} dégâts !`;
    } else {
      battleMessage = "Vous avez bloqué l'attaque spéciale de l'adversaire !";
    }
  } else if (playerAction === "special" && botAction === "attack") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = Math.round(playerActivePokemonCard.attack * 1.5) + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Vous utilisez une attaque spéciale ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerAction === "attack" && botAction === "special") {
    playerDamageTaken = Math.round(botActivePokemonCard.attack * 1.5) + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `L'adversaire utilise une attaque spéciale ! Vous infligez ${botDamageTaken} dégâts et subissez ${playerDamageTaken} dégâts !`;
  } else if (playerAction === "attack" && botAction === "attack") {
    playerDamageTaken = botActivePokemonCard.attack + botTypeBonus;
    botDamageTaken = playerActivePokemonCard.attack + playerTypeBonus;
    playerActivePokemonCard.hp -= playerDamageTaken;
    botActivePokemonCard.hp -= botDamageTaken;
    battleMessage = `Vous avez infligé ${botDamageTaken} dégâts et subi ${playerDamageTaken} dégâts!`;
  } else if (playerAction === "attack" && botAction === "defend") {
    let attackPower = playerActivePokemonCard.attack + playerTypeBonus;
    let remainingDamage = Math.max(0, attackPower - botActivePokemonCard.defense);
    botDamageTaken = remainingDamage;
    botActivePokemonCard.hp -= botDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `Votre attaque a percé la défense et infligé ${botDamageTaken} dégâts!`;
    } else {
      battleMessage = "L'adversaire a bloqué votre attaque!";
    }
  } else if (playerAction === "defend" && botAction === "attack") {
    let attackPower = botActivePokemonCard.attack + botTypeBonus;
    let remainingDamage = Math.max(0, attackPower - playerActivePokemonCard.defense);
    playerDamageTaken = remainingDamage;
    playerActivePokemonCard.hp -= playerDamageTaken;
    if (remainingDamage > 0) {
      battleMessage = `L'attaque adverse a percé votre défense et vous a infligé ${playerDamageTaken} dégâts!`;
    } else {
      battleMessage = "Vous avez bloqué l'attaque de l'adversaire!";
    }
  } else {
    battleMessage = "Les deux joueurs se défendent. Rien ne se passe!";
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
    battleLog.innerHTML = `<div class="battle-log-message">${battleMessage}</div>`;
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
