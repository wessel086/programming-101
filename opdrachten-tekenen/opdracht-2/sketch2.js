function setup() {
  createCanvas(300, 200);
  stroke(40);
}

function draw() {
  background(220);

  let count = 15;

  for (let i = 0; i < count; i++) {
    let yLeft = map(i, 0, count - 1, 10, height - 10);
    let yRight = map(i, 0, count - 1, height - 10, 10);
    line(10, yLeft, width - 10, yRight);
  }
}