function setup() {
  createCanvas(300, 200);
}

function draw() {
  background(250);

  let count = 12;

  for (let i = 0; i < count; i++) {
    let yLeft = map(i, 0, count - 1, 10, height - 10);
    let yRight = map(i, 0, count - 1, height - 10, 10);

    stroke(80, 140, 255);
    line(10, yLeft, width - 10, yRight);

    stroke(255, 120, 90);
    line(10, yRight, width - 10, yLeft);
  }
}