const voices = [
    new Player(),
    new Player()
]
let voice = voices[0]
let ghost = voices[1]
let img, topLayer;
let firstClick = true;
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
    pts1 = font.textToPoints('f e a t u r e  c r e e p', 0, 0, 170, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
    });
    pts2 = font.textToPoints('f e a t u r e  c r e e p', 0, 0, 170, {
        sampleFactor: 0.2,
        simplifyThreshold: 0
    });
    voice.initialize(0)
    ghost.initialize(1)
    topLayer = createGraphics(width, height);
    topLayer.erase();
    topLayer.strokeWeight(200)
    frameRate(20)

}

function draw() {
    background(0, 10);
    push();
    translate(0, height / 6);
    for (let j = 0; j < 4; j++) {
        let row = j * (height / 4)
        for (let i = 0; i < pts1.length; i++) {
            let xoff = ns(pts1[i].x, pts1[i].y, xz, 0.005, -20, 20);
            let yoff = ns(pts1[i].y, pts1[i].x, yz, 0.005, -20, 20);
            ellipse(pts1[i].x + xoff, (pts1[i].y + row) + yoff, 1, 1);
        }
    }
    pop();

    topLayer.background(255, 15);

    if (!voice.freeze && voice.player.state == "started") {
        dice(1000)
        xz += 5;
        yz += 5;
    }
    if (voice.x[0]) {
        if (voice.x[1]) {
            if (!voice.freeze) {
                const randooo = random(-5, 5);
                voice.x[0] += randooo
                voice.x[1] += randooo
                ghost.x[0] -= randooo
                ghost.x[1] -= randooo
            }

            topLayer.line(voice.x[0], voice.y, voice.x[1], voice.y)
            topLayer.line(ghost.x[0], ghost.y, ghost.x[1], ghost.y)
        } else {

            topLayer.line(voice.x[0], voice.y, mouseX, voice.y)
            topLayer.line(ghost.x[0], ghost.y, width - mouseX, ghost.y)
        }
    }
    image(topLayer, 0, 0)
    voice.delay.delayTime.rampTo(voice.delayTime, 0.3);
    ghost.delay.delayTime.rampTo(ghost.delayTime, 0.3);
    voice.reverb.wet.rampTo(voice.reverbAmt, 0.5);
    ghost.reverb.wet.rampTo(ghost.reverbAmt, 0.5);
}



function keyPressed() {
    if (key == " ") {
        for (v of voices) {
            v.startStopPlayer()
        }
    }
}

function mousePressed() {
    if (firstClick) {
        initializeTone();
    }
    voice.freeze = (voice.checkBounds() || ghost.checkBounds());
    ghost.freeze = voice.freeze;
    if (!voice.freeze) {
        const halfHeight = height / 2
        const heightDiff = mouseY - halfHeight;
        const ghostY = halfHeight - heightDiff
        const halfWidth = width / 2
        const widthDiff = mouseX - halfWidth;
        const ghostX = halfWidth - widthDiff
        voice.getPressedPoint(mouseX, mouseY);
        voice.x[0] = mouseX
        voice.x[1] = undefined
        voice.y = mouseY
        ghost.getPressedPoint(ghostX, ghostY);
        ghost.x[0] = ghostX
        ghost.x[1] = undefined
        ghost.y = ghostY
    }
}


function mouseReleased() {
    if (firstClick) {
        for (v of voices) {
            v.startStopPlayer()
        }
        firstClick = false;
    }
    if (!voice.freeze) {
        const halfWidth = width / 2
        const widthDiff = mouseX - halfWidth;
        const ghostX = halfWidth - widthDiff
        voice.getReleasePoint(mouseX);
        voice.x[1] = mouseX
        ghost.getReleasePoint(ghostX);
        ghost.x[1] = ghostX
    }
}

async function initializeTone() {
    await Tone.start();
    Tone.Transport.start();
    console.log('transport started')
}

function dice(chance) {
    let rand = Math.floor(random(0, chance))
    if (rand < 5) {
        voice.randomizePitch()
        console.log('voice randomize pitch')
    } else if (rand < 10) {
        ghost.randomizePitch()
        console.log('ghost randomize pitch')
    } else if (rand < 13) {
        voice.randomizeBuffer()
        console.log('voice randomize buffer')
    } else if (rand < 16) {
        ghost.randomizeBuffer()
        console.log('ghost randomize buffer')
    } else if (rand < 20) {
        voice.randomizeTexture()
        console.log('voice randomize texture')
    } else if (rand < 25) {
        ghost.randomizeTexture()
        console.log('ghost randomize texture')
    } else if (rand < 30) {
        // voice.randomizeGrains()
        // console.log('voice randomize grains')
    } else if (rand < 35) {
        // ghost.randomizeGrains()
        // console.log('ghost randomize grains')
    }
}

function ns(x, y, z, scale_, min_, max_) {
    return map(
        noise(x * scale_, y * scale_, z * scale_),
        0, 1, min_, max_);
}