function setup() {
  createCanvas(300, 300);
  noStroke();
  fill(60);
}

function draw() {
  background(220);

  let count = 24;
  let cellSize = width / count;

for (let row = 0; row < count; row++) {
  for (let col = 0; col < count; col++) {
    let redValue = map(col, 0, count - 1, 40, 255);
    let greenValue = map(row, 0, count - 1, 40, 255);
    fill(redValue, greenValue, 160);

    if ((row + col) % 2 === 0) {
      square(col * cellSize, row * cellSize, cellSize);
    } else {
      circle(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, cellSize);
    }
  }
}
}