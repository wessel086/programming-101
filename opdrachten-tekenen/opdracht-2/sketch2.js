let x = 10; // x = aantal cirkels//

function setup() {
  createCanvas(400, 60);
  noStroke();
}

function draw() {
  background(220);

  let diameter = width / x;

  for (let i = 0; i < x; i += 1) {
    let x = diameter / 2 + i * diameter;

    fill(70);
    circle(x, height / 2, diameter);
  }
}