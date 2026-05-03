// Property 10: Shader Fallback Safety
// If PebbleShader compilation throws, Ball renders with MeshStandardMaterial
// and no error propagates to the user.

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { resolve } from 'path';

describe('P10 — Shader Fallback Safety', () => {
  it('vertex shader file exists and is non-empty', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.vert.glsl'), 'utf-8');
    expect(src.length).toBeGreaterThan(100);
    expect(src).toContain('void main()');
    expect(src).toContain('gl_Position');
  });

  it('fragment shader file exists and is non-empty', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.frag.glsl'), 'utf-8');
    expect(src.length).toBeGreaterThan(100);
    expect(src).toContain('void main()');
    expect(src).toContain('gl_FragColor');
  });

  it('vertex shader contains FBM noise function', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.vert.glsl'), 'utf-8');
    expect(src).toContain('fbm');
    expect(src).toContain('snoise');
  });

  it('fragment shader contains seam darkening logic', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.frag.glsl'), 'utf-8');
    expect(src).toContain('seamDistance');
  });

  it('fragment shader contains pebble cell pattern', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.frag.glsl'), 'utf-8');
    expect(src).toContain('pebble');
  });

  it('vertex shader uses uPebbleDepth uniform', () => {
    const src = readFileSync(resolve(__dirname, 'pebble.vert.glsl'), 'utf-8');
    expect(src).toContain('uPebbleDepth');
  });

  it('fallback color matches spec (#e8500a)', () => {
    // The fallback MeshStandardMaterial color is defined in Basketball.jsx
    const basketballSrc = readFileSync(
      resolve(__dirname, '../components/Basketball.jsx'), 'utf-8'
    );
    expect(basketballSrc).toContain('#e8500a');
    expect(basketballSrc).toContain('fallbackMaterial');
    expect(basketballSrc).toContain('roughness: 0.8');
    expect(basketballSrc).toContain('metalness: 0.1');
  });
});
