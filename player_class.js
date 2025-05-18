const buffer1 = new Tone.ToneAudioBuffer("assets/audio/bbowl/01.wav", () => {
    console.log("buff1 loaded");
});
const buffer2 = new Tone.ToneAudioBuffer("assets/audio/bbowl/02.wav", () => {
    console.log("buff2 loaded");
});
const buffer3 = new Tone.ToneAudioBuffer("assets/audio/bbowl/03.wav", () => {
    console.log("buff3 loaded");
});
const buffer4 = new Tone.ToneAudioBuffer("assets/audio/bbowl/04.wav", () => {
    console.log("buff4 loaded");
});
const buffer5 = new Tone.ToneAudioBuffer("assets/audio/bbowl/05.wav", () => {
    console.log("buff5 loaded");
});
const buffer6 = new Tone.ToneAudioBuffer("assets/audio/bbowl/06.wav", () => {
    console.log("buff6 loaded");
});
const buffers = [buffer1, buffer2, buffer3, buffer4, buffer5, buffer6]



class Player {
    constructor() {
        this.player = new Tone.GrainPlayer();
        this.delay = new Tone.PingPongDelay({
            delayTime: 2,
            maxDelay: 4,
            feedback: 0.5,
            wet: 0
        });
        this.filterNode = new Tone.Filter({
            frequency: 10000,
            Q: 5,
            type: "lowpass"
        });
        this.autoFilter = new Tone.AutoFilter(0.1).start();
        this.autoPanner = new Tone.AutoPanner(0.1).start();
        this.crusher = new Tone.BitCrusher({
            bits: 16,
            wet: 1
        });
        this.reverb = new Tone.Reverb({
            decay: 6,
            preDelay: 0.25,
            wet: 0.5
        });
        this.vibrato = new Tone.Vibrato(1, 0.5);
        this.signal = new Tone.Signal(0.5);
        this.signal2 = new Tone.Signal(0.5);
        this.mainGain = new Tone.Gain(0.7);
        this.delayTime = 1;
        this.reverbAmt = 0.5;
        this.pressedPoint = 0;
        this.releasedPoint = 0;
        this.loopStart = 0;
        this.loopEnd = 0;
        this.bufferIndex = 0;
        this.rgb = [0, 0, 0];
        this.x = [undefined, undefined]
        this.y = 0;
        this.freeze = false;
    }

    initialize(num) {
        // Init settings for player and FX
        this.player.buffer = buffers[num]
        this.player.loop = true;
        this.player.playbackRate = 1;
        this.autoFilter.filter.Q.value = 10;
        this.reverb.toDestination();
        this.player.chain(this.mainGain, this.crusher, this.vibrato, this.autoFilter, this.autoPanner, this.delay, this.reverb);
        this.player.loopStart = 0;
        this.player.loopEnd = this.player.buffer.duration;
        Tone.Transport.scheduleRepeat(time => {
            if (!this.freeze) {
                this.vibrato.frequency.rampTo(Math.random() * 2, 0.5)
                this.signal.linearRampTo(Math.random(), 1);
                this.reverb.wet.rampTo(this.signal.value, 0.5)
            }
        }, 3);
        Tone.Transport.scheduleRepeat(time => {
            if (!this.freeze) {
                this.signal2.setValueAtTime(Math.random(), 0);
                // this.signal2.linearRampTo(Math.random(), 1);
                this.delay.wet.rampTo(this.signal2.value, 0.5);
                this.crusher.wet.rampTo(this.signal2.value, 0.5)
            }
        }, 4);

    }

    startStopPlayer() {
        if (this.player.state === "stopped") {
            console.log('start player')
            this.player.sync().start(0, this.loopStart);
            this.mainGain.gain.rampTo(1, 1, "+0.5");
        } else {
            console.log('stop player')
            this.mainGain.gain.rampTo(0, 0.5);
            this.player.stop("+0.5");
            // isPlaying = false;
        }
    }

    getPressedPoint(x, y) {
        console.log(x, y)
        const buff = Math.floor(map(y, 0, height, 0, buffers.length))
        this.rgb = [0, 0, 0]
        this.changeBuffer(buff)
        this.player.playbackRate = 1;
        this.pressedPoint = map(x, 0, width, 0, 1);
    }

