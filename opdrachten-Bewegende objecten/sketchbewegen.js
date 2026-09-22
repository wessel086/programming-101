let x = 0;  // ← blijft bestaan tussen frames

function setup() {
  createCanvas(300, 100);
  noStroke();
  fill(80, 140, 255);
}

function draw() {
  background(240);

  x = x + 2;  // bouwt voort op de vorige waarde

  circle(x, height / 2, 30);
}