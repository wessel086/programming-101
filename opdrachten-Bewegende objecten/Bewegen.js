let ball = { x: 60, y: 40, vx: 3.2, vy: 2.8, diameter: 28 };
let paddle = { x: 120, y: 0, width: 80, height: 12, speed: 5 };

function setup() {
  createCanvas(320, 200);
  noStroke();
  paddle.y = height - 28;
}

function draw() {
  background(220);

  updateBall();
  updatePaddle();
  checkPaddleCollision();

  fill(60);
  circle(ball.x, ball.y, ball.diameter);
  fill(80, 140, 255);
  rect(paddle.x, paddle.y, paddle.width, paddle.height, 4);
}

function updateBall() {
  ball.x += ball.vx;
  ball.y += ball.vy;
  let radius = ball.diameter / 2;
  if (ball.x - radius < 0)      { ball.x = radius;          ball.vx = -ball.vx; }
  if (ball.x + radius > width)  { ball.x = width - radius;  ball.vx = -ball.vx; }
  if (ball.y - radius < 0)      { ball.y = radius;          ball.vy = -ball.vy; }
  if (ball.y + radius > height) { ball.y = height - radius; ball.vy = -ball.vy; }
}

function updatePaddle() {
  let vx = 0;

  if (keyIsDown(LEFT_ARROW))  vx = -paddle.speed;
  if (keyIsDown(RIGHT_ARROW)) vx = paddle.speed;

  paddle.x = constrain(paddle.x + vx, 0, width - paddle.width);
}

function checkPaddleCollision() {
  let radius = ball.diameter / 2;
  if (ball.y + radius > paddle.y && ball.y < paddle.y + paddle.height &&
      ball.x > paddle.x && ball.x < paddle.x + paddle.width && ball.vy > 0) {
    ball.y = paddle.y - radius;
    ball.vy = -ball.vy;
  }
}