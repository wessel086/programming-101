// Selectors — worden ingesteld in setup().
let nameInput;
let startButton;
let highscoreElement;
let scorePanel;
let selectedLevel = null;

// Werkt de highscoretekst bij op de pagina.
function updateHighscoreDisplay() {
  const highscore = getItem("qc_highscore") ?? 0;
  highscoreElement.html("Highscore: " + highscore);
}

// Markeert het gekozen level en maakt de startknop klikbaar.
function selectLevel(button) {
  selectAll(".level-btn").forEach((levelButton) => {
    levelButton.removeClass("selected");
    levelButton.attribute("aria-pressed", "false");
  });

  button.addClass("selected");
  button.attribute("aria-pressed", "true");
  selectedLevel = button.attribute("data-level");
  startButton.removeAttribute("disabled");
}

// Toont de laatste tien scores in het scorepaneel.
function fillScorePanel() {
  const scores = getItem("qc_previous_scores") ?? [];
  if (scores.length === 0) {
    return;
  }

  select(".panel-empty").remove();

  const list = createElement("ol");
  scores.forEach(({ name, score, level }) => {
    const item = createElement("li", name + " | Level " + level + " | " + score + " punten");
    item.parent(list);
  });

  list.parent(scorePanel);
}

// Zet alles klaar zodra p5.js is opgestart.
function setup() {
  noCanvas();

  nameInput = select(".name-input");
  startButton = select(".start-btn");
  highscoreElement = select(".highscore");
  scorePanel = select(".score-panel");

  // Laad opgeslagen naam.
  const savedName = getItem("qc_name") ?? "";
  nameInput.value(savedName);

  // Sla naam op terwijl de speler typt.
  nameInput.input(() => {
    storeItem("qc_name", nameInput.value());
  });

  // Koppel levelknoppen.
  selectAll(".level-btn").forEach((button) => {
    button.mouseClicked(() => selectLevel(button));
  });

  // Koppel startknop.
  startButton.mouseClicked(() => {
    if (selectedLevel === null) {
      return;
    }
    storeItem("qc_level", selectedLevel);
    window.location.href = "game.html";
  });

  updateHighscoreDisplay();
  fillScorePanel();
}
