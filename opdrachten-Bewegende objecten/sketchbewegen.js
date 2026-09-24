let x;
let y;
let diameter;

function setup() {
  createCanvas(300, 150);
  noStroke();
  fill(80, 140, 255);

  x = random(width);
  y = random(height);
  diameter = random(20, 60);
}

function draw() {
  background(240);
  circle(x, y, diameter);
}