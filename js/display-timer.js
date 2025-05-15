const timerDisplay = document.getElementById("timerDisplay");
const waitTimeInMinutes = 5;
let totalTimeInSeconds = waitTimeInMinutes * 60;
let timerInterval = null;

export function updateCountDown() {
  const minutes = Math.floor(totalTimeInSeconds / 60);
  const seconds = totalTimeInSeconds % 60;

  //time format
  const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const displaySeconds = seconds < 10 ? `0${seconds}` : seconds;

  timerDisplay.textContent = `Prochain packet disponible dans : ${displayMinutes}:${displaySeconds}`;

  totalTimeInSeconds--;

  if (totalTimeInSeconds < 0) {
    clearInterval(timerInterval);
    timerDisplay.textContent = "";
    document.getElementById("drawNewCardsBtn").disabled = false;
  }
}

export function countDown() {
  document.getElementById("drawNewCardsBtn").disabled = true;

  updateCountDown();
  timerInterval = setInterval(updateCountDown, 1000);
}
