// Property 8: AudioEngine Idempotence
// Test that playCartSound() can be called multiple times without error.
// Test that init() is safe to call multiple times.
// Test graceful no-op when AudioContext unavailable.

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('P8 — AudioEngine Idempotence', () => {
  beforeEach(() => {
    // Reset module state between tests by re-importing fresh
    vi.resetModules();
  });

  it('init() can be called multiple times without error', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => {
      audioEngine.init();
      audioEngine.init();
      audioEngine.init();
    }).not.toThrow();
  });

  it('playCartSound() can be called multiple times without error', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => {
      audioEngine.playCartSound();
      audioEngine.playCartSound();
      audioEngine.playCartSound();
    }).not.toThrow();
  });

  it('playCartSound() is a no-op when AudioContext is unavailable', async () => {
    // In Node.js environment, AudioContext is not available
    // playCartSound() should not throw
    const audioEngine = await import('./audioEngine.js');
    expect(() => audioEngine.playCartSound()).not.toThrow();
  });

  it('init() is a no-op when AudioContext is unavailable', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => audioEngine.init()).not.toThrow();
  });

  it('calling init() then playCartSound() does not throw', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => {
      audioEngine.init();
      audioEngine.playCartSound();
    }).not.toThrow();
  });

  it('playCartSound() called 10 times does not throw', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => {
      for (let i = 0; i < 10; i++) {
        audioEngine.playCartSound();
      }
    }).not.toThrow();
  });

  it('init() called 10 times does not throw', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(() => {
      for (let i = 0; i < 10; i++) {
        audioEngine.init();
      }
    }).not.toThrow();
  });

  it('audioEngine exports init and playCartSound functions', async () => {
    const audioEngine = await import('./audioEngine.js');
    expect(typeof audioEngine.init).toBe('function');
    expect(typeof audioEngine.playCartSound).toBe('function');
  });
});
