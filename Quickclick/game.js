// Verwijzingen naar HTML-elementen — worden ingesteld in setup(). //!8 
let canvasArea;       // De container waar het canvas in komt
let levelDisplay;     // Toont het huidige level
let scoreDisplay;     // Toont de huidige score
let timerDisplay;     // Toont de resterende tijd
let countdownDisplay; // Toont de aftelling voor het spel begint
let gameOverDisplay;  // Het game-over scherm
let finalScoreDisplay;     // Eindscore op het game-over scherm
let finalHighscoreDisplay; // Highscore op het game-over scherm
let restartButton;    // Knop om opnieuw te spelen
let menuButton;       // Knop om terug naar het menu te gaan
let savedLevel;       // Het gekozen level, opgehaald uit localStorage
let targetLifetimes;  // Hoe lang elk targettype zichtbaar blijft (per level)
let crosshairImg;     // Afbeelding van het dradenkruis
let clickSound;       // Geluid bij een raak klik
let missSound;        // Geluid bij een misser

// Spelstatus — verandert tijdens het spel. //!91
let score = 0;              // Huidige score
let timeLeft = 30;          // Resterende tijd in seconden
let gameStarted = false;    // Of het spel actief bezig is
let gameOver = false;       // Of het spel voorbij is
let targetDiameter;         // Diameter van de targets in pixels
let clickFeedback = null;   // Kleine cirkel die kort verschijnt na een klik
let lastSecond = 0;         // Bijgehouden seconde om de timer per seconde te tikken
let countdownValue = 0;     // Huidig getal in de aftelling
let countdownStartTime = 0; // Tijdstip waarop de aftelling begon
let countingDown = false;   // Of de aftelling bezig is

// Maximum aantal targets tegelijk op het scherm //!2
const maxTargets = 5;

// Lijst met alle actieve targets //!5
const targets = [];

// Hoe lang elk targettype zichtbaar blijft per level (in milliseconden)
const targetLifetimesByLevel = {
  1: { normal: 5000, time: 3000, gold: 3000 },
  2: { normal: 4000, time: 2000, gold: 2000 },
  3: { normal: 3000, time: 1000, gold: 1000 },
  4: { normal: 3000, time: 1000, gold: 1000 },
};

// Berekent de diameter van targets op basis van schermgrootte.
// Level 4 krijgt kleinere targets (60% van normaal).
function updateTargetDiameter() {
  const standardDiameter = windowWidth * 0.1;
  targetDiameter = savedLevel === "4" ? standardDiameter * 0.6 : standardDiameter;
}

// Kiest een willekeurige positie binnen het canvas en bepaalt het targettype.
// Kans: ~6.5% gold (>=100), ~9.3% time (>=90), rest normal. //!7 - return
function setRandomTargetPosition() {
  const radius = targetDiameter / 2;
  const randomX = random(radius, width - radius); //!82 c.l(rx)
  const randomY = random(radius, height - radius);

  const spawnRoll = random(107);
  let type = "normal";

  if (spawnRoll >= 100) {
    type = "gold";
  } else if (spawnRoll >= 90) {
    type = "time";
  }

  // Geeft een object terug met positie, type en spawntijdstip
  return { x: randomX, y: randomY, type, spawnedAt: millis() };
}

// Voegt één nieuw target toe aan de lijst
function spawnTarget() {
  targets.push(setRandomTargetPosition());
}

// Vult de targetlijst aan tot het maximum
function fillTargetSlots() {
  while (targets.length < maxTargets) {
    spawnTarget();
  }
}

// Werkt de timer bij in de header (formaat MM:SS)
function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.html(
    String(minutes).padStart(2, "0") + ":" + String(seconds).padStart(2, "0")
  );
}

// Werkt de score bij in de header
function updateScoreDisplay() {
  scoreDisplay.html("Score: " + score);
}

// Voegt seconden toe aan de timer (groen target bonus) //!72 - parameter, argument, oproepen.
function addTime(seconds) {
  timeLeft += seconds;
  updateTimerDisplay();
}

// Trekt seconden af van de timer. Roept finishGame aan als de tijd op is.
function subtractTime(seconds) {
  timeLeft = Math.max(0, timeLeft - seconds);
  updateTimerDisplay();

  if (timeLeft === 0) { //!9
    finishGame();
  }
}

