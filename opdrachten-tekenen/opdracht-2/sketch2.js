const circlePositionsX = [];const circlePositionsY = [];
const circleAmount = 50;
function setup() {
    createCanvas(500, 500);

    background(100);

    fill(100, 255, 0);

    for (let i = 0; i < circleAmount; i++) {
        circlePositionsX[i] = random(width);
        circlePositionsY[i] = random(height);
    }
}
function draw() {
    for (let i = 0; i < circleAmount; i++)
        circle(circlePositionsX[i],
            circlePositionsY[i],
            80);
}
