let x;
let y;
let vx = 2;
let vy = 2;

function setup() {
  createCanvas(300, 200);
  noStroke();
  fill(60);
  x = width / 2;
  y = height / 2;
}

function draw() {
  background(220);

  x = x + vx;
  y = y + vx;

  circle(x, y, 40);
}