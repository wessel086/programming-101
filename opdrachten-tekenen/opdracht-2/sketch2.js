function setup() {
  createCanvas(300, 200);
}

function draw() {
  background(220);
  stroke(255, 0, 0);

  let count = 15;

  for (let i = 0; i < count; i++) {
    line(10, 10 + i * ((200-10)/count ), 290, 190 - i * ((200-10)/count));
  }
}