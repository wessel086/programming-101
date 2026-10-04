// Selectors en opgeslagen waarden — worden ingesteld in setup().
let canvasArea;
let levelDisplay;
let scoreDisplay;
let timerDisplay;
let countdownDisplay;
let gameOverDisplay;
let finalScoreDisplay;
let finalHighscoreDisplay;
let restartButton;
let menuButton;
let savedLevel;
let targetLifetimes;
let crosshairImg;
let clickSound;
let missSound;

// Bewaart de score, tijd, targets en instellingen die tijdens het spel veranderen.
let score = 0;
let timeLeft = 30;
let gameStarted = false;
let gameOver = false;
let targetDiameter;
let clickFeedback = null;
let lastSecond = 0;
let countdownValue = 0;
let countdownStartTime = 0;
let countingDown = false;

const maxTargets = 5;
const targets = [];
const targetLifetimesByLevel = {
  1: { normal: 5000, time: 3000, gold: 3000 },
  2: { normal: 4000, time: 2000, gold: 2000 },
  3: { normal: 3000, time: 1000, gold: 1000 },
  4: { normal: 3000, time: 1000, gold: 1000 },
};

function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter = savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
}

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

function spawnTarget() {
  targets.push(setRandomTargetPosition());
}

function fillTargetSlots() {
  while (targets.length < maxTargets) {
    spawnTarget();
  }
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.html(
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

function updateScoreDisplay() {
  scoreDisplay.html("Score: " + score);
}

function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

function subtractTime(seconds) {
  timeLeft = Math.max(0, timeLeft - seconds);
  updateTimerDisplay();

  if (timeLeft === 0) {
    finishGame();
  }
}

// Stopt het spel en toont het game-over scherm.
// .style("display", "flex") is nodig omdat .show() van p5 display: block zet,
// waardoor align-items en justify-content niet werken.
// Array.isArray() check voorkomt crash als qc_previous_scores geen array is.
function finishGame() {
  if (gameOver) {
    return;
  }

  gameOver = true;
  gameStarted = false;

  let highscore = getItem("qc_highscore") ?? 0;
  if (score > highscore) {
    highscore = score;
    storeItem("qc_highscore", highscore);
  }

  const rawScores = getItem("qc_previous_scores");
  const scores = Array.isArray(rawScores) ? rawScores : [];
  const name = (getItem("qc_name") ?? "").trim() || "Anoniem";
  scores.unshift({ name, score, level: savedLevel });
  storeItem("qc_previous_scores", scores.slice(0, 10));

  finalScoreDisplay.html("Score: " + score);
  finalHighscoreDisplay.html("Highscore: " + highscore);
  gameOverDisplay.style("display", "flex");
}

function tickTimer() {
  if (!gameStarted || gameOver) {
    return;
  }

  const currentSecond = Math.floor(millis() / 1000);
  if (currentSecond !== lastSecond) {
    lastSecond = currentSecond;
    subtractTime(1);
  }
}

function startGame() {
  score = 0;
  updateScoreDisplay();
  for (const target of targets) {
    target.spawnedAt = millis();
  }
  gameStarted = true;
  lastSecond = Math.floor(millis() / 1000);
}

// Toont de countdown gecentreerd via display: flex.
function startCountdown() {
  countdownValue = 5;
  countdownStartTime = millis();
  countingDown = true;
  countdownDisplay.html(countdownValue);
  countdownDisplay.style("display", "flex");
  updateTimerDisplay();
}

function tickCountdown() {
  if (!countingDown) {
    return;
  }

  const elapsed = Math.floor((millis() - countdownStartTime) / 1000);
  const remaining = 5 - elapsed;

  if (remaining > 0 && remaining !== countdownValue) {
    countdownValue = remaining;
    countdownDisplay.html(countdownValue);
  }

  if (remaining <= 0 && !gameStarted) {
    countingDown = false;
    countdownDisplay.html("Start!");
    startGame();
    setTimeout(() => countdownDisplay.style("display", "none"), 500);
  }
}

function restartGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  timeLeft = 30;
  clickFeedback = null;
  targets.length = 0;

  updateScoreDisplay();
  updateTimerDisplay();
  gameOverDisplay.style("display", "none");
  fillTargetSlots();
  startCountdown();
}

function preload() {
  crosshairImg = loadImage("fotos/crosshair.png");
  clickSound = loadSound("geluiden/pew.wav");
  missSound = loadSound("geluiden/miss.mp3");
}

function setup() {
  canvasArea = select(".game-canvas");
  levelDisplay = select(".level");
  scoreDisplay = select(".score");
  timerDisplay = select(".timer");
  countdownDisplay = select(".countdown");
  gameOverDisplay = select(".game-over");
  finalScoreDisplay = select(".final-score");
  finalHighscoreDisplay = select(".final-highscore");
  restartButton = select(".restart-button");
  menuButton = select(".menu-button");

  savedLevel = getItem("qc_level") ?? "1";
  targetLifetimes = targetLifetimesByLevel[savedLevel] ?? targetLifetimesByLevel[1];

  levelDisplay.html("Level: " + savedLevel);

  const canvas = createCanvas(canvasArea.width, canvasArea.height);
  canvas.parent(canvasArea);
  canvas.elt.addEventListener("contextmenu", (event) => event.preventDefault());

  restartButton.mouseClicked(restartGame);
  menuButton.mouseClicked(() => {
    gameStarted = false;
    gameOver = true;
    window.location.href = "Home.html";
  });

  noCursor();
  updateTargetDiameter();
  fillTargetSlots();
  startCountdown();
}

function drawTargets() {
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    const lifetime = targetLifetimes[target.type];

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
}

function drawClickFeedback() {
  if (clickFeedback && millis() - clickFeedback.time < 300) {
    fill(clickFeedback.color);
    circle(clickFeedback.x, clickFeedback.y, 20);
  }
}

function drawCrosshair() {
  image(crosshairImg, mouseX - 16, mouseY - 16, 48, 48);
}

function draw() {
  if (gameOver) {
    return;
  }

  tickCountdown();
  tickTimer();

  background(24);
  noStroke();

  drawTargets();

  if (!gameOver) {
    fillTargetSlots();
  }

  drawClickFeedback();
  drawCrosshair();
}

function mousePressed() {
  if (!gameStarted) {
    return;
  }

  let hitTarget = false;

  const isValidClick = savedLevel !== "4" || mouseButton === LEFT;
  if (isValidClick) {
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      const distance = dist(mouseX, mouseY, target.x, target.y);

      if (distance < targetDiameter / 2) {
        clickSound.play();
        if (target.type === "normal") {
          score += 1;
          updateScoreDisplay();
        } else if (target.type === "time") {
          addTime(3);
        } else if (target.type === "gold") {
          score += 5;
          updateScoreDisplay();
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
  }

  if (!hitTarget) {
    missSound.play();
    clickFeedback = {
      x: mouseX,
      y: mouseY,
      color: "red",
      time: millis(),
    };
    subtractTime(2);
  }
}

function windowResized() {
  resizeCanvas(canvasArea.width, canvasArea.height);
  updateTargetDiameter();
  targets.length = 0;
  fillTargetSlots();
}
