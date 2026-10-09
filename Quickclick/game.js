// Verwijzingen naar HTML-elementen — worden ingesteld in setup().
let canvasArea;
let levelDisplay;
let scoreDisplay;
let comboDisplay;
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

// Spelstatus — verandert tijdens het spel.
let score = 0;
let combo = 0;
let timeLeft = 30;
let gameEndTime = 0;
let gameStarted = false;
let gameOver = false;
let targetDiameter;
let clickFeedback = null;
let countdownValue = 0;
let countdownStartTime = 0;
let countingDown = false;

// Grootte van de cursor-PNG.
const crosshairSize = 48;

// Maximum aantal targets tegelijk op het scherm.
const maxTargets = 5;

// Lijst met alle actieve targets.
const targets = [];

// Hoe lang elk targettype zichtbaar blijft per level in milliseconden.
const targetLifetimesByLevel = {
  1: { normal: 5000, time: 3000, gold: 3000 },
  2: { normal: 4000, time: 2000, gold: 2000 },
  3: { normal: 3000, time: 1000, gold: 1000 },
  4: { normal: 3000, time: 1000, gold: 1000 },
};

// Berekent de diameter van targets op basis van schermgrootte.
function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter = savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
}

// Kiest een willekeurige positie binnen het canvas en bepaalt het targettype.
function setRandomTargetPosition() {
  const radius = targetDiameter / 2;
  const minimumDistance = targetDiameter * 1.2;

  let randomX;
  let randomY;
  let positionIsFree = false;
  let attempts = 0;

  while (!positionIsFree && attempts < 50) {
    randomX = random(radius, width - radius);
    randomY = random(radius, height - radius);

    positionIsFree = targets.every((target) => {
      const distance = dist(randomX, randomY, target.x, target.y);
      return distance >= minimumDistance;
    });

    attempts += 1;
  }

  const spawnRoll = random(107);
  let type = "normal";

  if (spawnRoll >= 100) {
    type = "gold";
  } else if (spawnRoll >= 90) {
    type = "time";
  }

  return {
    x: randomX,
    y: randomY,
    type,
    spawnedAt: millis(),
  };
}

// Voegt één nieuw target toe aan de lijst.
function spawnTarget() {
  targets.push(setRandomTargetPosition());
}

// Vult de targetlijst aan tot het maximum.
function fillTargetSlots() {
  while (targets.length < maxTargets) {
    spawnTarget();
  }
}

// Werkt de timer bij in de header.
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  timerDisplay.html(
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

// Werkt de score bij in de header.
function updateScoreDisplay() {
  scoreDisplay.html("Score: " + score);
}

// Toont de combo en scorevermenigvuldiger.
function updateComboDisplay() {
  comboDisplay.html("Combo: x" + Math.max(1, combo));
}

// Berekent hoeveel hele seconden er nog over zijn.
function updateTimeLeft() {
  timeLeft = Math.max(0, Math.ceil((gameEndTime - millis()) / 1000));
}

// Voegt seconden toe aan de timer.
function addTime(seconds) {
  gameEndTime += seconds * 1000;
  updateTimeLeft();
  updateTimerDisplay();
}

// Trekt seconden af van de timer.
function subtractTime(seconds) {
  gameEndTime = Math.max(millis(), gameEndTime - seconds * 1000);
  updateTimeLeft();
  updateTimerDisplay();

  if (timeLeft === 0) {
    finishGame();
  }
}

// Stopt het spel en toont het game-over scherm.
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

  const rawScores = getItem("qc_previous_scores");
  const scores = Array.isArray(rawScores) ? rawScores : [];

  const name = (getItem("qc_name") ?? "").trim() || "Anoniem";

  scores.unshift({
    name,
    score,
    level: savedLevel,
  });

  storeItem("qc_previous_scores", scores.slice(0, 10));

  finalScoreDisplay.html("Score: " + score);
  finalHighscoreDisplay.html("Highscore: " + highscore);
  gameOverDisplay.style("display", "flex");
}

// Wordt elke frame aangeroepen om de timer bij te werken.
function tickTimer() {
  if (!gameStarted || gameOver) {
    return;
  }

  const previousTimeLeft = timeLeft;
  updateTimeLeft();

  if (timeLeft !== previousTimeLeft) {
    updateTimerDisplay();
  }

  if (timeLeft === 0) {
    finishGame();
  }
}

