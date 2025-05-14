import { drawPack } from "./pokemon-api.js";

let handCard = {};
let deckCards = [{}];

localStorage.setItem("handCard", JSON.stringify(handCard));

const drawNewCardsBtn = document.getElementById("drawNewCardsBtn");

drawNewCardsBtn.addEventListener("click", () => {
  deckCards = deckCards.concat(drawPack());
  localStorage.setItem("deckCards", JSON.stringify(deckCards));
  console.log(deckCards);
});
