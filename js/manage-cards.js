import { drawPack } from "./pokemon-api.js";
import { displayDeckCards } from "./display-cards.js";
import { countDown } from "./display-timer.js";

let handCards = [];
let deckCards = [];

const savedDeckCards = JSON.parse(localStorage.getItem("deckCards"));
if (savedDeckCards) {
  deckCards = savedDeckCards;
}

const savedHandCards = JSON.parse(localStorage.getItem("handCards"));
if (savedHandCards) {
  handCards = savedHandCards;
} else {
  localStorage.setItem("handCards", JSON.stringify(handCards));
}

const drawNewCardsBtn = document.getElementById("drawNewCardsBtn");

//tirer 5 nouvelles cartes
drawNewCardsBtn.addEventListener("click", () => {
  deckCards = deckCards.concat(drawPack());
  localStorage.setItem("deckCards", JSON.stringify(deckCards));
  console.log(deckCards);
  displayDeckCards();
  countDown();
});

document.addEventListener("DOMContentLoaded", () => {
  displayDeckCards();
});
