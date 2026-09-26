function setup() {
  createCanvas(640, 480);
  // --- Element references ---
const nameInput = document.querySelector(".name-input");

// --- Save name while typing ---
nameInput.addEventListener("input", () => {
localStorage.setItem("qc_name", nameInput.value);
}
}

function draw() {
  background(20);
}