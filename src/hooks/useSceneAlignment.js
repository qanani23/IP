import { useState, useEffect, useCallback, useRef } from 'react';
import { BREAKPOINT, CAMERA, LAYOUT } from '../config/tokens.js';
import { DEBUG } from '../config/debug.js';

// ─── useSceneAlignment ────────────────────────────────────────────────────────
// Continuously recalculates 3D scene dimensions and maps them to 2D layout.
// This is the bridge between the Three.js world and the HTML layout.
//
// Returns:
//   breakpoint       — 'mobile' | 'tablet' | 'desktop'
//   viewport         — { width, height }
//   dpr              — Math.min(devicePixelRatio, 2)
//   sceneOffset      — horizontal ball offset in world units
//   cameraFov        — 45 | 50 | 60
//   pagePadding      — 20 | 40 | 80 (px)
//   sectionGap       — 80 | 120 | 160 (px)
//   textColumnWidth  — CSS width for text column (keeps text clear of ball)
//   ballSide         — 'left' | 'right' | 'center' (which side ball is on)

function computeAlignment(width, height) {
  const dpr = Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 2);

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

  // sceneOffset: world-space X offset for ball positioning
  let sceneOffset = 0;
  if (breakpoint === 'desktop') {
    sceneOffset = 1.2;
  } else if (breakpoint === 'tablet') {
    sceneOffset = 0.6;
  }

  // textColumnWidth: how wide the text column should be
  // On desktop/tablet, text is on left, ball is on right — text gets 45-50%
  // On mobile, text gets full width (ball is behind/below)
  const textColumnWidth = breakpoint === 'mobile' ? '100%'
    : breakpoint === 'tablet' ? '50%'
    : '45%';

  return {
    breakpoint,
    viewport: { width, height },
    dpr,
    sceneOffset,
    cameraFov,
    pagePadding,
    sectionGap,
    textColumnWidth,
  };
}

export function useSceneAlignment() {
  const [alignment, setAlignment] = useState(() => {
    if (typeof window === 'undefined') {
      return computeAlignment(1440, 900);
    }
    return computeAlignment(window.innerWidth, window.innerHeight);
  });

  const rafRef = useRef(null);

  const recalculate = useCallback(() => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const next = computeAlignment(w, h);

      if (DEBUG.sceneAlignment) {
        console.log('[useSceneAlignment]', next);
      }

      setAlignment(prev => {
        if (
          prev.breakpoint === next.breakpoint &&
          prev.viewport.width === next.viewport.width &&
          prev.viewport.height === next.viewport.height
        ) return prev;
        return next;
      });
    });
  }, []);

  useEffect(() => {
    const observer = new ResizeObserver(recalculate);
    observer.observe(document.documentElement);
    window.addEventListener('orientationchange', recalculate);

    return () => {
      observer.disconnect();
      window.removeEventListener('orientationchange', recalculate);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [recalculate]);

  return alignment;
}
