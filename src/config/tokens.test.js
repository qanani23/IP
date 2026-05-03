// Property 3: Design Token Invariant
// Every exported value from tokens.js matches the specification exactly.
// No magic numbers may exist outside this file.

import { describe, it, expect } from 'vitest';
import {
  FONT_PRIMARY, FONT_MONO,
  FONT_SIZE, LINE_HEIGHT, LETTER_SPACING,
  SPACE, RADIUS, COLOR, SHADOW, EASE, EASE_GSAP,
  DURATION, SCRUB, LAYOUT, BREAKPOINT, CAMERA, ROTATION, Z,
} from './tokens.js';

describe('P3 — Design Token Invariant', () => {
  it('font families are correct', () => {
    expect(FONT_PRIMARY).toBe('"Inter", system-ui, sans-serif');
    expect(FONT_MONO).toBe('"IBM Plex Mono", monospace');
  });

  it('font sizes match spec', () => {
    expect(FONT_SIZE.h1.desktop).toBe(72);
    expect(FONT_SIZE.h1.mobile).toBe(40);
    expect(FONT_SIZE.h2.desktop).toBe(48);
    expect(FONT_SIZE.h2.mobile).toBe(28);
    expect(FONT_SIZE.h3.desktop).toBe(32);
    expect(FONT_SIZE.h3.mobile).toBe(22);
    expect(FONT_SIZE.body.desktop).toBe(16);
    expect(FONT_SIZE.body.mobile).toBe(15);
    expect(FONT_SIZE.caption.desktop).toBe(12);
    expect(FONT_SIZE.caption.mobile).toBe(11);
  });

  it('line heights match spec', () => {
    expect(LINE_HEIGHT.heading).toBe(1.05);
    expect(LINE_HEIGHT.body).toBe(1.6);
    expect(LINE_HEIGHT.caption).toBe(1.4);
  });

  it('letter spacing matches spec', () => {
    expect(LETTER_SPACING.h1).toBe('-0.03em');
    expect(LETTER_SPACING.h2).toBe('-0.02em');
    expect(LETTER_SPACING.body).toBe('0em');
    expect(LETTER_SPACING.caption).toBe('0.08em');
  });

  it('spacing scale uses 8px base unit', () => {
    expect(SPACE[1]).toBe(4);
    expect(SPACE[2]).toBe(8);
    expect(SPACE[3]).toBe(16);
    expect(SPACE[4]).toBe(24);
    expect(SPACE[5]).toBe(32);
    expect(SPACE[6]).toBe(48);
    expect(SPACE[7]).toBe(64);
    expect(SPACE[8]).toBe(96);
    expect(SPACE[9]).toBe(128);
  });

  it('border radius matches spec', () => {
    expect(RADIUS.sm).toBe(4);
    expect(RADIUS.md).toBe(8);
    expect(RADIUS.lg).toBe(16);
    expect(RADIUS.pill).toBe(9999);
  });

  it('background colors match spec', () => {
    expect(COLOR.bgPrimary).toBe('#0a0a0a');
    expect(COLOR.bgSurface).toBe('#111111');
    expect(COLOR.bgElevated).toBe('#1a1a1a');
  });

  it('text colors match spec', () => {
    expect(COLOR.textPrimary).toBe('#ffffff');
    expect(COLOR.textSecondary).toBe('rgba(255,255,255,0.6)');
    expect(COLOR.textMuted).toBe('rgba(255,255,255,0.35)');
  });

  it('accent colors match spec', () => {
    expect(COLOR.accentOrange).toBe('#e8500a');
    expect(COLOR.accentGold).toBe('#c9a84c');
    expect(COLOR.accentWhite).toBe('#ffffff');
  });

  it('shadow styles match spec', () => {
    expect(SHADOW.ball).toBe('0 40px 80px rgba(0,0,0,0.8)');
    expect(SHADOW.card).toBe('0 8px 32px rgba(0,0,0,0.5)');
    expect(SHADOW.glow).toBe('0 0 60px rgba(232,80,10,0.3)');
  });

  it('easing curves match spec', () => {
    expect(EASE.outExpo).toBe('cubic-bezier(0.16, 1, 0.3, 1)');
    expect(EASE.inOutQuart).toBe('cubic-bezier(0.76, 0, 0.24, 1)');
    expect(EASE.spring).toBe('cubic-bezier(0.34, 1.56, 0.64, 1)');
  });

  it('durations match spec', () => {
    expect(DURATION.entrance).toBe(800);
    expect(DURATION.exit).toBe(600);
    expect(DURATION.stagger).toBe(80);
    expect(DURATION.cameraTransition).toBe(1200);
    expect(DURATION.cartAnimation).toBe(900);
    expect(DURATION.heroScale).toBe(800);
    expect(DURATION.loadingFade).toBe(400);
  });

  it('scrub value matches spec', () => {
    expect(SCRUB).toBe(1);
  });

  it('layout values match spec', () => {
    expect(LAYOUT.maxContentWidth).toBe(1440);
    expect(LAYOUT.navHeight).toBe(64);
    expect(LAYOUT.pagePadding.desktop).toBe(80);
    expect(LAYOUT.pagePadding.tablet).toBe(40);
    expect(LAYOUT.pagePadding.mobile).toBe(20);
    expect(LAYOUT.sectionGap.desktop).toBe(160);
    expect(LAYOUT.sectionGap.tablet).toBe(120);
    expect(LAYOUT.sectionGap.mobile).toBe(80);
    expect(LAYOUT.minTouchTarget).toBe(48);
  });

  it('camera FOV values match spec', () => {
    expect(CAMERA.fov.desktop).toBe(45);
    expect(CAMERA.fov.tablet).toBe(50);
    expect(CAMERA.fov.mobile).toBe(60);
    expect(CAMERA.minDistance).toBe(3);
  });

  it('z-index table matches spec', () => {
    expect(Z.scene).toBe(0);
    expect(Z.content).toBe(10);
    expect(Z.nav).toBe(100);
    expect(Z.loading).toBe(200);
    expect(Z.cartProxy).toBe(999);
    expect(Z.skipLink).toBe(1000);
    expect(Z.debugOverlay).toBe(1001);
  });

  it('all token values are defined (no undefined)', () => {
    const allTokens = [
      FONT_PRIMARY, FONT_MONO,
      FONT_SIZE, LINE_HEIGHT, LETTER_SPACING,
      SPACE, RADIUS, COLOR, SHADOW, EASE, EASE_GSAP,
      DURATION, SCRUB, LAYOUT, BREAKPOINT, CAMERA, ROTATION, Z,
    ];
    allTokens.forEach(token => {
      expect(token).toBeDefined();
    });
  });
});
