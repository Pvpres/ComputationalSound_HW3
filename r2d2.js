let r2d2Ctx = null;
let isR2D2Playing = false;
let nextEventId = null;

let carrier, mod, modIndexGain, masterGain;

function startR2D2() {
    r2d2Ctx = new (window.AudioContext || window.webkitAudioContext)();

    carrier = r2d2Ctx.createOscillator();
    carrier.type = 'sine';
    carrier.frequency.value = 1000;

    mod = r2d2Ctx.createOscillator();
    mod.type = 'sine';
    mod.frequency.value = 1000;

    modIndexGain = r2d2Ctx.createGain();
    modIndexGain.gain.value = 1000;

    mod.connect(modIndexGain);
    modIndexGain.connect(carrier.frequency);

    const lop1 = r2d2Ctx.createBiquadFilter();
    lop1.type = 'lowpass';
    lop1.frequency.value = 10000;

    const lop2 = r2d2Ctx.createBiquadFilter();
    lop2.type = 'lowpass';
    lop2.frequency.value = 10000;

    const hip1 = r2d2Ctx.createBiquadFilter();
    hip1.type = 'highpass';
    hip1.frequency.value = 100;

    const hip2 = r2d2Ctx.createBiquadFilter();
    hip2.type = 'highpass';
    hip2.frequency.value = 100;

    masterGain = r2d2Ctx.createGain();
    masterGain.gain.value = 0;

    carrier.connect(lop1);
    lop1.connect(lop2);
    lop2.connect(hip1);
    hip1.connect(hip2);
    hip2.connect(masterGain);
    masterGain.connect(r2d2Ctx.destination);

    carrier.start();
    mod.start();

    scheduleNextBabble();
}

function getRandom(min, max) {
    return Math.random() * (max - min) + min;
}

function updateAudioParam(param, newValue, now, duration, isSlide) {
    param.cancelScheduledValues(now);
    param.setValueAtTime(param.value, now);
    if (isSlide) {
        param.linearRampToValueAtTime(newValue, now + duration);
    } else {
        param.setValueAtTime(newValue, now);
    }
}

function scheduleNextBabble() {
    if (!isR2D2Playing) return;

    const now = r2d2Ctx.currentTime;

    const talkSpeedMs = getRandom(30, 250);
    const duration = talkSpeedMs / 1000;

    if (Math.random() < 0.6) {
        const nextCarrierFreq = getRandom(200, 2500);
        const isSlide = Math.random() < 0.5;
        updateAudioParam(carrier.frequency, nextCarrierFreq, now, duration, isSlide);
    }

    if (Math.random() < 0.6) {
        const nextRatio = getRandom(1, 15);
        const nextModFreq = carrier.frequency.value * nextRatio;
        const isSlide = Math.random() < 0.5;
        updateAudioParam(mod.frequency, nextModFreq, now, duration, isSlide);
    }


    if (Math.random() < 0.6) {
        const nextModIndex = getRandom(100, 6000);
        const isSlide = Math.random() < 0.5;
        updateAudioParam(modIndexGain.gain, nextModIndex, now, duration, isSlide);
    }

    if (Math.random() < 0.1) {
        updateAudioParam(masterGain.gain, 0, now, duration * 0.2, true);
    } else {
        const amp = getRandom(0.03, 0.06);
        const isSlide = Math.random() < 0.5;
        updateAudioParam(masterGain.gain, amp, now, duration * 0.1, isSlide);
    }

    nextEventId = setTimeout(scheduleNextBabble, talkSpeedMs);
}

function stopR2D2() {
    if (nextEventId) {
        clearTimeout(nextEventId);
        nextEventId = null;
    }
    if (r2d2Ctx) {
        r2d2Ctx.close();
        r2d2Ctx = null;
    }
}

document.getElementById("r2d2Btn").addEventListener("click", () => {
    if (isR2D2Playing) {
        isR2D2Playing = false;
        stopR2D2();
        document.getElementById("r2d2Btn").textContent = "Play";
    } else {
        isR2D2Playing = true;
        startR2D2();
        document.getElementById("r2d2Btn").textContent = "Stop";
    }
});
