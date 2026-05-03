// ─── Theme Context ────────────────────────────────────────────────────────────
// Global state for real-time property/color customization.
// Controls house model colors, environment lighting, and UI accents.
// Syncs 3D scene with 2D layout for cohesive color transitions.

import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import gsap from 'gsap';

// ─── Color Palettes ───────────────────────────────────────────────────────────
// Each theme maps to a house in HOUSES and defines a complete design system.
// primary   — house base / fallback color
// accent    — highlight / rim light color
// uiAccent  — 2D HTML accent (borders, highlights)
// textGlow  — background watermark text color
// priceColor — price display color

export const COLOR_THEMES = {
  gold: {
    id: 'gold', name: 'Modern House', brandText: 'MODERN HOUSE',
    primary: '#c9a84c', accent: '#ffd700', secondary: '#8b7355',
    background: '#0d0d0d', uiAccent: '#c9a84c', fog: '#0d0d0d',
    textGlow: 'rgba(255,255,255,0.07)', priceColor: '#c9a84c',
  },
  colonial: {
    id: 'colonial', name: 'Minimalist Residence', brandText: 'MINIMALIST RESIDENCE',
    primary: '#8b7355', accent: '#d4a96a', secondary: '#5c4a30',
    background: '#0d0d0d', uiAccent: '#d4a96a', fog: '#0d0d0d',
    textGlow: 'rgba(255,255,255,0.07)', priceColor: '#d4a96a',
  },
  garden: {
    id: 'garden', name: 'Minimalist Villa', brandText: 'MINIMALIST VILLA',
    primary: '#3d5a2e', accent: '#6b8e23', secondary: '#1a2e0a',
    background: '#0d0d0d', uiAccent: '#6b8e23', fog: '#0d0d0d',
    textGlow: 'rgba(255,255,255,0.07)', priceColor: '#6b8e23',
  },
  sky: {
    id: 'sky', name: 'Luxury Villa', brandText: 'LUXURY VILLA',
    primary: '#2d5a8f', accent: '#4a90e2', secondary: '#0f1e30',
    background: '#0d0d0d', uiAccent: '#4a90e2', fog: '#0d0d0d',
    textGlow: 'rgba(255,255,255,0.07)', priceColor: '#4a90e2',
  },
  farmhouse: {
    id: 'farmhouse', name: 'Urban Retreat', brandText: 'URBAN RETREAT',
    primary: '#9a9a9a', accent: '#e8e8e8', secondary: '#606060',
    background: '#0d0d0d', uiAccent: '#c0c0c0', fog: '#0d0d0d',
    textGlow: 'rgba(255,255,255,0.07)', priceColor: '#c0c0c0',
  },
};

// ─── Theme order (matches HOUSES order) ──────────────────────────────────────
const THEME_ORDER = ['gold', 'colonial', 'garden', 'sky', 'farmhouse'];

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [activeTheme, setActiveTheme] = useState('gold');
  const [isTransitioning, setIsTransitioning] = useState(false);

  const theme = COLOR_THEMES[activeTheme];

  // Apply CSS custom properties for 2D UI sync
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--ui-accent',   theme.uiAccent);
    root.style.setProperty('--price-color', theme.priceColor);
    root.style.setProperty('--text-glow',   theme.textGlow);
  }, [theme]);

  const switchTheme = useCallback((newThemeId) => {
    if (isTransitioning || newThemeId === activeTheme) return;

    setIsTransitioning(true);

    // Animate CSS custom properties via GSAP
    const current = COLOR_THEMES[activeTheme];
    const next    = COLOR_THEMES[newThemeId];

    const proxy = {
      uiR: parseInt(current.uiAccent.slice(1, 3), 16),
      uiG: parseInt(current.uiAccent.slice(3, 5), 16),
      uiB: parseInt(current.uiAccent.slice(5, 7), 16),
    };

    gsap.to(proxy, {
      uiR: parseInt(next.uiAccent.slice(1, 3), 16),
      uiG: parseInt(next.uiAccent.slice(3, 5), 16),
      uiB: parseInt(next.uiAccent.slice(5, 7), 16),
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => {
        const hex = `#${Math.round(proxy.uiR).toString(16).padStart(2, '0')}${Math.round(proxy.uiG).toString(16).padStart(2, '0')}${Math.round(proxy.uiB).toString(16).padStart(2, '0')}`;
        document.documentElement.style.setProperty('--ui-accent', hex);
      },
      onComplete: () => {
        setActiveTheme(newThemeId);
        setIsTransitioning(false);
      },
    });
  }, [activeTheme, isTransitioning]);

  const nextTheme = useCallback(() => {
    const idx = THEME_ORDER.indexOf(activeTheme);
    const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length];
    switchTheme(next);
  }, [activeTheme, switchTheme]);

  const prevTheme = useCallback(() => {
    const idx = THEME_ORDER.indexOf(activeTheme);
    const prev = THEME_ORDER[(idx - 1 + THEME_ORDER.length) % THEME_ORDER.length];
    switchTheme(prev);
  }, [activeTheme, switchTheme]);

  const value = {
    theme,
    themes:         COLOR_THEMES,
    activeTheme,
    isTransitioning,
    nextTheme,
    prevTheme,
    switchTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
