function setup() {
  createCanvas(400, 400);
  noStroke();
}

function draw() {
  background(220);

  let count = 10;
  let cellSize = width / count;

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      if ((row + col) % 2 === 0) {
        fill(60);                          // grijs
        square(col * cellSize, row * cellSize, cellSize);
      } else {
        fill(60);                   // rood
        circle(col * cellSize + cellSize / 2, row * cellSize + cellSize / 2, cellSize);
      }
    }
  }
}