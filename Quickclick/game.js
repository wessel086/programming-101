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
let targetX;
let targetY;
const targetDiameter = 80;

function setRandomTargetPosition() {
  const radius = targetDiameter / 2;
  const randomX = random(radius, width - radius);
  const randomY = random(radius, height - radius);

  targetX = randomX;
  targetY = randomY;
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
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

  setRandomTargetPosition();
}

function draw() {
  background(24);
  fill("gray");
  noStroke();
  circle(targetX, targetY, targetDiameter);
}

function mousePressed() {
  if (!gameStarted) {
    return;
  }

  const distance = dist(mouseX, mouseY, targetX, targetY);

  if (distance < targetDiameter / 2) {
    score = score + 1;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function windowResized() {
  resizeCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
}
