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
    let statusHtml = "";
    if (pokemon.status && pokemon.status !== "none") {
      const statusMap = {
        burn: { icon: "🔥", label: "Brûlure", class: "status-burn" },
        freeze: { icon: "❄️", label: "Gel", class: "status-freeze" },
        poison: { icon: "☠️", label: "Poison", class: "status-poison" },
        paralyze: { icon: "⚡", label: "Paralysie", class: "status-paralyze" },
      };
      const s = statusMap[pokemon.status] || {
        icon: "",
        label: pokemon.status,
        class: "",
      };
      let turns = "";
      if (typeof pokemon.statusTurns === "number" && pokemon.statusTurns > 0) {
        turns = ` <span class="status-turns">(${pokemon.statusTurns})</span>`;
      }
      statusHtml = `<div class="status-indicator ${s.class}">${s.icon} ${s.label}${turns}</div>`;
    }
    return `
      <div class="pokemon-card-main">
        <img src="${pokemon.image}" alt="${pokemon.name}" ${
      imageClass ? `class="${imageClass}"` : ""
    }>
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <div class="card-type">${pokemon.type}</div>
          <div class="stats">
            <div class="stat hp">PV: ${pokemon.hp}</div>
            <div class="stat attack">ATQ: ${
              pokemon.attack
            }${typeAdvantage}</div>
            <div class="stat defense">DEF: ${pokemon.defense}</div>
          </div>
          ${statusHtml}
        </div>
      </div>
    `;
  }
}
