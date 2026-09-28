const canvasArea = document.querySelector(".game-canvas");
const levelDisplay = document.querySelector(".level");
const scoreDisplay = document.querySelector(".score");
const timerDisplay = document.querySelector(".timer");
const savedLevel = localStorage.getItem("qc_level") || "1";

levelDisplay.textContent = savedLevel;

let score = 0;
let timeLeft = 30;
let timerInterval;
let targetX;
let targetY;
const targetDiameter = 80;

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function startTimer() {
  updateTimerDisplay();
  timerInterval = setInterval(() => {
    timeLeft -= 1;
    updateTimerDisplay();

    if (timeLeft === 0) {
      clearInterval(timerInterval);
    }
  }, 1000);
}

startTimer();

function setup() {
  const canvas = createCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  canvas.parent(canvasArea);

  targetX = width / 2;
  targetY = height / 2;
}

function draw() {
  background(24);
  fill("gray");
  noStroke();
  circle(targetX, targetY, targetDiameter);
}

function mousePressed() {
  const distance = dist(mouseX, mouseY, targetX, targetY);

  if (distance < targetDiameter / 2) {
    score = score + 1;
    scoreDisplay.textContent = `Score: ${score}`;
  }
}

function windowResized() {
  resizeCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
}
