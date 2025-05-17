const cardDetailsTitle = document.getElementById("cardDetailsTitle");
const cardDetailsContent = document.getElementById("cardDetailsContent");
const cardDetailsModal = document.getElementById("cardDetailsModal");
const closeModalBtn = document.querySelector(".card-details-btn-close");

export function showCardDetails(card) {
  cardDetailsTitle.innerHTML = card.name;

  cardDetailsContent.innerHTML = `
            <img src="${card.image}" class="card-details-img">
            <div class="card-type-badge type-${card.type}">${card.type}</div>
            <div class="card-stats">
                <div><span>PV:</span> <span>${card.hp}</span></div>
                <div><span>Attaque:</span> <span>${card.attack}</span></div>
                <div><span>Defense:</span> <span>${card.defense}</span></div>
                <div><span>Vitesse:</span> <span>${card.speed}</span></div>
            </div>
        `;

  cardDetailsModal.style.display = "block";
}

closeModalBtn.addEventListener("click", () => {
  cardDetailsModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === cardDetailsModal) {
    cardDetailsModal.style.display = "none";
  }
});
