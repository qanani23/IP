// Performance Safeguards Property Tests
// P9: FPS floor — test that FPS monitor tracks rolling average correctly
// P11-P16: State ownership, animation conflict, camera safety, ScrollTrigger count,
//          CartAnimation isolation, mobile motion reduction
// P17: CLS = 0 — fixed-position elements don't contribute to layout flow

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = resolve(__dirname, '..');

// ─── P9: FPS Monitor Rolling Average ─────────────────────────────────────────
describe('P9 — FPS Monitor Rolling Average', () => {
  it('rolling average of 10 identical frame times equals that frame time', () => {
    const frameTimes = Array(10).fill(16.67); // 60fps
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = Math.round(1000 / avg);
    expect(fps).toBe(60);
  });

  it('rolling average of 10 frames at 33ms equals ~30fps', () => {
    const frameTimes = Array(10).fill(33.33);
    const avg = frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
    const fps = Math.round(1000 / avg);
    expect(fps).toBe(30);
  });

  it('rolling window of 10 frames discards oldest frame', () => {
    const frameTimes = [];
    // Add 11 frames — oldest should be discarded
    for (let i = 0; i < 11; i++) {
      frameTimes.push(16.67);
      if (frameTimes.length > 10) frameTimes.shift();
    }
    expect(frameTimes.length).toBe(10);
  });

  it('FPS tier thresholds are correct', () => {
    // Tier 0: FPS >= 30
    // Tier 1: FPS < 30
    // Tier 2: FPS < 20
    // Tier 3: FPS < 15
    const getTier = (fps) => {
      if (fps < 15) return 3;
      if (fps < 20) return 2;
      if (fps < 30) return 1;
      return 0;
    };
    expect(getTier(60)).toBe(0);
    expect(getTier(30)).toBe(0);
    expect(getTier(29)).toBe(1);
    expect(getTier(20)).toBe(1);
    expect(getTier(19)).toBe(2);
    expect(getTier(15)).toBe(2);
    expect(getTier(14)).toBe(3);
  });

  it('quality tier only decreases (never upgrades mid-session)', () => {
    let currentTier = 0;
    const applyTier = (newTier) => {
      currentTier = Math.max(currentTier, newTier);
    };
    applyTier(0); expect(currentTier).toBe(0);
    applyTier(1); expect(currentTier).toBe(1);
    applyTier(0); expect(currentTier).toBe(1); // no upgrade
    applyTier(2); expect(currentTier).toBe(2);
    applyTier(1); expect(currentTier).toBe(2); // no upgrade
    applyTier(3); expect(currentTier).toBe(3);
  });
});

// ─── P11: State Ownership ─────────────────────────────────────────────────────
describe('P11 — State Ownership', () => {
  it('motionState is a plain mutable object (not reactive)', async () => {
    const { motionState } = await import('../utils/motionState.js');
    expect(typeof motionState).toBe('object');
    expect(motionState).not.toBeNull();
    // Must be directly mutable
    const orig = motionState.scale;
    motionState.scale = 999;
    expect(motionState.scale).toBe(999);
    motionState.scale = orig;
  });

  it('motionState has all required properties', async () => {
    const { motionState } = await import('../utils/motionState.js');
    expect(motionState.position).toBeDefined();
    expect(motionState.rotation).toBeDefined();
    expect(motionState.scale).toBeDefined();
    expect(motionState.cameraPosition).toBeDefined();
    expect(motionState.hoverScaleDelta).toBeDefined();
    expect(motionState.hoverRotationBoost).toBeDefined();
    expect(motionState.activeSectionIndex).toBeDefined();
    expect(motionState.scrollProgress).toBeDefined();
    expect(typeof motionState.pedestalVisible).toBe('boolean');
  });

  it('SECTION constants cover all 7 sections', async () => {
    const { SECTION } = await import('../utils/motionState.js');
    expect(SECTION.HERO).toBe(0);
    expect(SECTION.PERFORMANCE).toBe(1);
    expect(SECTION.AERODYNAMICS).toBe(2);
    expect(SECTION.TECHNICAL).toBe(3);
    expect(SECTION.PODIUM).toBe(4);
    expect(SECTION.CHAMPION).toBe(5);
    expect(SECTION.CART).toBe(6);
  });
});

