let x = 20;
let y = 20;
let vx = 2;
let vy = 1.2;

function setup() {
  createCanvas(300, 200);
  noStroke();
  fill(80, 140, 255);
}

function draw() {
  background(240);

  x = x + vx;
  y = y + vy;

  circle(x, y, 30);
}