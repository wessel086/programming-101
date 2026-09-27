const canvasArea = document.querySelector(".game-canvas");
const levelDisplay = document.querySelector(".level");
const scoreDisplay = document.querySelector(".score");
const savedLevel = localStorage.getItem("qc_level") || "1";

levelDisplay.textContent = savedLevel;

let score = 0;
let targetX;
let targetY;
const targetDiameter = 80;

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
