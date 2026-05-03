// ─── Design + Motion Tokens ──────────────────────────────────────────────────
// Single source of truth for all visual and motion values.
// No component may use magic numbers — import from here exclusively.

// ─── Typography ──────────────────────────────────────────────────────────────
export const FONT_PRIMARY = '"Inter", system-ui, sans-serif';
export const FONT_MONO    = '"IBM Plex Mono", monospace';

export const FONT_SIZE = {
  h1:      { desktop: 72,  mobile: 40 },
  h2:      { desktop: 48,  mobile: 28 },
  h3:      { desktop: 32,  mobile: 22 },
  body:    { desktop: 16,  mobile: 15 },
  caption: { desktop: 12,  mobile: 11 },
};

export const LINE_HEIGHT = {
  heading: 1.05,
  body:    1.6,
  caption: 1.4,
};

export const LETTER_SPACING = {
  h1:      '-0.03em',
  h2:      '-0.02em',
  body:    '0em',
  caption: '0.08em',
};

// ─── Spacing (8px base unit) ──────────────────────────────────────────────────
export const SPACE = {
  1: 4,
  2: 8,
  3: 16,
  4: 24,
  5: 32,
  6: 48,
  7: 64,
  8: 96,
  9: 128,
};

// ─── Border Radius ────────────────────────────────────────────────────────────
export const RADIUS = {
  sm:   4,
  md:   8,
  lg:   16,
  pill: 9999,
};

// ─── Colors ───────────────────────────────────────────────────────────────────
export const COLOR = {
  bgPrimary:     '#0a0a0a',
  bgSurface:     '#111111',
  bgElevated:    '#1a1a1a',
  textPrimary:   '#ffffff',
  textSecondary: 'rgba(255,255,255,0.6)',
  textMuted:     'rgba(255,255,255,0.35)',
  accentOrange:  '#e8500a',
  accentGold:    '#c9a84c',
  accentWhite:   '#ffffff',
};

// ─── Shadows ──────────────────────────────────────────────────────────────────
export const SHADOW = {
  ball: '0 40px 80px rgba(0,0,0,0.8)',
  card: '0 8px 32px rgba(0,0,0,0.5)',
  glow: '0 0 60px rgba(232,80,10,0.3)',
};

// ─── Motion Easing ────────────────────────────────────────────────────────────
export const EASE = {
  outExpo:    'cubic-bezier(0.16, 1, 0.3, 1)',
  inOutQuart: 'cubic-bezier(0.76, 0, 0.24, 1)',
  spring:     'cubic-bezier(0.34, 1.56, 0.64, 1)',
};

// GSAP-compatible easing strings
export const EASE_GSAP = {
  outExpo:    'expo.out',
  inOutQuart: 'power4.inOut',
  spring:     'back.out(1.7)',
};

// ─── Motion Durations (ms) ────────────────────────────────────────────────────
export const DURATION = {
  entrance:         800,
  exit:             600,
  stagger:           80,
  cameraTransition: 1200,
  cartAnimation:     900,
  heroScale:         800,
  loadingFade:       400,
  hoverIn:           300,
  hoverOut:          400,
  cartIconPulse:     400,
  fovTransition:     300,
};

// ─── Scroll ───────────────────────────────────────────────────────────────────
export const SCRUB = 1; // GSAP ScrollTrigger scrub value

// ─── Layout ───────────────────────────────────────────────────────────────────
export const LAYOUT = {
  maxContentWidth: 1440,
  navHeight:       64,
  pagePadding: {
    desktop: 80,
    tablet:  40,
    mobile:  20,
  },
  sectionGap: {
    desktop: 160,
    tablet:  120,
    mobile:   80,
  },
  textColumn: {
    desktop: '45%',
    tablet:  '50%',
    mobile:  '100%',
  },
  ballOffset: {
    desktop: 0.15, // fraction of viewport width in world units
    tablet:  0,
    mobile:  0,
  },
  minTouchTarget: 48,
};

// ─── Breakpoints ──────────────────────────────────────────────────────────────
export const BREAKPOINT = {
  mobile:  768,   // < 768px
  tablet:  1200,  // 768–1199px
  // desktop: >= 1200px
};

// ─── Camera ───────────────────────────────────────────────────────────────────
export const CAMERA = {
  fov: {
    desktop: 45,
    tablet:  50,
    mobile:  60,
  },
  minDistance: 3,       // world units — never closer than this
  lerpFactor:  0.05,    // per-frame smoothing
  parallaxMag: 0.1,     // camera parallax magnitude vs ball displacement
  parallaxMagMobile: 0.05,
  safeZone: { min: 0.05, max: 0.95 }, // projected screen bounds [5%–95%]
};

// ─── Ball Rotation ────────────────────────────────────────────────────────────
export const ROTATION = {
  idleSpeed:        0.003,  // rad/frame Y-axis idle
  idleSpeedMobile:  0.00255, // 0.003 × 0.85
  hoverBoost:       0.008,  // additive rad/frame on hover
  maxJumpPerFrame:  0.1,    // rad — never jump more than this
  scrollFullRotation: 1,    // full Y rotations per 100vh (mobile: 0.85)
  scrollFullRotationMobile: 0.85,
};

// ─── Z-Index table ────────────────────────────────────────────────────────────
export const Z = {
  scene:        0,
  content:      10,
  nav:          100,
  loading:      200,
  cartProxy:    999,
  skipLink:     1000,
  debugOverlay: 1001,
  modal:        500,
  drawer:       400,
  toast:        600,
  overlay:      300,
};
