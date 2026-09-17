function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);
  fill(60);
  circle(width / 2, height / 2, max(width, height));
}