// Stopt het spel en toont het game-over scherm.
// .style("display", "flex") is nodig omdat .show() van p5 display: block zet,
// waardoor align-items en justify-content niet werken.
// Array.isArray() check voorkomt crash als qc_previous_scores geen array is.
function finishGame() {
  // Voorkomt dat finishGame meerdere keren wordt aangeroepen
  if (gameOver) {
    return;
  }

  gameOver = true;
  gameStarted = false;

  // Sla nieuwe highscore op als de huidige score hoger is //!4
  let highscore = getItem("qc_highscore") ?? 0;
  if (score > highscore) {
    highscore = score;
    storeItem("qc_highscore", highscore);
  }

  // Haal vorige scores op en controleer of het een echte array is
  const rawScores = getItem("qc_previous_scores");
  const scores = Array.isArray(rawScores) ? rawScores : [];

  // Gebruik opgeslagen naam of "Anoniem" als er geen naam is
  const name = (getItem("qc_name") ?? "").trim() || "Anoniem";

  // Voeg de nieuwe score vooraan toe en bewaar maximaal 10 scores
  scores.unshift({ name, score, level: savedLevel });
  storeItem("qc_previous_scores", scores.slice(0, 10));

  finalScoreDisplay.html("Score: " + score);
  finalHighscoreDisplay.html("Highscore: " + highscore);
  gameOverDisplay.style("display", "flex");
}

// Wordt elke frame aangeroepen vanuit draw() om de timer per seconde te tikken
function tickTimer() {
  if (!gameStarted || gameOver) {
    return;
  }

  // Vergelijkt de huidige seconde met de vorige om precies 1x per seconde af te trekken
  const currentSecond = Math.floor(millis() / 1000);
  if (currentSecond !== lastSecond) {
    lastSecond = currentSecond;
    subtractTime(1);
  }
}

// Start het spel na de aftelling: reset score en herstart de timer
function startGame() {
  score = 0;
  updateScoreDisplay();

  // Reset spawntijdstip van bestaande targets zodat ze niet meteen verdwijnen
  for (const target of targets) {
    target.spawnedAt = millis();
  }

  gameStarted = true;
  lastSecond = Math.floor(millis() / 1000);
}

// Toont de countdown gecentreerd via display: flex.
function startCountdown() {
  countdownValue = 5;
  countdownStartTime = millis();
  countingDown = true;
  countdownDisplay.html(countdownValue);
  countdownDisplay.style("display", "flex");
  updateTimerDisplay();
}

// Wordt elke frame aangeroepen vanuit draw() om de aftelling bij te werken
function tickCountdown() {
  if (!countingDown) {
    return;
  }

  const elapsed = Math.floor((millis() - countdownStartTime) / 1000);
  const remaining = 5 - elapsed;

  // Update het getal alleen als het veranderd is
  if (remaining > 0 && remaining !== countdownValue) {
    countdownValue = remaining;
    countdownDisplay.html(countdownValue);
  }

  // Aftelling voorbij: toon "Start!" en start het spel
  if (remaining <= 0 && !gameStarted) {
    countingDown = false;
    countdownDisplay.html("Start!");
    startGame();
    // Verberg de countdown na 500ms zodat "Start!" kort zichtbaar blijft
    setTimeout(() => countdownDisplay.style("display", "none"), 500);
  }
}

// Reset alles en start een nieuw spel
function restartGame() {
  gameOver = false;
  gameStarted = false;
  score = 0;
  timeLeft = 30;
  clickFeedback = null;
  targets.length = 0; // Leegt de array zonder een nieuwe aan te maken

  updateScoreDisplay();
  updateTimerDisplay();
  gameOverDisplay.style("display", "none");
  fillTargetSlots();
  startCountdown();
}

// Laadt afbeeldingen en geluiden voordat setup() wordt uitgevoerd
function preload() {
  crosshairImg = loadImage("fotos/crosshair.png");
  clickSound = loadSound("geluiden/pew.wav");
  missSound = loadSound("geluiden/miss.mp3");
}

