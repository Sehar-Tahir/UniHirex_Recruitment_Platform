// Plays back 24kHz, 16-bit PCM audio chunks received from Gemini Live,
// queuing them so playback stays smooth with no gaps between chunks.
export class AudioPlaybackQueue {
  constructor() {
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
    this.nextStartTime = 0;
  }

  // base64Pcm: base64-encoded raw 16-bit PCM audio string, as received from Gemini
  playChunk(base64Pcm) {
    const binaryString = atob(base64Pcm);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    const pcm16 = new Int16Array(bytes.buffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / 32768;
    }

    const audioBuffer = this.audioContext.createBuffer(1, float32.length, 24000);
    audioBuffer.getChannelData(0).set(float32);

    const source = this.audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(this.audioContext.destination);

    const now = this.audioContext.currentTime;
    const startTime = Math.max(now, this.nextStartTime);
    source.start(startTime);
    this.nextStartTime = startTime + audioBuffer.duration;
  }

  // How many milliseconds of already-queued audio are still left to play
  getRemainingMs() {
    return Math.max(0, (this.nextStartTime - this.audioContext.currentTime) * 1000);
  }

  close() {
    this.audioContext.close();
  }
}