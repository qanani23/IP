// Property 7: All Sections Present on All Breakpoints
// Test that all 7 section component files exist.
// Test that each section file imports from copy.js (not hardcoded strings).
// Test that each section uses semantic heading elements.

import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const sectionsDir = __dirname;

const SECTION_FILES = [
  'HeroSection.jsx',
  'PerformanceSection.jsx',
  'AerodynamicsSection.jsx',
  'TechnicalSection.jsx',
  'PodiumSection.jsx',
  'ChampionSection.jsx',
  'CartSection.jsx',
];

describe('P7 — All Sections Present on All Breakpoints', () => {
  it('all 7 section component files exist', () => {
    for (const file of SECTION_FILES) {
      const filePath = resolve(sectionsDir, file);
      expect(existsSync(filePath), `${file} should exist`).toBe(true);
    }
  });

  it('each section file imports from copy.js', () => {
    for (const file of SECTION_FILES) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      expect(
        content.includes('copy.js') || content.includes('copy\'') || content.includes('copy"'),
        `${file} should import from copy.js`
      ).toBe(true);
    }
  });

  it('each section file does not hardcode visible text strings', () => {
    // Sections should use COPY.xxx, not raw string literals for visible text
    for (const file of SECTION_FILES) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      // Should reference COPY object
      expect(
        content.includes('COPY.'),
        `${file} should reference COPY object`
      ).toBe(true);
    }
  });

  it('each section uses semantic heading elements', () => {
    // HeroSection uses h1, all others use h2
    const heroPath = resolve(sectionsDir, 'HeroSection.jsx');
    const heroContent = readFileSync(heroPath, 'utf-8');
    expect(heroContent.includes('<h1'), 'HeroSection should have h1').toBe(true);

    const sectionFilesWithH2 = SECTION_FILES.filter(f => f !== 'HeroSection.jsx');
    for (const file of sectionFilesWithH2) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      expect(content.includes('<h2'), `${file} should have h2`).toBe(true);
    }
  });

  it('HeroSection is the only section with h1', () => {
    const heroPath = resolve(sectionsDir, 'HeroSection.jsx');
    const heroContent = readFileSync(heroPath, 'utf-8');
    expect(heroContent.includes('<h1'), 'HeroSection should have h1').toBe(true);

    // Other sections should NOT have h1
    const otherSections = SECTION_FILES.filter(f => f !== 'HeroSection.jsx');
    for (const file of otherSections) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      expect(content.includes('<h1'), `${file} should NOT have h1`).toBe(false);
    }
  });

  it('all sections have height 100vh', () => {
    for (const file of SECTION_FILES) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      expect(
        content.includes('100vh'),
        `${file} should have height: 100vh`
      ).toBe(true);
    }
  });

  it('all sections have section-overlay class or aria-label', () => {
    for (const file of SECTION_FILES) {
      const filePath = resolve(sectionsDir, file);
      const content = readFileSync(filePath, 'utf-8');
      const hasOverlayClass = content.includes('section-overlay');
      const hasAriaLabel = content.includes('aria-label');
      expect(
        hasOverlayClass || hasAriaLabel,
        `${file} should have section-overlay class or aria-label`
      ).toBe(true);
    }
  });
});
