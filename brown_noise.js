var bufferSize = 10 * audioCtx.sampleRate,
noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate),
output = noiseBuffer.getChannelData(0);

var lastOut = 0;
for (var i = 0; i < bufferSize; i++) {
    var brown = Math.random() * 2 - 1;
  
    output[i] = (lastOut + (0.02 * brown)) / 1.02;
    lastOut = output[i];
    output[i] *= 3.5;
}

brownNoise = audioCtx.createBufferSource();
brownNoise.buffer = noiseBuffer;
brownNoise.loop = true;
brownNoise.start(0);