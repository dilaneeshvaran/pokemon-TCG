import { drawPack } from "./pokemon-api.js";
import { displayDeckCards } from "./display-cards.js";
import { alertMessage, countDown } from "./display-timer.js";

let handCards = [];
let deckCards = [];

const savedDeckCards = JSON.parse(localStorage.getItem("deckCards"));
if (savedDeckCards) {
  deckCards = savedDeckCards;
}

const savedHandCards = JSON.parse(localStorage.getItem("handCards"));
if (savedHandCards) {
  handCards = savedHandCards;
}

const drawNewCardsBtn = document.getElementById("drawNewCardsBtn");

//tirer 5 nouvelles cartes
drawNewCardsBtn.addEventListener("click", () => {
  if(drawNewCardsBtn.id == "drawNewCardsBtn") {
  deckCards = deckCards.concat(drawPack());
  localStorage.setItem("deckCards", JSON.stringify(deckCards));
  console.log(drawNewCardsBtn);
  displayDeckCards();
  countDown();
  } else if(drawNewCardsBtn.id == "drawNewCardsBtnDisabled") {
    alertMessage("Veuillez patienter avant de tirer un nouveau paquet.");
  }
});

const closePopupBtn = document.getElementById('closePopupBtn');

closePopupBtn.addEventListener('click', () => {
  const popup = document.getElementById('cooldownPopup');
  popup.classList.add('hidden');
});

document.addEventListener("DOMContentLoaded", () => {
  displayDeckCards();
});
