function setup() {
  createCanvas(300, 300);
  noStroke();
}

function draw() {
  background(220);
  fill(255, 120, 90);
  rect(80, 100, 50, 50);
  circle(200, 100, 40);
  ellipse(200, 200, 50, 30);
  strokeWeight(2);
  stroke(20)
  line(100,50,200,100);
  triangle(20,20,0,40,60,60);
  rect(170, 30, 100, 60, 14);  // ronde hoeken
}
