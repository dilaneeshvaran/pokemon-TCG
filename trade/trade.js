function displayHandCards(selectedId = null) {
  const handContainer = document.getElementById("handContainer");
  let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
  handContainer.innerHTML = "";
  if (!handCards.length) {
    handContainer.innerHTML = "<p>Votre main est vide.</p>";
    return;
  }
  handCards.forEach((pokemon) => {
    if (!pokemon.name) return;
    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.type}`;
    card.dataset.pokemonId = pokemon.id;
    if (selectedId && pokemon.id == selectedId) {
      card.style.outline = '3px solid #1e90ff';
      card.style.boxShadow = '0 0 0 4px #4fc3f7';
    }
    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
      </div>
    `;
    handContainer.appendChild(card);
  });
}

function displayBotHandCards(selectedId = null) {
  const botHandContainer = document.getElementById("botHandContainer");
  let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
  botHandContainer.innerHTML = "";
  if (!botCards.length) {
    botHandContainer.innerHTML = "<p>Le bot n'a pas de cartes.</p>";
    return;
  }
  botCards.forEach((pokemon) => {
    if (!pokemon.name) return;
    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.type}`;
    card.dataset.pokemonId = pokemon.id;
    if (selectedId && pokemon.id == selectedId) {
      card.style.outline = '3px solid #ff5252';
      card.style.boxShadow = '0 0 0 4px #ffbdbd';
    }
    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
      </div>
    `;
    botHandContainer.appendChild(card);
  });
}

function displaySelectedCard(containerId, card) {
  const container = document.getElementById(containerId);
  container.innerHTML = "";
  if (!card) return;
  const cardDiv = document.createElement("div");
  cardDiv.className = `pokemon-card type-${card.type}`;
  cardDiv.innerHTML = `
    <img src="${card.image}" alt="${card.name}">
    <div class="card-body">
      <h5 class="card-title">${card.name}</h5>
      <div class="card-type">${card.type}</div>
    </div>
  `;
  container.appendChild(cardDiv);
}

function resetExchangeSelection() {
  displaySelectedCard('playerSelectedCard', null);
  displaySelectedCard('botSelectedCard', null);
  document.getElementById('exchangeActionArea').style.display = 'none';
  displayHandCards();
  displayBotHandCards();
}

let selectedPlayerCard = null;
let selectedBotCard = null;

document.addEventListener("DOMContentLoaded", () => {
  displayHandCards();
  displayBotHandCards();
  resetExchangeSelection();

  document.getElementById("handContainer").addEventListener("click", function(e) {
    const cardElem = e.target.closest(".pokemon-card");
    if (!cardElem) return;
    const cardId = cardElem.dataset.pokemonId;
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
    let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
    const myCard = handCards.find(card => card.id == cardId);
    if (!myCard) return;
    if (!botCards.length) {
      alert("Le bot n'a pas de cartes à échanger !");
      return;
    }
    // Sélectionne la carte du joueur
    selectedPlayerCard = myCard;
    // Le bot choisit une carte au hasard
    const botCardIndex = Math.floor(Math.random() * botCards.length);
    selectedBotCard = botCards[botCardIndex];
    // Affiche les cartes sélectionnées
    displaySelectedCard('playerSelectedCard', selectedPlayerCard);
    displaySelectedCard('botSelectedCard', selectedBotCard);
    // Met en surbrillance les cartes dans les mains
    displayHandCards(selectedPlayerCard.id);
    displayBotHandCards(selectedBotCard.id);
    // Affiche les boutons d'action
    document.getElementById('exchangeActionArea').style.display = '';
  });

  document.getElementById('validateExchangeBtn').addEventListener('click', function() {
    if (!selectedPlayerCard || !selectedBotCard) return;
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
    let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
    // Remplacement dans chaque main
    const myCardIndex = handCards.findIndex(card => card.id == selectedPlayerCard.id);
    const botCardIndex = botCards.findIndex(card => card.id == selectedBotCard.id);
    if (myCardIndex !== -1 && botCardIndex !== -1) {
      handCards.splice(myCardIndex, 1, selectedBotCard);
      botCards.splice(botCardIndex, 1, selectedPlayerCard);
      localStorage.setItem("handCards", JSON.stringify(handCards));
      localStorage.setItem("botCards", JSON.stringify(botCards));
    }
    selectedPlayerCard = null;
    selectedBotCard = null;
    resetExchangeSelection();
    alert("Échange effectué !");
  });

  document.getElementById('cancelExchangeBtn').addEventListener('click', function() {
    selectedPlayerCard = null;
    selectedBotCard = null;
    resetExchangeSelection();
  });
});