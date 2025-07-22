import { drawPack } from "../js/pokemon-api.js";

let selectedPlayerCard = null;
let selectedBotCard = null;

function displayHandCards(selectedId = null) {
  const handContainer = document.getElementById("handContainer");
  const handCards = JSON.parse(localStorage.getItem("handCards")) || [];
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
    card.setAttribute("draggable", true);
    card.setAttribute("data-source", "handContainer");
    // Highlight selected
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
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", pokemon.id);
      e.dataTransfer.setData("source-container", "handContainer");
      card.classList.add("dragging");
      if (e.dataTransfer.setDragImage) {
        e.dataTransfer.setDragImage(card, card.offsetWidth / 2, card.offsetHeight / 2);
      }
    });
    card.addEventListener("dragend", (e) => {
      card.classList.remove("dragging");
      document.getElementById("playerSelectedCard").classList.remove("dragover");
    });
    handContainer.appendChild(card);
  });
}

function displayBotHandCards(selectedId = null) {
  const botHandContainer = document.getElementById("botHandContainer");
  const botCards = JSON.parse(localStorage.getItem("botCards")) || [];
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
  if (!card) {
    if (containerId === "playerSelectedCard") {
      container.innerHTML = '<span style="color:#888;font-size:1em;">Glissez une carte ici pour proposer un échange</span>';
    }
    return;
  }
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

function displayUserCatalog() {
  const catalogContainer = document.getElementById("userCatalogContainer");
  let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
  catalogContainer.innerHTML = "";
  if (!deckCards.length) {
    catalogContainer.innerHTML = "<p>Votre catalogue est vide.</p>";
    return;
  }
  deckCards.forEach((pokemon) => {
    if (!pokemon.name) return;
    const card = document.createElement("div");
    card.className = `pokemon-card type-${pokemon.type}`;
    card.dataset.pokemonId = pokemon.id;
    card.setAttribute("draggable", true);
    card.setAttribute("data-source", "userCatalogContainer");
    card.innerHTML = `
      <img src="${pokemon.image}" alt="${pokemon.name}">
      <div class="card-body">
        <h5 class="card-title">${pokemon.name}</h5>
        <div class="card-type">${pokemon.type}</div>
      </div>
    `;
    card.addEventListener("dragstart", (e) => {
      e.dataTransfer.setData("text/plain", pokemon.id);
      e.dataTransfer.setData("source-container", "userCatalogContainer");
      card.classList.add("dragging");
      if (e.dataTransfer.setDragImage) {
        e.dataTransfer.setDragImage(card, card.offsetWidth / 2, card.offsetHeight / 2);
      }
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      document.getElementById("playerSelectedCard").classList.remove("dragover");
    });
    catalogContainer.appendChild(card);
  });
}

function resetExchangeSelection() {
  selectedPlayerCard = null;
  selectedBotCard = null;
  displaySelectedCard("playerSelectedCard", null);
  displaySelectedCard("botSelectedCard", null);
  document.getElementById("exchangeActionArea").style.display = "none";
  displayHandCards();
  displayBotHandCards();
}

document.addEventListener("DOMContentLoaded", () => {
  let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
  let botCards = JSON.parse(localStorage.getItem("botCards")) || [];

  if (!handCards.length) {
    handCards = drawPack();
    localStorage.setItem("handCards", JSON.stringify(handCards));
  }
  if (!botCards.length) {
    botCards = drawPack();
    localStorage.setItem("botCards", JSON.stringify(botCards));
  }

  displayHandCards();
  displayBotHandCards();
  displayUserCatalog();
  displaySelectedCard("playerSelectedCard", null);

  const playerDropZone = document.getElementById("playerSelectedCard");

  playerDropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    playerDropZone.classList.add("dragover");
  });
  playerDropZone.addEventListener("dragleave", () => {
    playerDropZone.classList.remove("dragover");
  });
  playerDropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    playerDropZone.classList.remove("dragover");
    console.log("DROP!");
    // Empêche le drop si une carte est déjà sélectionnée
    if (selectedPlayerCard) return;
    const cardId = e.dataTransfer.getData("text/plain");
    const source = e.dataTransfer.getData("source-container");
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
    let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
    let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
    let myCard;
    if (source === "userCatalogContainer") {
      if (handCards.length >= 5) {
        alert("Votre main est pleine (5 cartes max) !");
        return;
      }
      const catalogIndex = deckCards.findIndex(card => card.id == cardId);
      if (catalogIndex === -1) return;
      myCard = deckCards[catalogIndex];
      // Ajoute à la main et retire du catalogue
      handCards.push(myCard);
      deckCards.splice(catalogIndex, 1);
      localStorage.setItem("handCards", JSON.stringify(handCards));
      localStorage.setItem("deckCards", JSON.stringify(deckCards));
      displayUserCatalog();
      displayHandCards();
    } else if (source === "handContainer") {
      myCard = handCards.find(card => card.id == cardId);
    } else {
      return;
    }
    if (!myCard) return;
    if (!botCards.length) {
      alert("Le bot n'a pas de cartes !");
      return;
    }
    selectedPlayerCard = myCard;
    const randomBotCard = botCards[Math.floor(Math.random() * botCards.length)];
    selectedBotCard = randomBotCard;
    displaySelectedCard("playerSelectedCard", selectedPlayerCard);
    displaySelectedCard("botSelectedCard", selectedBotCard);
    displayHandCards(selectedPlayerCard.id);
    displayBotHandCards(selectedBotCard.id);
    document.getElementById("exchangeActionArea").style.display = "";
  });

  // Validation de l’échange
  document.getElementById("validateExchangeBtn").addEventListener("click", () => {
    if (!selectedPlayerCard || !selectedBotCard) return;

    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
    let botCards = JSON.parse(localStorage.getItem("botCards")) || [];

    const myIndex = handCards.findIndex(card => card.id === selectedPlayerCard.id);
    const botIndex = botCards.findIndex(card => card.id === selectedBotCard.id);

    if (myIndex !== -1 && botIndex !== -1) {
      // Échanger les cartes
      handCards.splice(myIndex, 1, selectedBotCard);
      botCards.splice(botIndex, 1, selectedPlayerCard);

      localStorage.setItem("handCards", JSON.stringify(handCards));
      localStorage.setItem("botCards", JSON.stringify(botCards));
      alert("Échange effectué !");
    }

    resetExchangeSelection();
  });

  // Annuler l’échange
  document.getElementById("cancelExchangeBtn").addEventListener("click", () => {
    resetExchangeSelection();
  });
});
