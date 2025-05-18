import { getTypeAdvantageString } from "./card-type-advantage.js";

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
    displayActivePokemonPlayer();
  }

  function displayActivePokemonPlayer() {
    if (playerActivePokemon) {
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );

      if (playerActivePokemonCard && botActivePokemonCard) {
        const typeAdvantage = getTypeAdvantageString(
          playerActivePokemonCard.type,
          botActivePokemonCard.type
        );

        playerActivePokemon.innerHTML = `
        <div class="pokemon-card type-${playerActivePokemonCard.type}">
            <img src="${playerActivePokemonCard.image}" alt="${playerActivePokemonCard.name}" class="battlePokemonImage">
            <div class="card-body">
              <h5 class="card-title">${playerActivePokemonCard.name}</h5>
              <div class="card-type">${playerActivePokemonCard.type}</div>
              
              <div class="stats">
                <div class="hp">PV: ${playerActivePokemonCard.hp}</div>
                <div class="attack">ATQ: ${playerActivePokemonCard.attack} ${typeAdvantage}</div>
                <div class="defense">DEF: ${playerActivePokemonCard.defense}</div>
              </div>
            </div>
          </div>
        `;
      }
    }
  }

  if (botCards) {
    const battleBotCards =
      JSON.parse(localStorage.getItem("battleBotCards")) || [];

    botCards.innerHTML = "";

    battleBotCards.forEach((pokemon) => {
      if (!pokemon.name) return;

      const card = document.createElement("div");
      card.className = `pokemon-card type-${pokemon.type}`;
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
      botCards.appendChild(card);
    });
    displayActivePokemonBot();
  }

  function displayActivePokemonBot() {
    if (botActivePokemon) {
      const botActivePokemonCard = JSON.parse(
        localStorage.getItem("botActivePokemonCard")
      );
      const playerActivePokemonCard = JSON.parse(
        localStorage.getItem("playerActivePokemonCard")
      );

      if (botActivePokemonCard && playerActivePokemonCard) {
        const typeAdvantage = getTypeAdvantageString(
          botActivePokemonCard.type,
          playerActivePokemonCard.type
        );
        botActivePokemon.innerHTML = `
        <div class="pokemon-card type-${botActivePokemonCard.type}">
            <img src="${botActivePokemonCard.image}" alt="${botActivePokemonCard.name}" class="battlePokemonImage">
            <div class="card-body">
              <h5 class="card-title">${botActivePokemonCard.name}</h5>
              <div class="card-type">${botActivePokemonCard.type}</div>
              
              <div class="stats">
                <div class="hp">PV: ${botActivePokemonCard.hp}</div>
                <div class="attack">ATQ: ${botActivePokemonCard.attack}  ${typeAdvantage}</div>
                <div class="defense">DEF: ${botActivePokemonCard.defense}</div>
              </div>
            </div>
          </div>
        `;
      }
    }
  }
});
