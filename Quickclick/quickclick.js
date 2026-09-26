// --- Element references (global, so later commits can use them too) ---
const nameInput = document.querySelector(".name-input");

function setup() {
  createCanvas(640, 480);
}

function draw() {
  background(20);
}

// --- Save name while typing ---
nameInput.addEventListener("input", () => {
  localStorage.setItem("qc_name", nameInput.value);
});

// --- Load saved name when the page opens ---
const savedName = localStorage.getItem("qc_name");
if (savedName) {
  nameInput.value = savedName;
}

// --- Highscore and update logic ---
const highscoreElement = document.querySelector(".highscore");

function displayHighscore() {
  const highscore = localStorage.getItem("qc_highscore") || 0;
  highscoreElement.textContent = `Highscore: ${highscore}`;
}

function updateHighscoreIfHigher(newScore) {
  const currentHighscore = parseInt(localStorage.getItem("qc_highscore")) || 0;
  if (newScore > currentHighscore) {
    localStorage.setItem("qc_highscore", newScore);
  }
  displayHighscore();
}

displayHighscore();