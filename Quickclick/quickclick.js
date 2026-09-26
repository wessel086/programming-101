// --- Element references (global, so later commits can use them too) ---
const nameInput = document.querySelector(".name-input");

function setup() {
  createCanvas(640, 480);
}

function draw() {
  background(20);
}

// --- Save name while typing ---
nameInput.addEventListener("input", () => {
  localStorage.setItem("qc_name", nameInput.value);
});