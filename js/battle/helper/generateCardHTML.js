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
    let statusHtml = '';
    if (pokemon.status && pokemon.status !== 'none') {
      const statusMap = {
        burn: { icon: '🔥', label: 'Brûlure', class: 'status-burn' },
        freeze: { icon: '❄️', label: 'Gel', class: 'status-freeze' },
        poison: { icon: '☠️', label: 'Poison', class: 'status-poison' },
        paralyze: { icon: '⚡', label: 'Paralysie', class: 'status-paralyze' }
      };
      const s = statusMap[pokemon.status] || { icon: '', label: pokemon.status, class: '' };
      let turns = '';
      if (typeof pokemon.statusTurns === 'number' && pokemon.statusTurns > 0) {
        turns = ` <span class="status-turns">(${pokemon.statusTurns})</span>`;
      }
      statusHtml = `<div class="status-indicator ${s.class}">${s.icon} ${s.label}${turns}</div>`;
    }
    // Barre de PV avec effet trailing
    let maxHp = pokemon.maxHp || pokemon.hp || 100;
    let percent = Math.max(0, Math.min(100, Math.round((pokemon.hp / maxHp) * 100)));
    let percentPrev = percent;
    if (typeof pokemon.hpPrev === 'number') {
      percentPrev = Math.max(0, Math.min(100, Math.round((pokemon.hpPrev / maxHp) * 100)));
    }
    let hpBarClass = 'hp-bar-inner';
    if (percent < 30) hpBarClass += ' low';
    else if (percent < 60) hpBarClass += ' mid';
    let hpBar = `<div class="hp-bar-outer">
      <div class="hp-bar-ghost" style="width:${percentPrev}%;"></div>
      <div class="${hpBarClass}" style="width:${percent}%;"></div>
    </div>`;
    return `
      <div class="pokemon-card-main">
        ${hpBar}
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
          ${statusHtml}
        </div>
      </div>
    `;
  }
}
