// ─── ThemeBorder ─────────────────────────────────────────────────────────────
// Updates CSS custom properties when the theme changes.
// --ui-accent drives both the UI highlights AND the body::before frame color.

import { useEffect } from 'react';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemeBorder() {
  const { theme } = useTheme();

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ui-accent',   theme.uiAccent);
    root.style.setProperty('--price-color', theme.priceColor);
    root.style.setProperty('--text-glow',   theme.textGlow);
    // Keep html/body background in sync so the frame color transitions
    root.style.backgroundColor = theme.uiAccent;
    document.body.style.backgroundColor = theme.uiAccent;
    // Update corner gradient colors
    const corners = [
      ['tl', '100% 100%'], ['tr', '0% 100%'],
      ['bl', '100% 0%'],   ['br', '0% 0%'],
    ];
    corners.forEach(([pos, at]) => {
      const el = document.querySelector(`.frame-corner-${pos}`);
      if (el) el.style.background = `radial-gradient(circle at ${at}, transparent 22px, ${theme.uiAccent} 23px)`;
    });
  }, [theme]);

  return null;
}
