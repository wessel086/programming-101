function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);
  fill(60);
for (let i = 0; i < 10; i++) {
  circle(20 + i * 40, 100, 30);
}
}