let audioCtx = null;
let isPlaying = false;

let brownNoise1;
let brownNoise2;
let lpf1;
let lpf2;
let modGain;
let rhpf;
let outputGain;

function createBrownNoiseBuffer(ctx) {
  var bufferSize = 10 * ctx.sampleRate,
      noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate),
      output = noiseBuffer.getChannelData(0);

  var lastOut = 0;
  for (var i = 0; i < bufferSize; i++) {
    var brown = Math.random() * 2 - 1;

    output[i] = (lastOut + (0.02 * brown)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
  }
  return noiseBuffer;
}

function createBrownNoise() {
  brownNoise1 = audioCtx.createBufferSource();
  brownNoise1.buffer = createBrownNoiseBuffer(audioCtx);
  brownNoise1.loop = true;

  brownNoise2 = audioCtx.createBufferSource();
  brownNoise2.buffer = createBrownNoiseBuffer(audioCtx);
  brownNoise2.loop = true;
}

function startBrook(){
  audioCtx = new AudioContext();
  createBrownNoise();
  //filters frequencies above 400 like in Supercollider example
  lpf1 = audioCtx.createBiquadFilter();
  lpf1.type = "lowpass";
  lpf1.frequency.value = 400;

  //control frequency
  lpf2 = audioCtx.createBiquadFilter();
  lpf2.type = "lowpass";
  lpf2.frequency.value = 14;
   modGain = audioCtx.createGain();
  modGain.gain.value = 1300;

  // RHPF.ar(..., freq, rq: 0.03, mul: 0.1)
  rhpf = audioCtx.createBiquadFilter();
  rhpf.type = "highpass";
  rhpf.frequency.value = 500;
  rhpf.Q.value = 1 / 0.03; 

  // mul: 0.1
  outputGain = audioCtx.createGain();
  outputGain.gain.value = 0.1;

  brownNoise1.connect(lpf1);
  lpf1.connect(rhpf);
  rhpf.connect(outputGain);
  outputGain.connect(audioCtx.destination);

  brownNoise2.connect(lpf2);
  lpf2.connect(modGain);
  modGain.connect(rhpf.frequency);

  brownNoise1.start(0);
  brownNoise2.start(0);

}

function stopBrook() {
  if (audioCtx) {
    audioCtx.close();
    audioCtx = null;
  }
}

document.getElementById("toggleBtn").addEventListener("click", () => {
  if (isPlaying) {
    stopBrook();
    document.getElementById("toggleBtn").textContent = "Play";
  } else {
    startBrook();
    document.getElementById("toggleBtn").textContent = "Stop";
  }
  isPlaying = !isPlaying;
});