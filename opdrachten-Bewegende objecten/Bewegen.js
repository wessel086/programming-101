let balls = [];

function setup() {
  createCanvas(320, 200);
  noStroke();

  for (let i = 0; i < 25; i++) {
    balls.push({
      x: random(width),
      y: random(height),
      diameter: random(10, 50),
      vx: random(-1.5, 1.5),
      vy: random(-1.5, 1.5),
      gray: random(40, 200) 
    });
  }
}

function draw() {
  background(220);

  for (let ball of balls) {
    ball.x += ball.vx;
    ball.y += ball.vy;

    if (ball.x < -ball.diameter) ball.x = width + ball.diameter;
    if (ball.x > width + ball.diameter) ball.x = -ball.diameter;
    if (ball.y < -ball.diameter) ball.y = height + ball.diameter;
    if (ball.y > height + ball.diameter) ball.y = -ball.diameter;

    fill(ball.gray);
    circle(ball.x, ball.y, ball.diameter);
  }
}