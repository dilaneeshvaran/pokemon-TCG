export function generateCardHTML(
  pokemon,
  isEliminated = false,
  isActive = false,
  typeAdvantage = ""
) {
  const imageClass = isActive ? "battlePokemonImage" : "";

  if (isEliminated) {
    return `
      <div class="eliminated-overlay">KO</div>
      <img src="${pokemon.image}" alt="${pokemon.name}" ${
      imageClass ? `class="${imageClass}"` : ""
    }>
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
        <div class="stats">
          <div class="stat hp">PV: 0</div>
          <div class="stat attack">ATQ: ${pokemon.attack}</div>
          <div class="stat defense">DEF: ${pokemon.defense}</div>
        </div>
      </div>
    `;
  } else {
    return `
      <img src="${pokemon.image}" alt="${pokemon.name}" ${
      imageClass ? `class="${imageClass}"` : ""
    }>
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
        <div class="stats">
          <div class="stat hp">PV: ${pokemon.hp}</div>
          <div class="stat attack">ATQ: ${pokemon.attack}${typeAdvantage}</div>
          <div class="stat defense">DEF: ${pokemon.defense}</div>
        </div>
      </div>
    `;
  }
}
