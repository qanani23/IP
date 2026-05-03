import { DEBUG } from '../config/debug.js';

// ─── audioEngine ──────────────────────────────────────────────────────────────
// Web Audio API engine for cart sound effect.
// Graceful no-op if AudioContext unavailable.
// init() must be called on first user gesture (browser autoplay policy).

let audioCtx = null;

/**
 * Initialize AudioContext on first user gesture.
 * Safe to call multiple times — no-op after first init.
 */
export function init() {
  if (audioCtx) return;

  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) {
      if (DEBUG.audioEngine) console.warn('[audioEngine] AudioContext not available');
      return;
    }
    audioCtx = new AudioContextClass();
    if (DEBUG.audioEngine) {
      console.log('[audioEngine] init() — AudioContext.state:', audioCtx.state);
    }
  } catch (e) {
    if (DEBUG.audioEngine) console.warn('[audioEngine] init() failed:', e);
    audioCtx = null;
  }
}

/**
 * Play the cart "thud" sound effect.
 * OscillatorNode (sine, 120Hz→60Hz, 80ms) + GainNode (attack 5ms, decay 75ms)
 * + BiquadFilterNode (lowpass 400Hz) + white noise (150ms, gain ~0.08).
 * Graceful no-op if AudioContext unavailable.
 */
export function playCartSound() {
  if (!audioCtx) {
    if (DEBUG.audioEngine) console.log('[audioEngine] playCartSound() — no AudioContext, skipping');
    return;
  }

  try {
    // Resume if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    const now = audioCtx.currentTime;

    // ── Oscillator (sine, 120Hz → 60Hz, 80ms) ────────────────────────────────
    const osc = audioCtx.createOscillator();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(120, now);
    osc.frequency.exponentialRampToValueAtTime(60, now + 0.08);

    // ── Gain envelope (attack 5ms, decay 75ms) ────────────────────────────────
    const gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, now);
    gainNode.gain.linearRampToValueAtTime(0.6, now + 0.005);
    gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    // ── Lowpass filter (400Hz) ────────────────────────────────────────────────
    const filter = audioCtx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, now);

    // ── White noise (150ms, gain ~0.08) ───────────────────────────────────────
    const noiseBuffer = createNoiseBuffer(audioCtx, 0.15);
    const noiseSource = audioCtx.createBufferSource();
    noiseSource.buffer = noiseBuffer;

    const noiseGain = audioCtx.createGain();
    noiseGain.gain.setValueAtTime(0.08, now);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    // ── Connect graph ─────────────────────────────────────────────────────────
    // osc → gainNode → filter → destination
    osc.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(audioCtx.destination);

    // noiseSource → noiseGain → destination
    noiseSource.connect(noiseGain);
    noiseGain.connect(audioCtx.destination);

    if (DEBUG.audioEngine) {
      console.log('[audioEngine] playCartSound() — node graph:', {
        osc: { type: osc.type, freq: '120→60Hz', duration: '80ms' },
        gainNode: { attack: '5ms', decay: '75ms' },
        filter: { type: filter.type, freq: '400Hz' },
        noise: { duration: '150ms', gain: 0.08 },
        audioCtxState: audioCtx.state,
      });
    }

    // ── Start and schedule stop ───────────────────────────────────────────────
    osc.start(now);
    osc.stop(now + 0.08);
    noiseSource.start(now);
    noiseSource.stop(now + 0.15);

    // Auto-disconnect after 500ms
    setTimeout(() => {
      try {
        osc.disconnect();
        gainNode.disconnect();
        filter.disconnect();
        noiseSource.disconnect();
        noiseGain.disconnect();
      } catch {
        // Already disconnected — safe to ignore
      }
    }, 500);

  } catch (e) {
    if (DEBUG.audioEngine) console.warn('[audioEngine] playCartSound() error:', e);
  }
}

/**
 * Create a white noise AudioBuffer.
 * @param {AudioContext} ctx
 * @param {number} duration - seconds
 * @returns {AudioBuffer}
 */
function createNoiseBuffer(ctx, duration) {
  const sampleRate = ctx.sampleRate;
  const frameCount = Math.floor(sampleRate * duration);
  const buffer = ctx.createBuffer(1, frameCount, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}
