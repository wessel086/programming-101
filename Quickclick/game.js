const canvasArea = document.querySelector(".game-canvas");
const levelDisplay = document.querySelector(".level");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");
const countdownDisplay = document.querySelector(".countdown");
const gameOverDisplay = document.querySelector(".game-over");
const finalScoreDisplay = document.querySelector(".final-score");
const finalHighscoreDisplay = document.querySelector(".final-highscore");
const savedLevel = localStorage.getItem("qc_level") || "1";

// Toont het level dat de speler op de startpagina heeft gekozen.
levelDisplay.textContent = savedLevel;

// Bewaart de score, tijd, targets en instellingen die tijdens het spel veranderen.
let score = 0;
let timeLeft = 30;
let timerInterval;
let gameStarted = false;
let gameOver = false;
let targetDiameter;
const maxTargets = 5;
const targets = [];
const normalTargetLifetime = 5000;
const timeTargetLifetime = 3000;
const goldTargetLifetime = 3000;
let clickFeedback = null;

// Berekent de targetgrootte op basis van het scherm en maakt targets kleiner in level 4.
function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter =
    savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
}

// Kiest een willekeurige plek en een targettype voor een nieuw target.
function setRandomTargetPosition() {
  const radius = targetDiameter / 2;
  const randomX = random(radius, width - radius);
  const randomY = random(radius, height - radius);

  const spawnRoll = random(107);
  let type = "normal";

  if (spawnRoll >= 100) {
    type = "gold";
  } else if (spawnRoll >= 90) {
    type = "time";
  }

  return { x: randomX, y: randomY, type, spawnedAt: millis() };
}

// Maakt één target en voegt het toe aan de lijst met actieve targets.
function spawnTarget() {
  targets.push(setRandomTargetPosition());
}

// Vult lege plekken aan totdat er maximaal vijf targets tegelijk zijn.
function fillTargetSlots() {
  while (targets.length < maxTargets) {
    spawnTarget();
  }
}

// Zet de resterende tijd om naar minuten en seconden en toont die in beeld.
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

// Geeft seconden bij de timer op en werkt de weergave meteen bij.
function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

// Stopt het spel en toont de eindscore en de nieuwe highscore.
function finishGame() {
  if (gameOver) {
    return;
  }

  gameOver = true;
  gameStarted = false;
  clearInterval(timerInterval);

  let highscore = Number(localStorage.getItem("qc_highscore")) || 0;
  if (score > highscore) {
    highscore = score;
    localStorage.setItem("qc_highscore", highscore);
  }

  finalScoreDisplay.textContent = `Score: ${score}`;
  finalHighscoreDisplay.textContent = `Highscore: ${highscore}`;
  gameOverDisplay.hidden = false;
}

// Haalt seconden van de timer af, zonder dat de tijd onder nul komt.
function subtractTime(seconds) {
  timeLeft = Math.max(0, timeLeft - seconds);
  updateTimerDisplay();

  if (timeLeft === 0) {
    finishGame();
  }
}

// Laat de timer elke seconde één seconde aftellen.
function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft = Math.max(0, timeLeft - 1);
    updateTimerDisplay();

    if (timeLeft === 0) {
      finishGame();
    }
  }, 1000);
}

// Zet de score klaar en start de timer nadat de countdown is afgelopen.
function startGame() {
  score = 0;
  scoreDisplay.textContent = `Score: ${score}`;
  // De levensduur begint zodra het spel start, niet tijdens de countdown.
  for (const target of targets) {
    target.spawnedAt = millis();
  }
  gameStarted = true;
  startTimer();
}

// Telt vijf seconden af en start daarna het spel.
function startCountdown() {
  let countdown = 5;
  countdownDisplay.hidden = false;
  updateTimerDisplay();

  const countdownInterval = setInterval(() => {
    countdown -= 1;

    if (countdown > 0) {
      countdownDisplay.textContent = countdown;
      return;
    }

    clearInterval(countdownInterval);
    countdownDisplay.textContent = "Start!";
    startGame();
    setTimeout(() => {
  countdownDisplay.hidden = true;
}, 500);
  }, 1000);
}

startCountdown()

// Maakt het canvas en vult het begin van het spel met targets.
function setup() {
  const canvas = createCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  canvas.parent(canvasArea);

  updateTargetDiameter();
  fillTargetSlots();
}

// Tekent elk frame de targets en verwijdert targets die te lang zijn blijven staan.
function draw() {
  if (gameOver) {
    return;
  }

  background(24);
  noStroke();

  // Normale targets verdwijnen na vijf seconden; time targets na drie seconden.
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    let lifetime = normalTargetLifetime;
    if (target.type === "time") {
      lifetime = timeTargetLifetime;
    } else if (target.type === "gold") {
      lifetime = goldTargetLifetime;
    }

    if (gameStarted && millis() - target.spawnedAt >= lifetime) {
      targets.splice(index, 1);
      subtractTime(2);
      if (gameOver) {
        return;
      }
      continue;
    }

    let targetColor = "gray";
    if (target.type === "time") {
      targetColor = "green";
    } else if (target.type === "gold") {
      targetColor = "gold";
    }
    fill(targetColor);
    circle(target.x, target.y, targetDiameter);
  }

  // Toont 0,3 seconde een groen rondje bij raak of rood rondje bij mis.
  if (clickFeedback && millis() - clickFeedback.time < 300) {
    fill(clickFeedback.color);
    circle(clickFeedback.x, clickFeedback.y, 20);
  }

  if (!gameOver) {
    fillTargetSlots();
  }
}

// Controleert of de speler een target raakt en geeft de bijbehorende beloning.
function mousePressed() {
  if (!gameStarted) {
    return;
  }

  let hitTarget = false;

  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    const distance = dist(mouseX, mouseY, target.x, target.y);

    if (distance < targetDiameter / 2) {
      if (target.type === "normal") {
        score += 1;
        scoreDisplay.textContent = `Score: ${score}`;
      } else if (target.type === "time") {
        addTime(3);
      } else if (target.type === "gold") {
        score += 5;
        scoreDisplay.textContent = `Score: ${score}`;
      }
      clickFeedback = {
        x: target.x,
        y: target.y,
        color: "green",
        time: millis(),
      };
      targets.splice(index, 1);
      fillTargetSlots();
      hitTarget = true;
      break;
    }
  }

  if (!hitTarget) {
    clickFeedback = {
      x: mouseX,
      y: mouseY,
      color: "red",
      time: millis(),
    };
    subtractTime(2);
  }
}

// Past het canvas en de targets aan wanneer het browservenster van formaat verandert.
function windowResized() {
  resizeCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  updateTargetDiameter();
  targets.length = 0;
  fillTargetSlots();
}
