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
  if (attackerType === defenderType) {
    return "";
  }

  if (
    typeAdvantages[attackerType] &&
    typeAdvantages[attackerType].includes(defenderType)
  ) {
    return `<span class="bonus-text">+30</span>`;
  }

  return "";
}

export function getTypeAdvantageInt(attackerType, defenderType) {
  if (attackerType === defenderType) {
    return 0;
  }

  if (
    typeAdvantages[attackerType] &&
    typeAdvantages[attackerType].includes(defenderType)
  ) {
    return 30;
  }

  return 0;
}
