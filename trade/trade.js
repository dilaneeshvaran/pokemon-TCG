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
      card.style.outline = "3px solid #1e90ff";
      card.style.boxShadow = "0 0 0 4px #4fc3f7";
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
        e.dataTransfer.setDragImage(
          card,
          card.offsetWidth / 2,
          card.offsetHeight / 2
        );
      }
    });
    card.addEventListener("dragend", (e) => {
      card.classList.remove("dragging");
      document
        .getElementById("playerSelectedCard")
        .classList.remove("dragover");
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
      card.style.outline = "3px solid #ff5252";
      card.style.boxShadow = "0 0 0 4px #ffbdbd";
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
      container.innerHTML =
        '<span style="color:#888;font-size:1em;">Glissez une carte ici pour proposer un échange</span>';
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
        e.dataTransfer.setDragImage(
          card,
          card.offsetWidth / 2,
          card.offsetHeight / 2
        );
      }
    });
    card.addEventListener("dragend", () => {
      card.classList.remove("dragging");
      document
        .getElementById("playerSelectedCard")
        .classList.remove("dragover");
    });
    catalogContainer.appendChild(card);
  });
}

function resetExchangeSelection() {
  selectedPlayerCard = null;
  selectedBotCard = null;
  displaySelectedCard("playerSelectedCard", null);
  displaySelectedCard("botSelectedCard", null);
  document.getElementById("exchangeActionArea").style.display = "block";
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

  displayUserCatalog();
  displaySelectedCard("playerSelectedCard", null);
  document.getElementById("exchangeActionArea").style.display = "block";

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
    // Empeche le drop si une carte est déja sélectionnée
    if (selectedPlayerCard) return;
    const cardId = e.dataTransfer.getData("text/plain");
    const source = e.dataTransfer.getData("source-container");
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];
    let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
    let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
    let myCard;
    if (source === "userCatalogContainer") {
      const catalogIndex = deckCards.findIndex((card) => card.id == cardId);
      if (catalogIndex === -1) return;
      myCard = deckCards[catalogIndex];
    } else if (source === "handContainer") {
      myCard = handCards.find((card) => card.id == cardId);
    } else {
      return;
    }
    if (!myCard) return;
    if (!botCards.length) {
      alert("Le bot n'a pas de cartes !");
      return;
    }
    selectedPlayerCard = myCard;
    displaySelectedCard("playerSelectedCard", selectedPlayerCard);
    // Affiche un message de chargement dans la zone du bot
    const botZone = document.getElementById("botSelectedCard");
    botZone.innerHTML =
      '<span style="color:#888;font-size:1em;">Le bot réfléchit...</span>';
    // Ne pas masquer le bouton d'échange
    // Simule la reflexion du bot avec un délai
    setTimeout(() => {
      const randomBotCard =
        botCards[Math.floor(Math.random() * botCards.length)];
      selectedBotCard = randomBotCard;
      displaySelectedCard("botSelectedCard", selectedBotCard);
      displayBotHandCards(selectedBotCard.id);
      // Le bouton reste toujours visible
    }, 1000);
    displayHandCards(selectedPlayerCard.id);
  });

  // Validation de l’échange
  document
    .getElementById("validateExchangeBtn")
    .addEventListener("click", () => {
      // Affiche la popup de confirmation
      document
        .getElementById("confirmExchangeModal")
        .classList.remove("hidden");
    });

  // Gestion des boutons de la popup
  document
    .getElementById("confirmExchangeBtn")
    .addEventListener("click", () => {
      if (!selectedPlayerCard || !selectedBotCard) {
        document.getElementById("confirmExchangeModal").classList.add("hidden");
        return;
      }
      let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
      let botCards = JSON.parse(localStorage.getItem("botCards")) || [];
      // Retirer la carte du joueur du catalogue utilisateur
      const playerCardIndex = deckCards.findIndex(
        (card) => card.id === selectedPlayerCard.id
      );
      if (playerCardIndex !== -1) {
        deckCards.splice(playerCardIndex, 1);
      }
      // Ajouter la carte du joueur a la main du bot
      botCards.push(selectedPlayerCard);
      // Ajouter la carte du bot au catalogue utilisateur
      deckCards.push(selectedBotCard);
      localStorage.setItem("deckCards", JSON.stringify(deckCards));
      localStorage.setItem("botCards", JSON.stringify(botCards));
      document.getElementById("confirmExchangeModal").classList.add("hidden");
      window.location.href = "index.html";
      // resetExchangeSelection(); // inutile apres redirection
    });
  document
    .getElementById("cancelExchangeModalBtn")
    .addEventListener("click", () => {
      document.getElementById("confirmExchangeModal").classList.add("hidden");
    });

  // Annuler l’echange
  document.getElementById("cancelExchangeBtn").addEventListener("click", () => {
    resetExchangeSelection();
  });
});
