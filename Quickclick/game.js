// Selectors en opgeslagen waarden — worden ingesteld in setup().
let canvasArea;
let levelDisplay;
let scoreDisplay;
let timerDisplay;
let countdownDisplay;
let gameOverDisplay;
let finalScoreDisplay;
let finalHighscoreDisplay;
let restartButton;
let menuButton;
let savedLevel;
let targetLifetimes;
let crosshairImg;
let clickSound;
let missSound;

// Bewaart de score, tijd, targets en instellingen die tijdens het spel veranderen.
let score = 0;
let timeLeft = 30;
let gameStarted = false;
let gameOver = false;
let targetDiameter;
let clickFeedback = null;
let lastSecond = 0;
let countdownValue = 0;
let countdownStartTime = 0;
let countingDown = false;

const maxTargets = 5;
const targets = [];
const targetLifetimesByLevel = {
  1: { normal: 5000, time: 3000, gold: 3000 },
  2: { normal: 4000, time: 2000, gold: 2000 },
  3: { normal: 3000, time: 1000, gold: 1000 },
  4: { normal: 3000, time: 1000, gold: 1000 },
};

// Berekent de targetgrootte op basis van het scherm en maakt targets kleiner in level 4.
function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter = savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
}

// Kiest een willekeurige plek en een targettype voor een nieuw target.
function setRandomTargetPosition() {
  const radius = targetDiameter / 2;
  const randomX = random(radius, width - radius);
  const randomY = random(radius, height - radius);

  const spawnRoll = random(107);
  let type = "normal";

  if (spawnRoll >= 100) {
    type = "gold";
  } else if (spawnRoll >= 90) {
    type = "time";
  }

  return { x: randomX, y: randomY, type, spawnedAt: millis() };
}

// Maakt één target en voegt het toe aan de lijst met actieve targets.
function spawnTarget() {
  targets.push(setRandomTargetPosition());
}

// Vult lege plekken aan totdat er maximaal vijf targets tegelijk zijn.
function fillTargetSlots() {
  while (targets.length < maxTargets) {
    spawnTarget();
  }
}

// Zet de resterende tijd om naar minuten en seconden en toont die in beeld.
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.html(
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

// Werkt de scoretekst bij.
function updateScoreDisplay() {
  scoreDisplay.html("Score: " + score);
}

// Geeft seconden bij de timer op en werkt de weergave meteen bij.
function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

// Haalt seconden van de timer af, zonder dat de tijd onder nul komt.
function subtractTime(seconds) {
  timeLeft = Math.max(0, timeLeft - seconds);
  updateTimerDisplay();

  if (timeLeft === 0) {
    finishGame();
  }
}

// Stopt het spel en toont de eindscore en de nieuwe highscore.
function finishGame() {
  if (gameOver) {
    return;
  }

  gameOver = true;
  gameStarted = false;

  let highscore = getItem("qc_highscore") ?? 0;
  if (score > highscore) {
    highscore = score;
    storeItem("qc_highscore", highscore);
  }

  const scores = getItem("qc_previous_scores") ?? [];
  const name = (getItem("qc_name") ?? "").trim() || "Anoniem";
  scores.unshift({ name, score, level: savedLevel });
  storeItem("qc_previous_scores", scores.slice(0, 10));

  finalScoreDisplay.html("Score: " + score);
  finalHighscoreDisplay.html("Highscore: " + highscore);
  gameOverDisplay.show();
}

// Telt elke seconde af via draw().
function tickTimer() {
  if (!gameStarted || gameOver) {
    return;
  }

  const currentSecond = Math.floor(millis() / 1000);
  if (currentSecond !== lastSecond) {
    lastSecond = currentSecond;
    subtractTime(1);
  }
}

// Zet de score klaar en start de timer nadat de countdown is afgelopen.
function startGame() {
  score = 0;
  updateScoreDisplay();
  for (const target of targets) {
    target.spawnedAt = millis();
  }
  gameStarted = true;
  lastSecond = Math.floor(millis() / 1000);
}

// Telt vijf seconden af met millis() en start daarna het spel.
function startCountdown() {
  countdownValue = 5;
  countdownStartTime = millis();
  countingDown = true;
  countdownDisplay.html(countdownValue);
  countdownDisplay.show();
  updateTimerDisplay();
}

function tickCountdown() {
  if (!countingDown) {
    return;
  }

  const elapsed = Math.floor((millis() - countdownStartTime) / 1000);
  const remaining = 5 - elapsed;

  if (remaining > 0 && remaining !== countdownValue) {
    countdownValue = remaining;
    countdownDisplay.html(countdownValue);
  }

  if (remaining <= 0 && !gameStarted) {
    countingDown = false;
    countdownDisplay.html("Start!");
    startGame();
    setTimeout(() => countdownDisplay.hide(), 500);
  }
}

// Zet de score en tijd terug en start hetzelfde level opnieuw.
function restartGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  timeLeft = 30;
  clickFeedback = null;
  targets.length = 0;

  updateScoreDisplay();
  updateTimerDisplay();
  gameOverDisplay.hide();
  fillTargetSlots();
  startCountdown();
}

