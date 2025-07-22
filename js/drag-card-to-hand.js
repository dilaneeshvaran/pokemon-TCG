import { displayDeckCards, displayHandCards } from "./display-cards.js";

// remove one instance of a card while preserving order
function removeCardPreservingOrder(cards, cardId) {
  // Find last occurrence of card to prevent position changes
  for (let i = cards.length - 1; i >= 0; i--) {
    if (cards[i].id == cardId) {
      return cards.splice(i, 1)[0];
    }
  }
  return null;
}

// move a card group to the end of the deck
function moveCardGroupToEnd(deckCards, cardToAdd) {
  // remove all instances of this card from deck
  const existingCards = [];
  for (let i = deckCards.length - 1; i >= 0; i--) {
    if (deckCards[i].id === cardToAdd.id) {
      existingCards.unshift(deckCards.splice(i, 1)[0]); // unshift to maintain original order
    }
  }

  // add the new card first, then all existing instances
  deckCards.push(cardToAdd);
  deckCards.push(...existingCards);
}

document.addEventListener("DOMContentLoaded", () => {
  const handZone = document.getElementById("handContainer");
  const deckZone = document.getElementById("deckContainer");

  // Drag start sur .pokemon-card (main ou pioche)
  function handleDragStart(e) {
    let card = e.target.closest(".pokemon-card");
    if (!card) return;
    // Si l'utilisateur commence le drag sur l'image, on force le drag du parent
    if (
      e.target.tagName === "IMG" &&
      e.target.parentElement.parentElement === card
    ) {
      // Empêche le drag natif de l'image
      e.preventDefault();
      // On simule le drag du parent (non supporté nativement, donc on ne fait rien ici)
      // L'attribut draggable est déjà sur .pokemon-card, donc le drag doit fonctionner si l'utilisateur commence sur la carte
      // On laisse le dragstart se faire normalement sur la carte
      return;
    }
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", card.dataset.pokemonId);
    e.dataTransfer.setData("source-container", card.parentElement.id);
    if (e.dataTransfer.setDragImage) {
      e.dataTransfer.setDragImage(
        card,
        card.offsetWidth / 2,
        card.offsetHeight / 2
      );
    }
  }

  function handleDragEnd(e) {
    const card = e.target.closest(".pokemon-card");
    if (card) card.classList.remove("dragging");
    handZone.classList.remove("dragover");
    deckZone.classList.remove("dragover");
  }

  // Ajoute les listeners à chaque conteneur (main et pioche)
  [handZone, deckZone].forEach((zone) => {
    zone.addEventListener("dragstart", handleDragStart);
    zone.addEventListener("dragend", handleDragEnd);
  });

  // Highlight de la zone de drop
  handZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    handZone.classList.add("dragover");
  });
  handZone.addEventListener("dragleave", (e) => {
    handZone.classList.remove("dragover");
  });
  deckZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    deckZone.classList.add("dragover");
  });
  deckZone.addEventListener("dragleave", (e) => {
    deckZone.classList.remove("dragover");
  });

  // Drop dans la main
  handZone.addEventListener("drop", (e) => {
    e.preventDefault();
    handZone.classList.remove("dragover");
    const cardId = e.dataTransfer.getData("text/plain");
    const source = e.dataTransfer.getData("source-container");
    if (source === "handContainer") return; // déjà dans la main
    let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];

    const movedCard = removeCardPreservingOrder(deckCards, cardId);
    if (!movedCard) return;
    if (handCards.length < 4) {
      handCards.push(movedCard);
    } else if (handCards.length == 4) {
      const firstCardInHand = handCards[0];
      handCards.shift();
      handCards.push(movedCard);
      moveCardGroupToEnd(deckCards, firstCardInHand);
    }
    localStorage.setItem("deckCards", JSON.stringify(deckCards));
    localStorage.setItem("handCards", JSON.stringify(handCards));
    displayDeckCards();
    displayHandCards();
    // Ajoute l'animation à la dernière carte de la main
    setTimeout(() => {
      const cards = handZone.querySelectorAll(".pokemon-card");
      if (cards.length > 0) {
        const lastCard = cards[cards.length - 1];
        lastCard.classList.add("card-drop-animate");
        lastCard.addEventListener(
          "animationend",
          () => {
            lastCard.classList.remove("card-drop-animate");
          },
          { once: true }
        );
      }
    }, 30);
  });

  // Drop dans la pioche
  deckZone.addEventListener("drop", (e) => {
    e.preventDefault();
    deckZone.classList.remove("dragover");
    const cardId = e.dataTransfer.getData("text/plain");
    const source = e.dataTransfer.getData("source-container");
    if (source === "deckContainer") return; // déjà dans la pioche
    let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];

    const movedCard = removeCardPreservingOrder(handCards, cardId);
    if (!movedCard) return;

    moveCardGroupToEnd(deckCards, movedCard);
    localStorage.setItem("deckCards", JSON.stringify(deckCards));
    localStorage.setItem("handCards", JSON.stringify(handCards));
    displayDeckCards();
    displayHandCards();
  });
});
