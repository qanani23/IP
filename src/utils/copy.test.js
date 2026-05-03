// Property 4: Copy Single-Source Invariant
// All visible text strings are exported from copy.js.
// No string literal matching any COPY value may appear in component JSX files.

import { describe, it, expect } from 'vitest';
import { COPY } from './copy.js';

describe('P4 — Copy Single-Source Invariant', () => {
  it('COPY object is defined and not empty', () => {
    expect(COPY).toBeDefined();
    expect(typeof COPY).toBe('object');
  });

  it('required top-level keys exist', () => {
    expect(COPY.productName).toBeDefined();
    expect(COPY.heroTagline).toBeDefined();
    expect(COPY.heroSubtitle).toBeDefined();
    expect(COPY.cta).toBeDefined();
    expect(COPY.cartAriaLabel).toBeDefined();
    expect(COPY.skipLink).toBeDefined();
  });

  it('all section titles are defined', () => {
    expect(COPY.sections.performance).toBeDefined();
    expect(COPY.sections.aerodynamics).toBeDefined();
    expect(COPY.sections.technical).toBeDefined();
    expect(COPY.sections.podium).toBeDefined();
    expect(COPY.sections.champion).toBeDefined();
    expect(COPY.sections.cart).toBeDefined();
  });

  it('all technical metrics are defined', () => {
    expect(COPY.specs.microfiber).toBeDefined();
    expect(COPY.specs.pebbleDepth).toBeDefined();
    expect(COPY.specs.dragCoeff).toBeDefined();
    expect(COPY.specs.dragLabel).toBeDefined();
    expect(COPY.specs.rotStability).toBeDefined();
    expect(COPY.specs.rotLabel).toBeDefined();
    expect(COPY.specs.weightBalance).toBeDefined();
    expect(COPY.specs.weightLabel).toBeDefined();
    expect(COPY.specs.uniformBounce).toBeDefined();
    expect(COPY.specs.bounceLabel).toBeDefined();
  });

  it('champion section copy is defined', () => {
    expect(COPY.champion.rank).toBeDefined();
    expect(COPY.champion.tier).toBeDefined();
    expect(COPY.champion.price).toBeDefined();
    expect(COPY.champion.edition).toBeDefined();
  });

  it('price string matches spec', () => {
    expect(COPY.champion.price).toBe('$34.99');
  });

  it('rank matches spec', () => {
    expect(COPY.champion.rank).toBe('01');
  });

  it('drag coefficient matches spec', () => {
    expect(COPY.specs.dragCoeff).toBe('0.85');
  });

  it('rotational stability matches spec', () => {
    expect(COPY.specs.rotStability).toBe('28.5');
  });

  it('weight balance matches spec', () => {
    expect(COPY.specs.weightBalance).toBe('95%');
  });

  it('uniform bounce matches spec', () => {
    expect(COPY.specs.uniformBounce).toBe('99%');
  });

  it('cart aria label matches spec', () => {
    expect(COPY.cartAriaLabel).toBe('Shopping cart');
  });

  it('no COPY value is undefined or null', () => {
    function checkNoNulls(obj, path = '') {
      for (const [key, val] of Object.entries(obj)) {
        const fullPath = path ? `${path}.${key}` : key;
        if (typeof val === 'object' && val !== null) {
          checkNoNulls(val, fullPath);
        } else {
          expect(val, `COPY.${fullPath} should not be null/undefined`).not.toBeNull();
          expect(val, `COPY.${fullPath} should not be undefined`).not.toBeUndefined();
        }
      }
    }
    checkNoNulls(COPY);
  });
});
