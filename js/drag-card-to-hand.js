import { displayDeckCards, displayHandCards } from "./display-cards.js";

document.addEventListener("DOMContentLoaded", () => {
  const dropZone = document.getElementById("handContainer");
  const deckContainer = document.getElementById("deckContainer");

  deckContainer.addEventListener("dragstart", (e) => {
    //if statement pour verifier si l'élement est une carte
    if (e.target.classList.contains("pokemon-card")) {
      e.dataTransfer.setData("text/plain", e.target.dataset.pokemonId);
    }
  });

  dropZone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropZone.classList.add("dragover");
  });

  dropZone.addEventListener("dragleave", (e) => {
    dropZone.classList.remove("dragover");
  });

  dropZone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropZone.classList.remove("dragover");

    const cardId = e.dataTransfer.getData("text/plain");

    let deckCards = JSON.parse(localStorage.getItem("deckCards")) || [];
    let handCards = JSON.parse(localStorage.getItem("handCards")) || [];

    const cardIndex = deckCards.findIndex((card) => card.id == cardId);

    const movedCard = deckCards.splice(cardIndex, 1)[0];

    if (handCards.length < 4) {
      handCards.push(movedCard);
    } else if (handCards.length == 4) {
      const firstCardInHand = handCards[0];
      handCards.shift();
      handCards.push(movedCard);
      deckCards.push(firstCardInHand);
    }

    localStorage.setItem("deckCards", JSON.stringify(deckCards));
    localStorage.setItem("handCards", JSON.stringify(handCards));

    displayDeckCards();
    displayHandCards();
  });
});
