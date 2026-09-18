function setup() {
  createCanvas(400, 80);
  noStroke();
}

function draw() {
  background(220);

  let count = 24;
  let diameter = width / count;

  for (let i = 0; i < count; i++) {
    let redValue = map(i, 0, count - 1, 0, 255);
    fill(redValue, 0, 0);
    circle(diameter / 2 + i * diameter, height / 2, diameter);
  }
}