// Wordt eenmalig uitgevoerd door p5.js bij het opstarten //!1
function setup() {  
  // Koppel alle HTML-elementen aan variabelen
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

  // Haal het gekozen level op uit localStorage, standaard level 1
  savedLevel = getItem("qc_level") ?? "1";
  targetLifetimes = targetLifetimesByLevel[savedLevel] ?? targetLifetimesByLevel[1];

  levelDisplay.html("Level: " + savedLevel);

  // Maak het canvas aan en plaats het in de game-canvas container
  const canvas = createCanvas(canvasArea.width, canvasArea.height);
  canvas.parent(canvasArea);

  // Voorkom dat rechtermuisklik een contextmenu opent in het canvas
  canvas.elt.addEventListener("contextmenu", (event) => event.preventDefault());

  restartButton.mouseClicked(restartGame);
  menuButton.mouseClicked(() => {
    gameStarted = false;
    gameOver = true;
    window.location.href = "Home.html";
  });

  noCursor(); // Verberg de standaard muiscursor (vervangen door crosshairImg)
  updateTargetDiameter();
  fillTargetSlots();
  startCountdown();
}

// Tekent alle actieve targets en verwijdert verlopen targets
function drawTargets() {
  // Van achter naar voren itereren zodat splice() de index niet verstoort //!6 //!10
  for (let index = targets.length - 1; index >= 0; index -= 1) {
    const target = targets[index];
    const lifetime = targetLifetimes[target.type];

    // Verwijder target als de levensduur verstreken is en trek 2 seconden af
    if (gameStarted && millis() - target.spawnedAt >= lifetime) {
      targets.splice(index, 1);
      subtractTime(2);
      if (gameOver) {
        return; // Stop direct als het spel voorbij is
      }
      continue;
    }

    // Kleur per targettype: grijs = normaal, groen = tijd, goud = bonus
    let targetColor = "gray";
    if (target.type === "time") {
      targetColor = "green";
    } else if (target.type === "gold") {
      targetColor = "gold";
    }
    fill(targetColor);
    circle(target.x, target.y, targetDiameter); //!3
  }
}

// Toont een kleine cirkel op de klikpositie (groen = raak, rood = mis)
function drawClickFeedback() {
  if (clickFeedback && millis() - clickFeedback.time < 300) {
    fill(clickFeedback.color);
    circle(clickFeedback.x, clickFeedback.y, 20);
  }
}

// Tekent het dradenkruis op de muispositie
function drawCrosshair() {
  image(crosshairImg, mouseX - 16, mouseY - 16, 48, 48);
}

// Hoofdlus van p5.js — wordt elke frame uitgevoerd
function draw() {
  // Teken niets als het spel voorbij is
  if (gameOver) {
    return;
  }

  tickCountdown();
  tickTimer();

  background(24); // Donkere achtergrond (bijna zwart)
  noStroke();     // Geen rand om de cirkels

  drawTargets();

  // Vul lege plekken alleen bij als het spel nog bezig is
  if (!gameOver) {
    fillTargetSlots();
  }

  drawClickFeedback();
  drawCrosshair();
}

// Wordt aangeroepen door p5.js bij elke muisklik
function mousePressed() {
  // Negeer klikken voor het spel gestart is
  if (!gameStarted) {
    return;
  }

  let hitTarget = false;

  // Level 4: alleen linkse muisknop telt als geldige klik
  const isValidClick = savedLevel !== "4" || mouseButton === LEFT;
  if (isValidClick) {
    // Van achter naar voren zodat het bovenste target als eerste geraakt wordt
    for (let index = targets.length - 1; index >= 0; index -= 1) {
      const target = targets[index];
      const distance = dist(mouseX, mouseY, target.x, target.y);

      // Controleer of de klik binnen de cirkel valt
      if (distance < targetDiameter / 2) {
        clickSound.play();

        if (target.type === "normal") {
          score += 1;
          updateScoreDisplay();
        } else if (target.type === "time") {
          addTime(3); // Groen target: +3 seconden
        } else if (target.type === "gold") {
          score += 5; // Goud target: +5 punten
          updateScoreDisplay();
        }

        // Groene feedback op de positie van het geraakt target
        clickFeedback = {
          x: target.x,
          y: target.y,
          color: "green",
          time: millis(),
        };

        targets.splice(index, 1); // Verwijder het geraakt target
        fillTargetSlots();
        hitTarget = true;
        break; // Stop na het eerste geraakt target
      }
    }
  }

  // Geen target geraakt: rode feedback en -2 seconden
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

// Wordt aangeroepen door p5.js als het browservenster van grootte verandert
function windowResized() {
  resizeCanvas(canvasArea.width, canvasArea.height);
  updateTargetDiameter(); // Herbereken targetgrootte op basis van nieuwe breedte
  targets.length = 0;     // Verwijder alle targets
  fillTargetSlots();      // Spawn nieuwe targets op de juiste schaalgrootte
}