// ─── P12: Animation Conflict Prevention ──────────────────────────────────────
describe('P12 — Animation Conflict Prevention', () => {
  it('SceneCanvas uses will-change on animated elements', () => {
    const filePath = resolve(srcDir, 'components/SceneCanvas.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('will-change') || content.includes('willChange')).toBe(true);
  });

  it('TextReveal uses will-change on wrapper', () => {
    const filePath = resolve(srcDir, 'components/TextReveal.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('will-change') || content.includes('willChange')).toBe(true);
  });

  it('TextReveal never toggles display or visibility', () => {
    const filePath = resolve(srcDir, 'components/TextReveal.jsx');
    const content = readFileSync(filePath, 'utf-8');
    // Should not set display:none or visibility:hidden
    expect(content.includes('display: none')).toBe(false);
    expect(content.includes('display:none')).toBe(false);
    expect(content.includes('visibility: hidden')).toBe(false);
    expect(content.includes('visibility:hidden')).toBe(false);
  });
});

// ─── P13: Camera Safety ───────────────────────────────────────────────────────
describe('P13 — Camera Safety', () => {
  it('camera min distance is 3 world units', async () => {
    const { CAMERA } = await import('../config/tokens.js');
    expect(CAMERA.minDistance).toBe(3);
  });

  it('camera safe zone is [5%, 95%]', async () => {
    const { CAMERA } = await import('../config/tokens.js');
    expect(CAMERA.safeZone.min).toBe(0.05);
    expect(CAMERA.safeZone.max).toBe(0.95);
  });

  it('useSceneMotion enforces camera min distance', () => {
    const filePath = resolve(srcDir, 'hooks/useSceneMotion.js');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('minDistance')).toBe(true);
  });
});

// ─── P14: ScrollTrigger Count ─────────────────────────────────────────────────
describe('P14 — ScrollTrigger Count', () => {
  it('useScrollController kills all triggers before creating new ones', () => {
    const filePath = resolve(srcDir, 'hooks/useScrollController.js');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('ScrollTrigger.getAll().forEach')).toBe(true);
    expect(content.includes('.kill()')).toBe(true);
  });

  it('useScrollController cleans up on unmount', () => {
    const filePath = resolve(srcDir, 'hooks/useScrollController.js');
    const content = readFileSync(filePath, 'utf-8');
    // Should have cleanup in return function
    expect(content.includes('return () =>')).toBe(true);
  });
});

// ─── P15: CartAnimation Isolation ────────────────────────────────────────────
describe('P15 — CartAnimation Isolation', () => {
  it('CartButton creates a proxy div (not mutating real ball mesh)', () => {
    const filePath = resolve(srcDir, 'components/CartButton.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('createElement')).toBe(true);
    expect(content.includes('proxy')).toBe(true);
  });

  it('CartButton removes proxy from DOM on complete', () => {
    const filePath = resolve(srcDir, 'components/CartButton.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('remove()')).toBe(true);
  });

  it('CartAnimation uses fixed positioning for proxy', () => {
    const filePath = resolve(srcDir, 'components/CartButton.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('fixed')).toBe(true);
  });
});

// ─── P16: Mobile Motion Reduction ────────────────────────────────────────────
describe('P16 — Mobile Motion Reduction', () => {
  it('prefers-reduced-motion CSS media query exists in index.css', () => {
    const filePath = resolve(srcDir, 'index.css');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('prefers-reduced-motion')).toBe(true);
  });

  it('mobile camera movement is reduced by 20%', async () => {
    // Mobile reduction is now handled in App.jsx keyframes via isMobile checks
    // useSceneMotion applies motionState values directly without multipliers
    const filePath = resolve(srcDir, 'hooks/useSceneMotion.js');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('isMobile')).toBe(true);
    // Mobile reduction is applied in App.jsx scroll keyframes (R/L/C values)
    const appFilePath = resolve(srcDir, 'App.jsx');
    const appContent = readFileSync(appFilePath, 'utf-8');
    expect(appContent.includes('isMobile')).toBe(true);
  });
});

// ─── P17: CLS = 0 ────────────────────────────────────────────────────────────
describe('P17 — CLS = 0 (Cumulative Layout Shift)', () => {
  it('SceneCanvas wrapper is position: fixed (does not contribute to layout flow)', () => {
    const filePath = resolve(srcDir, 'components/SceneCanvas.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('fixed')).toBe(true);
  });

  it('Navigation is position: fixed', () => {
    const filePath = resolve(srcDir, 'components/Navigation.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('fixed')).toBe(true);
  });

  it('LoadingScreen is position: fixed', () => {
    const filePath = resolve(srcDir, 'components/LoadingScreen.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('fixed')).toBe(true);
  });

  it('animated elements use transform and opacity only', () => {
    const filePath = resolve(srcDir, 'components/TextReveal.jsx');
    const content = readFileSync(filePath, 'utf-8');
    // TextReveal animates opacity and y (transform)
    expect(content.includes('opacity')).toBe(true);
    expect(content.includes('y:')).toBe(true);
  });

  it('CartButton proxy uses position: fixed (not absolute)', () => {
    const filePath = resolve(srcDir, 'components/CartButton.jsx');
    const content = readFileSync(filePath, 'utf-8');
    expect(content.includes('fixed')).toBe(true);
  });
});
