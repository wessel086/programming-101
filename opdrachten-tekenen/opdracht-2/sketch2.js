let cirkelsPerRij = 10;

function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);

  let diameter = width / cirkelsPerRij;

  for (let rij = 0; rij < cirkelsPerRij; rij += 1) {
    for (let kolom = 0; kolom < cirkelsPerRij; kolom += 1) {
      let x = diameter / 2 + kolom * diameter;
      let y = diameter / 2 + rij * diameter;

      fill(60);
      circle(x, y, diameter);
    }
  }
}