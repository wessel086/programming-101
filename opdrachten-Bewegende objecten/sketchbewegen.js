let x, y, vx, vy, diameter, gray;

function setup() {
  createCanvas(300, 180);
  noStroke();

  x = random(width);
  y = random(height);
  vx = random(-3, 3);
  vy = random(-3, 3);
  diameter = random(20, 50);
  gray = random(60, 200);
}

function draw() {
  background(240);

  x += vx;
  y += vy;

  // Weer in beeld brengen
  if (x < -diameter) x = width + diameter;
  if (x > width + diameter) x = -diameter;
  if (y < -diameter) y = height + diameter;
  if (y > height + diameter) y = -diameter;

  fill(gray);
  circle(x, y, diameter);
}