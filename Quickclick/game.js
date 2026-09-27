const canvasArea = document.querySelector(".game-canvas");
const levelDisplay = document.querySelector(".level");
const savedLevel = localStorage.getItem("qc_level") || "1";

levelDisplay.textContent = savedLevel;

function setup() {
  const canvas = createCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
  canvas.parent(canvasArea);
}

function draw() {
  background(24);
}

function windowResized() {
  resizeCanvas(canvasArea.clientWidth, canvasArea.clientHeight);
}
