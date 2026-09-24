let xPositions = [];
let speeds = [];
let sizes = [];
let grayShades = [];

function setup() {
  createCanvas(360, 160);
  noStroke();

  for (let i = 0; i < 10; i++) {
    xPositions.push(random(width));
    speeds.push(random(0.5, 3));
    sizes.push(random(15, 45));
    grayShades.push(random(60, 220));
  }
}

function draw() {
  background(240);

  for (let i = 0; i < xPositions.length; i++) {
    xPositions[i] += speeds[i];
    if (xPositions[i] > width + sizes[i]) {
      xPositions[i] = -sizes[i];
    }

    fill(grayShades[i]);
    circle(xPositions[i], height / 2, sizes[i]);
  }
}