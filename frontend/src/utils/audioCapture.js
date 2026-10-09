// Captures microphone audio, converts it to the 16-bit PCM @ 16kHz format
// Gemini Live requires for input, and streams it in small chunks via a callback.
export class AudioCapture {
  constructor(onChunk) {
    this.onChunk = onChunk;
    this.audioContext = null;
    this.stream = null;
    this.processor = null;
    this.source = null;
    this.muteGain = null;
  }

  async start() {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    const tracks = this.stream.getAudioTracks();

console.log("🎙️ Audio tracks:", tracks);

if (tracks.length > 0) {
  const track = tracks[0];

  console.log("🎙️ Mic label:", track.label);
  console.log("🎙️ Mic enabled:", track.enabled);
  console.log("🎙️ Mic muted:", track.muted);
  console.log("🎙️ Mic readyState:", track.readyState);
  console.log("🎙️ Mic settings:", track.getSettings());
}

    this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

    // Browsers sometimes keep a freshly-created AudioContext suspended even after
    // a user click, especially if created inside an async function — force-resume it.
    if (this.audioContext.state === "suspended") {
      await this.audioContext.resume();
    }
    console.log("AudioContext state:", this.audioContext.state, "| sample rate:", this.audioContext.sampleRate);

    this.source = this.audioContext.createMediaStreamSource(this.stream);

    // ScriptProcessorNode is technically deprecated but still fully functional and
    // far simpler to wire up than AudioWorklet for a project at this stage.
    this.processor = this.audioContext.createScriptProcessor(4096, 1, 1);

    const inputSampleRate = this.audioContext.sampleRate; // usually 44100 or 48000, varies by device
    const targetSampleRate = 16000;

    let chunkCount = 0;
    this.processor.onaudioprocess = (e) => {
      const inputData = e.inputBuffer.getChannelData(0);

      // Quick volume check — tells us if we're actually capturing real sound or just silence
      let maxVolume = 0;
      for (let i = 0; i < inputData.length; i++) {
        maxVolume = Math.max(maxVolume, Math.abs(inputData[i]));
      }

      const downsampled = this.downsample(inputData, inputSampleRate, targetSampleRate);
      const pcm16 = this.floatTo16BitPCM(downsampled);
      const base64 = this.arrayBufferToBase64(pcm16.buffer);

      chunkCount++;
      if (chunkCount % 10 === 1) {
        console.log(`Chunk #${chunkCount} | peak volume: ${maxVolume.toFixed(3)} | base64 length: ${base64.length}`);
      }

      this.onChunk(base64);
    };

    // Route through a silent (gain=0) node instead of straight to speakers —
    // keeps the processor actively running (required by some browsers) without
    // creating an audio feedback loop where you'd hear your own voice echoed back.
    this.muteGain = this.audioContext.createGain();
    this.muteGain.gain.value = 0;
    this.source.connect(this.processor);
    this.processor.connect(this.muteGain);
    this.muteGain.connect(this.audioContext.destination);
  }

  downsample(buffer, inputRate, outputRate) {
    if (outputRate === inputRate) return buffer;
    const ratio = inputRate / outputRate;
    const newLength = Math.round(buffer.length / ratio);
    const result = new Float32Array(newLength);
    for (let i = 0; i < newLength; i++) {
      result[i] = buffer[Math.floor(i * ratio)];
    }
    return result;
  }

  floatTo16BitPCM(float32Array) {
    const pcm16 = new Int16Array(float32Array.length);
    for (let i = 0; i < float32Array.length; i++) {
      const s = Math.max(-1, Math.min(1, float32Array[i]));
      pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return pcm16;
  }

  arrayBufferToBase64(buffer) {
    let binary = "";
    const bytes = new Uint8Array(buffer);
    for (let i = 0; i < bytes.length; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  }

  // stop() {
  //   if (this.processor) this.processor.disconnect();
  //   if (this.source) this.source.disconnect();
  //   if (this.muteGain) this.muteGain.disconnect();
  //   if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
  //   if (this.audioContext) this.audioContext.close();
  // }
  stop() {
  if (this.processor) {
    this.processor.disconnect();
    this.processor.onaudioprocess = null;
    this.processor = null;
  }

  if (this.source) {
    this.source.disconnect();
    this.source = null;
  }

  if (this.muteGain) {
    this.muteGain.disconnect();
    this.muteGain = null;
  }

  if (this.stream) {
    this.stream.getTracks().forEach((track) => track.stop());
    this.stream = null;
  }

  if (this.audioContext && this.audioContext.state !== "closed") {
    this.audioContext.close().catch(() => {});
  }

  this.audioContext = null;
}
}