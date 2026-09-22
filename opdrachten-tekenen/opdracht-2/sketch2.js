function setup() {
  createCanvas(240, 240);
  stroke(80, 140, 255);
}

function draw() {
  background(250);

  let count = 20;

  for (let i = 0; i < count; i++) {
    let x = map(i, 0, count - 1, 0, width);
    let y = map(i, 0, count - 1, height, 0);

    line(x, 0, 0, y);
  }
}