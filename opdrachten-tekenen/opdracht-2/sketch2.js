function setup() {
  createCanvas(300, 200);
  stroke(250, 0, 0);
}

function draw() {
  background(220);

  let count = 15;

  for (let i = 0; i < count; i++) {
    let y = 10 + i * ((height - 20) / (count - 1));
    line(10, y, width - 10, y);
  }
}