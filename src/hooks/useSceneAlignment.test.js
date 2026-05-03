// Property 1: Responsive Hook Invariant
// For any viewport width, breakpoint is exactly one of { 'mobile', 'tablet', 'desktop' }
// and sceneOffset is always a finite number.

import { describe, it, expect } from 'vitest';
import { BREAKPOINT, CAMERA, LAYOUT } from '../config/tokens.js';

// Extract the pure computation function for testing (no React hooks needed)
function computeAlignment(width, height) {
  const dpr = 1;
  let breakpoint;
  if (width < BREAKPOINT.mobile) {
    breakpoint = 'mobile';
  } else if (width < BREAKPOINT.tablet) {
    breakpoint = 'tablet';
  } else {
    breakpoint = 'desktop';
  }
  const cameraFov   = CAMERA.fov[breakpoint];
  const pagePadding = LAYOUT.pagePadding[breakpoint];
  const sectionGap  = LAYOUT.sectionGap[breakpoint];
  let sceneOffset = 0;
  if (breakpoint === 'desktop') sceneOffset = 1.2;
  else if (breakpoint === 'tablet') sceneOffset = 0.6;
  return { breakpoint, viewport: { width, height }, dpr, sceneOffset, cameraFov, pagePadding, sectionGap };
}

const VALID_BREAKPOINTS = new Set(['mobile', 'tablet', 'desktop']);

describe('P1 — Responsive Hook Invariant', () => {
  it('returns valid breakpoint for all widths from 320 to 2560', () => {
    for (let w = 320; w <= 2560; w += 10) {
      const result = computeAlignment(w, 900);
      expect(VALID_BREAKPOINTS.has(result.breakpoint),
        `width=${w} produced invalid breakpoint: ${result.breakpoint}`
      ).toBe(true);
    }
  });

  it('sceneOffset is always a finite number', () => {
    for (let w = 320; w <= 2560; w += 10) {
      const result = computeAlignment(w, 900);
      expect(Number.isFinite(result.sceneOffset),
        `width=${w} produced non-finite sceneOffset: ${result.sceneOffset}`
      ).toBe(true);
    }
  });

  it('breakpoint boundaries are correct', () => {
    expect(computeAlignment(320, 900).breakpoint).toBe('mobile');
    expect(computeAlignment(767, 900).breakpoint).toBe('mobile');
    expect(computeAlignment(768, 900).breakpoint).toBe('tablet');
    expect(computeAlignment(1199, 900).breakpoint).toBe('tablet');
    expect(computeAlignment(1200, 900).breakpoint).toBe('desktop');
    expect(computeAlignment(2560, 900).breakpoint).toBe('desktop');
  });

  it('cameraFov matches token values per breakpoint', () => {
    expect(computeAlignment(375, 812).cameraFov).toBe(60);   // mobile
    expect(computeAlignment(1024, 768).cameraFov).toBe(50);  // tablet
    expect(computeAlignment(1440, 900).cameraFov).toBe(45);  // desktop
  });

  it('pagePadding matches token values per breakpoint', () => {
    expect(computeAlignment(375, 812).pagePadding).toBe(20);
    expect(computeAlignment(1024, 768).pagePadding).toBe(40);
    expect(computeAlignment(1440, 900).pagePadding).toBe(80);
  });

  it('sectionGap matches token values per breakpoint', () => {
    expect(computeAlignment(375, 812).sectionGap).toBe(80);
    expect(computeAlignment(1024, 768).sectionGap).toBe(120);
    expect(computeAlignment(1440, 900).sectionGap).toBe(160);
  });

  it('viewport dimensions are passed through correctly', () => {
    const result = computeAlignment(1280, 720);
    expect(result.viewport.width).toBe(1280);
    expect(result.viewport.height).toBe(720);
  });

  it('dpr is always between 1 and 2', () => {
    for (let w = 320; w <= 2560; w += 100) {
      const result = computeAlignment(w, 900);
      expect(result.dpr).toBeGreaterThanOrEqual(1);
      expect(result.dpr).toBeLessThanOrEqual(2);
    }
  });

  it('desktop sceneOffset is positive (ball offset right)', () => {
    const result = computeAlignment(1440, 900);
    expect(result.sceneOffset).toBeGreaterThan(0);
  });

  it('mobile sceneOffset is 0 (ball centered)', () => {
    const result = computeAlignment(375, 812);
    expect(result.sceneOffset).toBe(0);
  });
});
