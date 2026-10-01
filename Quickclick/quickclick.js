const nameInput = document.querySelector(".name-input");
const levelButtons = document.querySelectorAll(".level-btn");
const startButton = document.querySelector(".start-btn");

// --- Save name while typing ---
nameInput.addEventListener("input", () => {
  localStorage.setItem("qc_name", nameInput.value);
});

// --- Load saved name when the page opens ---
const savedName = localStorage.getItem("qc_name");
if (savedName) {
  nameInput.value = savedName;
}

let selectedLevel = null;

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    levelButtons.forEach((levelButton) => {
      levelButton.classList.remove("selected");
      levelButton.setAttribute("aria-pressed", "false");
    });

    button.classList.add("selected");
    button.setAttribute("aria-pressed", "true");
    selectedLevel = button.dataset.level;
    startButton.disabled = false;
  });
});

startButton.addEventListener("click", () => {
  if (selectedLevel === null) {
    return;
  }

  localStorage.setItem("qc_level", selectedLevel);
  window.location.href = "game.html";
});

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

// --- Toon de laatst gespeelde scores ---
const previousScoresPanel = document.querySelector(".score-panel");
const previousScores = JSON.parse(localStorage.getItem("qc_previous_scores") || "[]");
if (previousScores.length > 0) {
  previousScoresPanel.querySelector(".panel-empty")?.remove();
  const scoreList = document.createElement("ol");
  scoreList.className = "previous-score-list";

  previousScores.forEach((entry) => {
    const item = document.createElement("li");
    const player = document.createElement("span");
    player.textContent = `${entry.name} — Level ${entry.level}`;
    const result = document.createElement("strong");
    result.textContent = `${entry.score} punten`;
    const date = document.createElement("small");
    date.textContent = entry.date;
    item.append(player, result, date);
    scoreList.append(item);
  });

  previousScoresPanel.append(scoreList);
}
