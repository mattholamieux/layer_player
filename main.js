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
    createCanvas(window.innerWidth / 2, window.innerHeight - 100)
    background(255);
    stroke('yellow');
    strokeWeight(5)
    noFill();
    t = 0;
    pts1 = font.textToPoints('t y p e / t o k e n', 20, 0, 70, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
    });
    pts2 = font.textToPoints('f e a t u r e  c r e e p', 20, 0, 70, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
    });
    voices[0].initialize(0)
    voices[1].initialize(1)
    topLayer = createGraphics(width, height);
    topLayer.erase();
    topLayer.strokeWeight(100)
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
    clickCounter++
    voice = voices[clickCounter % 2]
    if (clickCounter == 1) {
        initializeTone();
    }
    voice.getPressedPoint(mouseX, mouseY);
    voice.x[0] = mouseX
    voice.x[1] = undefined
    voice.y = mouseY
}


function mouseReleased() {
    if (clickCounter == 1 || clickCounter == 2) {
        voice.startStopPlayer()
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
    translate(0, 100);
    for (let j = 0; j < 6; j++) {
        let row = j * (height / 6)
        if (j % 2 == 0) {
            for (let i = 0; i < pts1.length; i++) {
                let xoff = ns(pts1[i].x, pts1[i].y, xz, 0.005, -20, 20);
                let yoff = ns(pts1[i].y, pts1[i].x, yz, 0.005, -20, 20);
                ellipse(pts1[i].x + xoff, (pts1[i].y + row) + yoff, 1, 1);
            }
        } else {
            for (let i = 0; i < pts2.length; i++) {
                let xoff = ns(pts2[i].x, pts2[i].y, xz, 0.005, -20, 20);
                let yoff = ns(pts2[i].y, pts2[i].x, yz, 0.005, -20, 20);
                ellipse(pts2[i].x + xoff, (pts2[i].y + row) + yoff, 1, 1);
            }
        }
    }
    pop();
    xz += 5;
    yz += 5;
}