// Laadt de crosshair afbeelding voordat het spel start.
function preload() {
  crosshairImg = loadImage("fotos/crosshair.png");
  clickSound = loadSound("geluiden/pew.wav");
  missSound = loadSound("geluiden/miss.mp3");
}

// Maakt het canvas, koppelt de knoppen en start de countdown.
function setup() {
  canvasArea = select(".game-canvas");
  levelDisplay = select(".level");
  scoreDisplay = select(".score");
  timerDisplay = select(".timer");
  countdownDisplay = select(".countdown");
  gameOverDisplay = select(".game-over");
  finalScoreDisplay = select(".final-score");
  finalHighscoreDisplay = select(".final-highscore");
  restartButton = select(".restart-button");
  menuButton = select(".menu-button");

  savedLevel = getItem("qc_level") ?? "1";
  targetLifetimes = targetLifetimesByLevel[savedLevel] ?? targetLifetimesByLevel[1];

  levelDisplay.html(savedLevel);

  const canvas = createCanvas(canvasArea.width, canvasArea.height);
  canvas.parent(canvasArea);
  canvas.elt.addEventListener("contextmenu", (event) => event.preventDefault());

  restartButton.mouseClicked(restartGame);
  menuButton.mouseClicked(() => {
    gameStarted = false;
    gameOver = true;
    window.location.href = "Home.html";
  });

  noCursor();
  updateTargetDiameter();
  fillTargetSlots();
  startCountdown();
}

// Tekent elk frame de targets en verwijdert targets die te lang zijn blijven staan.
function draw() {
  if (gameOver) {
    return;
  }

  tickCountdown();
  tickTimer();

  background(24);
  noStroke();

  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    const lifetime = targetLifetimes[target.type];

    if (gameStarted && millis() - target.spawnedAt >= lifetime) {
      targets.splice(index, 1);
      subtractTime(2);
      if (gameOver) {
        return;
      }
      continue;
    }

    let targetColor = "gray";
    if (target.type === "time") {
      targetColor = "green";
    } else if (target.type === "gold") {
      targetColor = "gold";
    }
    fill(targetColor);
    circle(target.x, target.y, targetDiameter);
  }

  if (clickFeedback && millis() - clickFeedback.time < 300) {
    fill(clickFeedback.color);
    circle(clickFeedback.x, clickFeedback.y, 20);
  }

  if (!gameOver) {
    fillTargetSlots();
  }

  // Tekent de crosshair op de muispositie.
  image(crosshairImg, mouseX - 16, mouseY - 16, 48, 48);
}

// Controleert of de speler een target raakt en geeft de bijbehorende beloning.
function mousePressed() {
  if (!gameStarted) {
    return;
  }

  let hitTarget = false;

  const isValidClick = savedLevel !== "4" || mouseButton === LEFT;
  if (isValidClick) {
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      const distance = dist(mouseX, mouseY, target.x, target.y);

      if (distance < targetDiameter / 2) {
        clickSound.play();
        if (target.type === "normal") {
          score += 1;
          updateScoreDisplay();
        } else if (target.type === "time") {
          addTime(3);
        } else if (target.type === "gold") {
          score += 5;
          updateScoreDisplay();
        }
        clickFeedback = {
          x: target.x,
          y: target.y,
          color: "green",
          time: millis(),
        };
        targets.splice(index, 1);
        fillTargetSlots();
        hitTarget = true;
        break;
      }
    }
  }

if (!hitTarget) {
  missSound.play();
  clickFeedback = {
    x: mouseX,
    y: mouseY,
    color: "red",
    time: millis(),
  };
  subtractTime(2);
}
}

// Past het canvas en de targets aan wanneer het browservenster van formaat verandert.
function windowResized() {
  resizeCanvas(canvasArea.width, canvasArea.height);
  updateTargetDiameter();
  targets.length = 0;
  fillTargetSlots();
}
