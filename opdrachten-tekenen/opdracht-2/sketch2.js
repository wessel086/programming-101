let kolommen = 10;
let rijen = 10;

function setup() {
  createCanvas(400, 200);
  noStroke();
}

function draw() {
  background(220);

  let celBreedte = width / kolommen;
  let celHoogte = height / rijen;

  for (let rij = 0; rij < rijen; rij += 1) {
    for (let kolom = 0; kolom < kolommen; kolom += 1) {
      let x = celBreedte / 2 + kolom * celBreedte;
      let y = celHoogte / 2 + rij * celHoogte;

      fill(60);
      ellipse(x, y, celBreedte, celHoogte);
    }
  }
}