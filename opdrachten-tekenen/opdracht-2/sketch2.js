function setup() {
  createCanvas(400, 400);
  noStroke();
  fill(60);
}

function draw() {
  background(220);

  let count = 10;
  let cellSize = width / count;
 for (let row = 0; row < count; row++) {
  for (let col = 0; col < count; col++) {
    if (col % 2 === 0) {
      square(col * cellSize, row * cellSize, cellSize);
    } else {
      circle(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, cellSize);
    }
  }
 }
}