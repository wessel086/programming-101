let ball = { x: 60, y: 40, vx: 3.2, vy: 2.8, diameter: 28 };
let paddle = { x: 0, y: 0, width: 80, height: 12 };

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
  let center = constrain(mouseX, paddle.width / 2, width - paddle.width / 2);
  paddle.x = center - paddle.width / 2;
}

function checkPaddleCollision() {
  let radius = ball.diameter / 2;

  let hitsVertically = ball.y + radius > paddle.y && ball.y < paddle.y + paddle.height;
  let hitsHorizontally = ball.x > paddle.x && ball.x < paddle.x + paddle.width;
  let movingDown = ball.vy > 0;

  if (hitsVertically && hitsHorizontally && movingDown) {
    ball.y = paddle.y - radius;   // netjes bovenop zetten
    ball.vy = -ball.vy;       // dan pas omkeren
  }
}