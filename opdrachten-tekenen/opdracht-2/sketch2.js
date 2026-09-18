function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);

  let aantal = 12;
  let grootte = width / aantal;

  for (let rij = 0; rij < aantal; rij++) {
    for (let kolom = 0; kolom < aantal; kolom++) {
      let rood = map(kolom, 0, aantal - 1, 0, 255);

      fill(rood, 0, 0);

      let x = grootte / 2 + kolom * grootte;
      let y = grootte / 2 + rij * grootte;

      circle(x, y, grootte);
    }
  }
}