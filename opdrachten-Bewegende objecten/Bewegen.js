let xPositions = [];
let yPositions = [];
let diameters = [];

function setup() {
  createCanvas(320, 200);
  noStroke();
  fill(60);

  for (let i = 0; i < 25; i++) {
    xPositions.push(random(width));
    yPositions.push(random(height));
    diameters.push(random(10, 50));
  }
}

function draw() {
  background(220);

  for (let i = 0; i < xPositions.length; i++) {
    circle(xPositions[i], yPositions[i], diameters[i]);
  }
}