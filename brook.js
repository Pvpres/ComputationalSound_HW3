let audioCtx = null;
let isPlaying = false;

let brownNoise1, brownNoise2, lpf1, lpf2, modGain, rhpf, outputGain;

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
