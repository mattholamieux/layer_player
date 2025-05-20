const voices = [
    new Player(),
    new Player()
]
let voice = voices[0]
let topLayer;
let firstClick = true;
let clickCounter = 0;
let t;
let font;
let pts1;
let pts2;
let xz = 0;
let yz = 1000;

function preload() {
    img = loadImage('assets/images/CUATRO.jpg');
    font = loadFont("assets/ViksjoeTrial-Regular.otf");
}


function setup() {
    createCanvas(window.innerWidth, window.innerHeight)
    background(255);
    stroke('yellow');
    strokeWeight(10)
    noFill();
    t = 0;
    pts1 = font.textToPoints('f e a t u r e  c r e e p', 100, 0, 170, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
    });
    voices[0].initialize(0)
    voices[1].initialize(1)
    topLayer = createGraphics(width, height);
    topLayer.erase();
    topLayer.strokeWeight(200)
    frameRate(20)

}

function draw() {
    background(0, 10);
    drawNoiseText();
    topLayer.background(255, 15);
    dice(1000)
    for (let v of voices) {
        v.rampToDelayTime();
        v.rampToReverb();
        if (v.x[0]) {
            if (v.x[1]) {
                const randooo = random(-5, 5);
                v.x[0] += randooo
                v.x[1] += randooo
                topLayer.line(v.x[0], v.y, v.x[1], v.y)
            } else {
                topLayer.line(v.x[0], v.y, mouseX, v.y)
            }
        }
    }
    image(topLayer, 0, 0)
}



function keyPressed() {
    if (key == " ") {
        for (v of voices) {
            v.startStopPlayer()
        }
    }
}

function mousePressed() {
    clickCounter = (clickCounter + 1) % 2;
    voice = voices[clickCounter]
    if (firstClick) {
        initializeTone();
    }
    voice.getPressedPoint(mouseX, mouseY);
    voice.x[0] = mouseX
    voice.x[1] = undefined
    voice.y = mouseY
}


function mouseReleased() {
    if (firstClick) {
        for (v of voices) {
            v.startStopPlayer()
        }
        firstClick = false;
    }
    voice.getReleasePoint(mouseX);
    voice.x[1] = mouseX
}

async function initializeTone() {
    await Tone.start();
    Tone.Transport.start();
    console.log('transport started')
}

function dice(chance) {
    for (let v of voices) {
        let rand = Math.floor(random(0, chance))
        if (rand < 5) {
            v.randomizePitch()
            console.log('randomize pitch')
            console.log(v.player.detune)
        }
    }

}

function ns(x, y, z, scale_, min_, max_) {
    return map(
        noise(x * scale_, y * scale_, z * scale_),
        0, 1, min_, max_);
}

function drawNoiseText() {
    push();
    translate(0, height / 6);
    for (let j = 0; j < 5; j++) {
        let row = j * (height / 5)
        for (let i = 0; i < pts1.length; i++) {
            let xoff = ns(pts1[i].x, pts1[i].y, xz, 0.005, -20, 20);
            let yoff = ns(pts1[i].y, pts1[i].x, yz, 0.005, -20, 20);
            ellipse(pts1[i].x + xoff, (pts1[i].y + row) + yoff, 1, 1);
        }
    }
    pop();
    xz += 5;
    yz += 5;
}