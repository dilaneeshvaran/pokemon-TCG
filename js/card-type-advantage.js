const typeAdvantages = {
  water: ["fire", "rock", "ground"],
  fire: ["grass", "ice", "bug", "steel"],
  grass: ["water", "ground", "rock"],
  electric: ["water", "flying"],
  ground: ["electric", "poison", "rock", "fire", "steel"],
  rock: ["fire", "ice", "flying", "bug"],
  psychic: ["fighting", "poison"],
  fighting: ["normal", "rock", "steel", "ice", "dark"],
  ghost: ["psychic", "ghost"],
  dragon: ["dragon"],
  dark: ["psychic", "ghost"],
  steel: ["ice", "rock", "fairy"],
  fairy: ["fighting", "dragon", "dark"],
  poison: ["grass", "fairy"],
  flying: ["grass", "fighting", "bug"],
  bug: ["grass", "psychic", "dark"],
  ice: ["grass", "ground", "flying", "dragon"],
  normal: [],
};

export function getTypeAdvantageString(attackerType, defenderType) {
  const attacker = attackerType.toLowerCase();
  const defender = defenderType.toLowerCase();

  if (attacker === defender) {
    return "";
  }

  if (typeAdvantages[attacker] && typeAdvantages[attacker].includes(defender)) {
    return `<span class="bonus-text">+30</span>`;
  }

  return "";
}

export function getTypeAdvantageInt(attackerType, defenderType) {
  const attacker = attackerType.toLowerCase();
  const defender = defenderType.toLowerCase();

  if (attacker === defender) {
    return 0;
  }

  if (typeAdvantages[attacker] && typeAdvantages[attacker].includes(defender)) {
    return 30;
  }

  return 0;
}
