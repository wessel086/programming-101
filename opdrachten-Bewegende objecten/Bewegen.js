let x = 60;
let y = 50;
let vx = 3.5;
let vy = 2.4;
let diameter = 36;

function setup() {
  createCanvas(320, 200);
  noStroke();
  fill(60);
}

function draw() {
  background(220);

  x = x + vx;
  y = y + vy;

  let radius = diameter / 2;

  if (x - radius < 0) {
    x = radius;
    vx = -vx;
  }
  if (x + radius > width) {
    x = width - radius;
    vx = -vx;
  }
  if (y - radius < 0) {
    y = radius;
    vy = -vy;
  }
  if (y + radius > height) {
    y = height - radius;
    vy = -vy;
  }

  circle(x, y, diameter);
}