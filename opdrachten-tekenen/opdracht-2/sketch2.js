function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);

  let count = 12;
  let diameter = width / count;

  for (let row = 0; row < count; row++) {
    for (let col = 0; col < count; col++) {
      let value = map(col, 0, count - 1, 0, 255);

let perBlock = count / 3;

if (row < perBlock) {
  fill(value, 0, 0);
} else if (row < perBlock * 2) {
  fill(0, value, 0);
} else {
  fill(0, 0, value);
}

      circle(diameter / 2 + col * diameter, diameter / 2 + row * diameter, diameter);
    }
  }
}let perBlock = count / 3;


//deze was pittig, maar na veel hulp en tweaks, eindelijk hem kunnen toveren//