    getReleasePoint(x) {
        // Capture mouse released x and y
        this.releasedPoint = map(x, 0, width, 0, 1);
        // Calculate loop start and end points
        this.calculateLoop();
        this.randomizeVals();
    }

    calculateLoop() {
        this.mainGain.gain.rampTo(0, 1);
        this.player.stop("+1")
            // Calculate loop start and end points in relation to current buffer's duration
        this.loopStart = this.pressedPoint * this.player.buffer.duration;
        this.loopEnd = this.releasedPoint * this.player.buffer.duration;
        console.log(this.loopStart, this.loopEnd);
        // If mouse dragged left to right, play forwards
        if (this.loopStart < this.loopEnd) {
            this.player.loopStart = this.loopStart;
            this.player.loopEnd = this.loopEnd;
            this.player.reverse = false;
            if (this.player.state === "started") {
                this.player.sync().start("+1.01", this.loopStart);
                this.mainGain.gain.rampTo(1, 1, "+1.01");
            }
        } else { // otherwise, play backwards
            this.player.loopStart = this.loopEnd;
            this.player.loopEnd = this.loopStart;
            this.player.reverse = true;
            if (this.player.state === "started") {
                this.player.sync().start("+1.01", this.loopEnd);
                this.mainGain.gain.rampTo(1, 1, "+1.01");
            }
        }
        // this.randomizeVals();
    }

    randomizeVals() {
        this.player.playbackRate = random(0.1, 4);
        this.player.detune = random([-1200, -500, 0, 700, 1200])
        this.player.grainSize = random(0.01, 2);
        this.player.overlap = random(0.01, 2);
        this.crusher.bits.value = random(4, 16);
        this.crusher.bits.wet = random(0, 0.9)
        this.autoFilter.baseFrequency = random(100, 6000);
        this.autoFilter.frequency.value = random(0.001, 0.400);
        this.autoFilter.depth.value = random(0, 1);
        this.autoFilter.octaves = random(1, 3);
        this.autoFilter.filter.Q.value = random(5, 15);
        this.autoPanner.frequency.value = random(0.001, 1);
        this.autoPanner.depth.value = random(0, 1);
        this.delay.wet.value = random(0, 1);
        this.delayTime = this.delay.delayTime.value + (random(-0.5, 0.5))
        this.reverbAmt = random(0.1, 1)
        this.delay.feedback.value = random(0, 0.5);
        this.vibrato.depth.value = random(0.1, 1);
    }

    checkBounds() {
        this.x.sort((a, b) => a - b);
        const inBounds = (mouseX < this.x[1] && mouseX > this.x[0] && mouseY < this.y + 25 && mouseY > this.y - 25)
        return inBounds
    }

    changeBuffer(index) {
        this.player.buffer = buffers[index];
    }

    randomizePitch() {
        const rand = random([-1200, 0, 1200])
        if (rand !== this.player.detune) {
            this.player.detune = rand
            this.rgb[0] = Math.floor(random(255))
            this.rgb[1] = Math.floor(random(255))
            this.rgb[2] = Math.floor(random(255))
        }
    }

    randomizeBuffer() {
        const randH = random(30, height - 30)
        const buff = Math.floor(map(randH, 0, height, 0, buffers.length))
        this.changeBuffer(buff)
        this.calculateLoop();
        this.y = randH;
    }

    randomizeTexture() {
        this.crusher.bits.value = random(4, 16);
        this.crusher.bits.wet = random(0, 0.9)
        this.autoFilter.baseFrequency = random(100, 6000);
        this.autoFilter.frequency.value = random(0.001, 0.400);
        this.autoFilter.depth.value = random(0, 1);
        this.autoFilter.octaves = random(1, 3);
        this.autoFilter.filter.Q.value = random(5, 15);
        this.autoPanner.frequency.value = random(0.001, 1);
        this.autoPanner.depth.value = random(0, 1);
        this.vibrato.depth.value = random(0.1, 1);
    }

    randomizeGrains() {
        this.player.playbackRate = random(0.1, 4);
        this.player.grainSize = random(0.01, 2);
        this.player.overlap = random(0.01, 2);
    }

}