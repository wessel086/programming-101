const canvasArea = document.querySelector(".game-canvas");
const levelDisplay = document.querySelector(".level");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");
const countdownDisplay = document.querySelector(".countdown");
const savedLevel = localStorage.getItem("qc_level") || "1";

levelDisplay.textContent = savedLevel;

let score = 0;
let timeLeft = 30;
let timerInterval;
let gameStarted = false;
let targetDiameter;
const maxTargets = 5;
const targets = [];
const normalTargetLifetime = 5000;
const timeTargetLifetime = 3000;
const goldTargetLifetime = 3000;

function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter =
    savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
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
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

function startTimer() {
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

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

function startCountdown() {
  let countdown = 5;
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
    setTimeout(() => countdownDisplay.remove(), 500);
  }, 1000);
}

startCountdown();

function setup() {
  const canvas = createCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  canvas.parent(canvasArea);

  updateTargetDiameter();
  fillTargetSlots();
}

function draw() {
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

    if (millis() - target.spawnedAt >= lifetime) {
      targets.splice(index, 1);
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

  fillTargetSlots();
}

function mousePressed() {
  if (!gameStarted) {
    return;
  }

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
      targets.splice(index, 1);
      fillTargetSlots();
      break;
    }
  }
}

function windowResized() {
  resizeCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  updateTargetDiameter();
  targets.length = 0;
  fillTargetSlots();
}
