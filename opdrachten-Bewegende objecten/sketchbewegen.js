let x;
let y;
let vx = 2;

function setup() {
  createCanvas(300, 120);
  noStroke();
  fill(60);

  x = width / 2;
  y = height / 2;
}

function draw() {
  background(220);

  x = x + vx;

  if (x > width + 20) {
    x = -20;
  }

  circle(x, y, 40);
}