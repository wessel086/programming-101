function setup() {
  createCanvas(400, 80);
  noStroke();
}

function draw() {
  background(220);

  let count = 24;
  let diameter = width / count;

  for (let i = 0; i < count; i++) {
    let redValue = map(i, 0, count - 1, 0, 255); //map(value, fromMin, fromMax, toMin, toMax)//
    //i zit in de loop, dus i + 1 tot i=24-1 (23) 23 is de max in de loop, 255 is de max kleurcode. een map() is dus iets anders dan een for loop.//
    fill(redValue, 0, 0);
    circle(diameter / 2 + i * diameter, height / 2, diameter);
  }
}
