// Fonction utilitaire pour afficher une popup d'alerte stylisee
export function showAlertPopup(message) {
  let popup = document.getElementById("customAlertPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "customAlertPopup";
    popup.className = "popup-overlay alert-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-icon">⚠️</span>
        <div class="alert-message">${message}</div>
        <button class="btn" id="closeCustomAlertBtn">OK</button>
      </div>
    `;
    document.body.appendChild(popup);
  } else {
    popup.querySelector(".alert-message").textContent = message;
    popup.classList.remove("hidden");
  }
  popup.classList.remove("hidden");
  popup.querySelector("#closeCustomAlertBtn").onclick = () => {
    popup.classList.add("hidden");
  };
}

// Fonction utilitaire pour afficher une popup de confirmation stylisee
export function showConfirmPopup(message, onConfirm) {
  let popup = document.getElementById("customConfirmPopup");
  if (!popup) {
    popup = document.createElement("div");
    popup.id = "customConfirmPopup";
    popup.className = "popup-overlay alert-popup";
    popup.innerHTML = `
      <div class="popup-content">
        <span class="popup-icon">❓</span>
        <div class="alert-message">${message}</div>
        <div style="margin-top:18px;display:flex;gap:16px;justify-content:center;">
          <button class="btn" id="confirmYesBtn">Oui</button>
          <button class="btn" id="confirmNoBtn">Non</button>
        </div>
      </div>
    `;
    document.body.appendChild(popup);
  } else {
    popup.querySelector(".alert-message").textContent = message;
    popup.classList.remove("hidden");
  }
  popup.classList.remove("hidden");
  popup.querySelector("#confirmYesBtn").onclick = () => {
    popup.classList.add("hidden");
    if (onConfirm) onConfirm();
  };
  popup.querySelector("#confirmNoBtn").onclick = () => {
    popup.classList.add("hidden");
  };
}
