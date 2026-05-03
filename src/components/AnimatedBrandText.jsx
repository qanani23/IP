// ─── AnimatedBrandText ────────────────────────────────────────────────────────
// Giant background text that fills the viewport — the 3D house floats in front.
// Shows the HOUSE NAME (e.g. "MODERN HOUSE") not the brand name.
// Animates character-by-character when the selected property changes.
// Matches the reference: large dark-gray text, model sits in the "O" position.

import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import { useTheme } from '../context/ThemeContext.jsx';
import { HOUSES } from '../data/houseData.js';

const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

export default function AnimatedBrandText() {
  const containerRef = useRef(null);
  const lettersRef   = useRef([]);

  let themeContext;
  try { themeContext = useTheme(); } catch { themeContext = null; }

  const activeIndex = THEME_ORDER.indexOf(themeContext?.activeTheme ?? 'gold');
  const activeHouse = HOUSES[activeIndex] ?? HOUSES[0];

  // Use the house name as the watermark text — uppercase, spaces become non-breaking
  const displayText = activeHouse.name.toUpperCase();

  const splitTextIntoLetters = (text) => {
    return text.split('').map((char, index) => (
      <span
        key={`${char}-${index}`}
        ref={el => { lettersRef.current[index] = el; }}
        style={{
          display: 'inline-block',
          opacity: 0,
          transform: 'translateY(40px)',
          willChange: 'transform, opacity',
        }}
      >
        {char === ' ' ? '\u00A0' : char}
      </span>
    ));
  };

  // Animate letters when house changes
  useEffect(() => {
    if (!containerRef.current || !themeContext) return;

    const letters = lettersRef.current.filter(Boolean);
    if (!letters.length) return;

    const tl = gsap.timeline();

    tl.to(letters, {
      opacity: 0,
      y: -24,
      duration: 0.3,
      stagger: { each: 0.015, from: 'start' },
      ease: 'power2.in',
    })
    .set(letters, { y: 40 })
    .to(letters, {
      opacity: 1,
      y: 0,
      duration: 0.55,
      stagger: { each: 0.025, from: 'start' },
      ease: 'power3.out',
    });

    return () => tl.kill();
  }, [themeContext?.activeTheme]);

  if (!themeContext) return null;

  // Text color: dark gray, very subtle — matches reference "SPAING" color
  const textColor = 'rgba(255,255,255,0.08)';

  return (
    <div
      ref={containerRef}
      className="hero-brand-text"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
        zIndex: 1,
        overflow: 'hidden',
        padding: '0 20px',
      }}
    >
      <div
        style={{
          fontFamily: '"Inter", system-ui, sans-serif',
          /* Scale font so text fills ~90% of viewport width */
          fontSize: 'clamp(80px, 14vw, 200px)',
          fontWeight: 900,
          letterSpacing: '-0.01em',
          lineHeight: 1,
          color: textColor,
          userSelect: 'none',
          whiteSpace: 'nowrap',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          textRendering: 'optimizeLegibility',
          fontFeatureSettings: '"kern" 1',
        }}
      >
        {splitTextIntoLetters(displayText)}
      </div>
    </div>
  );
}
