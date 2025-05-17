document.addEventListener("DOMContentLoaded", () => {
  const playerCards = document.getElementById("playerCards");
  const playerActivePokemon = document.getElementById("playerActivePokemon");
  const botCards = document.getElementById("botCards");
  const botActivePokemon = document.getElementById("botActivePokemon");

  if (playerCards) {
    const battleHandCards =
      JSON.parse(localStorage.getItem("battleHandCards")) || [];
    playerCards.innerHTML = "";

    battleHandCards.forEach((pokemon) => {
      if (!pokemon.name) return;

      const card = document.createElement("div");
      card.className = `pokemon-card type-${pokemon.type}`;
      card.dataset.pokemonId = pokemon.id;
      card.id = `pokemon-card-${pokemon.id}`;

      card.innerHTML = `
        <img src="${pokemon.image}" alt="${pokemon.name}">
        <div class="card-body">
          <h5 class="card-title">${pokemon.name}</h5>
          <div class="card-type">${pokemon.type}</div>
          <div class="stats">
                <div class="stat hp">PV: ${pokemon.hp}</div>
                <div class="stat attack">ATQ: ${pokemon.attack}</div>
                <div class="stat defense">DEF: ${pokemon.defense}</div>
              </div>
        </div>
        `;
      playerCards.appendChild(card);
    });
    displayActivePokemon();
  }

  function displayActivePokemon() {
    if (playerActivePokemon) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );

      if (playerActivePokemonCard) {
        playerActivePokemon.innerHTML = `
        <div class="pokemon-card type-${playerActivePokemonCard.type}">
            <img src="${playerActivePokemonCard.image}" alt="${playerActivePokemonCard.name}" class="battlePokemonImage">
            <div class="card-body">
              <h5 class="card-title">${playerActivePokemonCard.name}</h5>
              <div class="card-type">${playerActivePokemonCard.type}</div>
              
              <div class="stats">
                <div class="hp">PV: ${playerActivePokemonCard.hp}</div>
                <div class="attack">ATQ: ${playerActivePokemonCard.attack}</div>
                <div class="defense">DEF: ${playerActivePokemonCard.defense}</div>
              </div>
            </div>
          </div>
        `;
      }
    }
  }
});