// Start het spel na de aftelling.
function startGame() {
  score = 0;
  combo = 0;

  updateScoreDisplay();
  updateComboDisplay();

  for (const target of targets) {
    target.spawnedAt = millis();
  }

  gameEndTime = millis() + timeLeft * 1000;
  gameStarted = true;
}

// Start de aftelling.
function startCountdown() {
  countdownValue = 5;
  countdownStartTime = millis();
  countingDown = true;

  countdownDisplay.html(countdownValue);
  countdownDisplay.style("display", "flex");

  updateTimerDisplay();
}

// Werkt de aftelling bij.
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

    setTimeout(() => {
      countdownDisplay.style("display", "none");
    }, 500);
  }
}

// Reset alles en start een nieuw spel.
function restartGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  combo = 0;
  timeLeft = 30;
  gameEndTime = 0;
  clickFeedback = null;
  targets.length = 0;

  updateScoreDisplay();
  updateComboDisplay();
  updateTimerDisplay();

  gameOverDisplay.style("display", "none");

  fillTargetSlots();
  startCountdown();
}

// Laadt afbeeldingen en geluiden voordat setup() wordt uitgevoerd.
function preload() {
  crosshairImg = loadImage("fotos/crosshair.png");
  clickSound = loadSound("geluiden/pew.wav");
  missSound = loadSound("geluiden/miss.mp3");
}

// Wordt eenmalig uitgevoerd door p5.js bij het opstarten.
function setup() {
  canvasArea = select(".game-canvas");
  levelDisplay = select(".level");
  scoreDisplay = select(".score");
  comboDisplay = select(".combo");
  timerDisplay = select(".timer");
  countdownDisplay = select(".countdown");
  gameOverDisplay = select(".game-over");
  finalScoreDisplay = select(".final-score");
  finalHighscoreDisplay = select(".final-highscore");
  restartButton = select(".restart-button");
  menuButton = select(".menu-button");

  savedLevel = getItem("qc_level") ?? "1";
  targetLifetimes = targetLifetimesByLevel[savedLevel] ?? targetLifetimesByLevel[1];

  levelDisplay.html("Level: " + savedLevel);
  updateComboDisplay();

  const canvas = createCanvas(canvasArea.width, canvasArea.height);
  canvas.parent(canvasArea);

  canvas.elt.addEventListener("contextmenu", (event) => {
    event.preventDefault();
  });

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

// Tekent alle actieve targets en verwijdert verlopen targets.
function drawTargets() {
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    const lifetime = targetLifetimes[target.type];

    if (gameStarted && millis() - target.spawnedAt >= lifetime) {
      targets.splice(index, 1);

      combo = 0;
      updateComboDisplay();
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
}

// Toont een kleine cirkel op de klikpositie.
function drawClickFeedback() {
  if (clickFeedback && millis() - clickFeedback.time < 300) {
    fill(clickFeedback.color);
    circle(clickFeedback.x, clickFeedback.y, 20);
  }
}

// Tekent het dradenkruis precies gecentreerd op de muispositie.
function drawCrosshair() {
  const halfCrosshairSize = crosshairSize / 2;

  image(
    crosshairImg,
    mouseX - halfCrosshairSize,
    mouseY - halfCrosshairSize,
    crosshairSize,
    crosshairSize
  );
}

// Hoofdlus van p5.js.
function draw() {
  if (gameOver) {
    return;
  }

  tickCountdown();
  tickTimer();

  background(24);
  noStroke();

  drawTargets();

  if (!gameOver) {
    fillTargetSlots();
  }

  drawClickFeedback();
  drawCrosshair();
}

// Wordt aangeroepen door p5.js bij elke muisklik.
function mousePressed() {
  if (!gameStarted) {
    return;
  }

  let hitTarget = false;

  // Level 4: alleen linkermuisknop telt.
  const isValidClick = savedLevel !== "4" || mouseButton === LEFT;

  if (isValidClick) {
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      const distance = dist(mouseX, mouseY, target.x, target.y);

      if (distance < targetDiameter / 2) {
        clickSound.play();

        combo += 1;
        updateComboDisplay();

        if (target.type === "normal") {
          score += combo;
          updateScoreDisplay();
        } else if (target.type === "time") {
          addTime(3);
        } else if (target.type === "gold") {
          score += 5 * combo;
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
    combo = 0;
    updateComboDisplay();

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

// Wordt aangeroepen wanneer het browservenster verandert van grootte.
function windowResized() {
  resizeCanvas(canvasArea.width, canvasArea.height);

  updateTargetDiameter();

  targets.length = 0;
  fillTargetSlots();
}