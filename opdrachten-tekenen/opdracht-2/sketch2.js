function setup() {
  createCanvas(300, 200);
  stroke(40);
}

function draw() {
  background(220);

let count = 15;
  for(let i = 0; i < count; i++);

    let heighty = 200;
    let y = 5;
    for (let y = 5; y < heighty; y++) {
    fill (0, 0, 0);
    line(0, heighty + y, 250, y); 
    }
}