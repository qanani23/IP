import { useRef, useState, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { DEV_MODE } from '../config/debug.js';
import { COLOR, Z } from '../config/tokens.js';

// ─── FPS quality tiers ────────────────────────────────────────────────────────
// Tier 0: FPS ≥ 30 (full quality)
// Tier 1: FPS < 30 for > 500ms (reduced geometry)
// Tier 2: FPS < 20 for > 500ms (no shader)
// Tier 3: FPS < 15 for > 500ms (no shadows, pixel ratio → 1)

const TIER_THRESHOLDS = [30, 20, 15];
const TIER_HOLD_MS = 500; // must sustain low FPS for this long before downgrading

const ROLLING_WINDOW = 10; // frames

// ─── useFPSMonitor ────────────────────────────────────────────────────────────
// Returns { fps, qualityTier }.
// Tier only decreases mid-session (never upgrades).

export function useFPSMonitor() {
  const fpsRef = useRef(60);
  const qualityTierRef = useRef(0);
  const [displayState, setDisplayState] = useState({ fps: 60, qualityTier: 0 });

  const frameTimes = useRef([]);
  const lastTime = useRef(performance.now());
  const tierDropTime = useRef(null);
  const pendingTier = useRef(null);

  useFrame(() => {
    const now = performance.now();
    const delta = now - lastTime.current;
    lastTime.current = now;

    // Rolling 10-frame average
    frameTimes.current.push(delta);
    if (frameTimes.current.length > ROLLING_WINDOW) {
      frameTimes.current.shift();
    }

    const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
    const fps = Math.round(1000 / avgDelta);
    fpsRef.current = fps;

    // Determine target tier (only downgrade)
    let targetTier = 0;
    if (fps < TIER_THRESHOLDS[2]) targetTier = 3;
    else if (fps < TIER_THRESHOLDS[1]) targetTier = 2;
    else if (fps < TIER_THRESHOLDS[0]) targetTier = 1;

    // Only allow downgrade
    const effectiveTier = Math.max(targetTier, qualityTierRef.current);

    if (effectiveTier > qualityTierRef.current) {
      // Start hold timer
      if (pendingTier.current !== effectiveTier) {
        pendingTier.current = effectiveTier;
        tierDropTime.current = now;
      } else if (now - tierDropTime.current >= TIER_HOLD_MS) {
        qualityTierRef.current = effectiveTier;
        pendingTier.current = null;
        tierDropTime.current = null;
        setDisplayState({ fps, qualityTier: effectiveTier });
      }
    } else {
      pendingTier.current = null;
      tierDropTime.current = null;
      // Update display every ~10 frames
      if (frameTimes.current.length === ROLLING_WINDOW) {
        setDisplayState(prev => {
          if (Math.abs(prev.fps - fps) > 2 || prev.qualityTier !== qualityTierRef.current) {
            return { fps, qualityTier: qualityTierRef.current };
          }
          return prev;
        });
      }
    }
  });

  return displayState;
}

// ─── FPSMonitor component (R3F, renders inside Canvas) ───────────────────────
// DEV_MODE only: renders visible FPS counter top-right of scene canvas.

export default function FPSMonitor() {
  const { fps, qualityTier } = useFPSMonitor();

  if (!DEV_MODE) return null;

  // Render as HTML overlay via portal — but since we're inside Canvas,
  // we use a fixed-position div via useEffect
  return null; // Actual rendering handled by DebugOverlay outside Canvas
}
