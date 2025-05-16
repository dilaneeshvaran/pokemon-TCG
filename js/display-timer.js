const timerDisplay = document.getElementById("timerDisplay");
const waitTimeInMinutes = 5;
let totalTimeInSeconds = waitTimeInMinutes * 60;
let timerInterval = null;

function saveTimerState() {
  const timerState = Date.now() + totalTimeInSeconds * 1000;
  localStorage.setItem("timerState", JSON.stringify(timerState));
}

function loadTimerState() {
  const timerState = JSON.parse(localStorage.getItem("timerState"));

  if (timerState) {
    const currentTime = Date.now();
    const remainingTimeInMs = timerState - currentTime;

    if (remainingTimeInMs > 0) {
      totalTimeInSeconds = Math.ceil(remainingTimeInMs / 1000);
      document.getElementById("drawNewCardsBtn").disabled = true;

      updateCountDown();
      timerInterval = setInterval(updateCountDown, 1000);
    } else {
      totalTimeInSeconds = 0;
      timerDisplay.textContent =
        "Vous pouvez tirer un nouveau packet maintenant !";
      document.getElementById("drawNewCardsBtn").disabled = false;
    }
  }
}

export function updateCountDown() {
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  //time format
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  timerDisplay.textContent = `Prochain packet disponible dans : ${displayMinutes}:${displaySeconds}`;

  totalTimeInSeconds--;
  saveTimerState();

  if (totalTimeInSeconds < 0) {
    clearInterval(timerInterval);
    timerDisplay.textContent =
      "Vous pouvez tirer un nouveau packet maintenant !";
    document.getElementById("drawNewCardsBtn").disabled = false;
    localStorage.removeItem("timerState");
  }
}

export function countDown() {
  document.getElementById("drawNewCardsBtn").disabled = true;

  totalTimeInSeconds = waitTimeInMinutes * 60;

  if (timerInterval) {
    clearInterval(timerInterval);
  }

  updateCountDown();
  timerInterval = setInterval(updateCountDown, 1000);
}

document.addEventListener("DOMContentLoaded", loadTimerState);
