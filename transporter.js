let ctx = null;
let isTransporterPlaying = false;

/// if you sde this code i couldnt figure it out and gave up. even ai couldnt help me.
function playTransporterSound({
  lfoRate = 0.2,
  feedback = 0.6,
  filterQ = 30,
  duration = 12,
} = {}) {

  actx = new (window.AudioContext || window.webkitAudioContext)();
  const ctx = actx;
  const now = ctx.currentTime;

  const master = ctx.createGain();
  master.gain.setValueAtTime(0, now);
  master.gain.linearRampToValueAtTime(0.75, now + 1.0);
  master.gain.setValueAtTime(0.75, now + duration - 2.0);
  master.gain.linearRampToValueAtTime(0, now + duration);
  master.connect(ctx.destination);

  // ── Simple convolution reverb ("addition of a simple reverb") ─────────────
  const convolver = ctx.createConvolver();
  const irLen = Math.floor(ctx.sampleRate * 1.8);
  const ir = ctx.createBuffer(2, irLen, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = ir.getChannelData(ch);
    for (let j = 0; j < irLen; j++)
      d[j] = (Math.random() * 2 - 1) * Math.pow(1 - j / irLen, 3);
  }
  convolver.buffer = ir;

  const dryG = ctx.createGain(); dryG.gain.value = 0.5;
  const wetG = ctx.createGain(); wetG.gain.value = 0.5;
  dryG.connect(master);
  wetG.connect(convolver);
  convolver.connect(master);

  const carrier = ctx.createOscillator();
  carrier.type = 'triangle';
  carrier.frequency.value = 466;

  const modulator = ctx.createOscillator();
  modulator.type = 'triangle';
  modulator.frequency.value = 277;

  const modGain = ctx.createGain();
  modGain.gain.value = 2000;
  modulator.connect(modGain);
  modGain.connect(carrier.frequency);

  const flangerIn = ctx.createGain();
  const flangerOut = ctx.createGain();

  const fbGain = ctx.createGain();
  fbGain.gain.value = feedback;
  fbGain.connect(flangerIn);

  const lfo = ctx.createOscillator();
  lfo.type = 'sine';
  lfo.frequency.value = lfoRate;

  const lfoDepth = ctx.createGain();
  lfoDepth.gain.value = 0.006;
  lfo.connect(lfoDepth);

  for (let i = 1; i <= 3; i++) {
    const delay = ctx.createDelay(0.12);
    delay.delayTime.value = i * 0.012;
    lfoDepth.connect(delay.delayTime);
    flangerIn.connect(delay);
    delay.connect(flangerOut);
    delay.connect(fbGain);
  }

  carrier.connect(flangerIn);
  flangerOut.connect(dryG);
  flangerOut.connect(wetG);

  const baseFreq = 523.25;
  const ratio = 1.12247;

  const filterOut = ctx.createGain();
  filterOut.gain.value = 0.8;
  filterOut.connect(dryG);
  filterOut.connect(wetG);

  for (let i = 0; i < 12; i++) {
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = baseFreq * Math.pow(ratio, i);
    bp.Q.value = filterQ;
    flangerOut.connect(bp);
    bp.connect(filterOut);
  }
  lfo.start(now);
  carrier.start(now);
  modulator.start(now);

  lfo.stop(now + duration);
  carrier.stop(now + duration);
  modulator.stop(now + duration);

  setTimeout(() => {
    if (actx === ctx) stopTransporterSound();
  }, (duration + 0.5) * 1000);
}

function stopTransporterSound() {
  if (ctx) {
    ctx.close();
    ctx = null;
  }
}

document.getElementById("transporterBtn").addEventListener("click", () => {
  if (isTransporterPlaying) {
    stopTransporterSound();
    document.getElementById("transporterBtn").textContent = "Play";
  } else {
    playTransporterSound();
    document.getElementById("transporterBtn").textContent = "Stop";
  }
  isTransporterPlaying = !isTransporterPlaying;
});