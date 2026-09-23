let x = 0;
let vx = 3;

function setup() {
  createCanvas(300, 100);
  noStroke();
  fill(80, 140, 255);
}

function draw() {
  background(240);

  x = x + vx;

  if (x > width + 15) {
    x = -15;
  }

  circle(x, height / 2, 30);
}