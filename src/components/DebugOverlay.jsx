import { useRef, useEffect, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { DEV_MODE } from '../config/debug.js';
import { Z } from '../config/tokens.js';
import { motionState, SECTION } from '../utils/motionState.js';

// ─── DebugOverlay ─────────────────────────────────────────────────────────────
// DEV_MODE only. Fixed overlay showing FPS, section, scroll %, ball pos,
// camera pos, breakpoint, quality tier.
// Rendered inside Canvas via useFrame; displays via a portal div outside.

const SECTION_NAMES = ['Hero', 'Performance', 'Aerodynamics', 'Technical', 'Podium', 'Champion', 'Cart'];

// ─── DebugOverlayInner (inside Canvas) ───────────────────────────────────────
export function DebugOverlayInner({ onUpdate }) {
  const frameCount = useRef(0);
  const lastTime = useRef(performance.now());
  const frameTimes = useRef([]);

  useFrame(() => {
    if (!DEV_MODE) return;

    const now = performance.now();
    const delta = now - lastTime.current;
    lastTime.current = now;

    frameTimes.current.push(delta);
    if (frameTimes.current.length > 10) frameTimes.current.shift();

    frameCount.current++;

    // Update display every 10 frames
    if (frameCount.current % 10 === 0) {
      const avgDelta = frameTimes.current.reduce((a, b) => a + b, 0) / frameTimes.current.length;
      const fps = Math.round(1000 / avgDelta);

      onUpdate({
        fps,
        section: SECTION_NAMES[motionState.activeSectionIndex] || 'Unknown',
        scrollPct: (motionState.scrollProgress * 100).toFixed(1),
        ballPos: {
          x: motionState.position.x.toFixed(2),
          y: motionState.position.y.toFixed(2),
          z: motionState.position.z.toFixed(2),
        },
        camPos: {
          x: motionState.cameraPosition.x.toFixed(2),
          y: motionState.cameraPosition.y.toFixed(2),
          z: motionState.cameraPosition.z.toFixed(2),
        },
      });
    }
  });

  return null;
}

// ─── DebugOverlay (outside Canvas, fixed HTML) ───────────────────────────────
export default function DebugOverlay({ breakpoint, qualityTier }) {
  const [info, setInfo] = useState({
    fps: 0,
    section: 'Hero',
    scrollPct: '0.0',
    ballPos: { x: '0.00', y: '0.00', z: '0.00' },
    camPos: { x: '0.00', y: '0.00', z: '5.00' },
  });

  if (!DEV_MODE) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '80px',
        right: '16px',
        zIndex: Z.debugOverlay,
        background: 'rgba(0,0,0,0.75)',
        color: '#00ff88',
        fontFamily: '"IBM Plex Mono", monospace',
        fontSize: '11px',
        lineHeight: 1.6,
        padding: '12px 16px',
        borderRadius: '4px',
        pointerEvents: 'none',
        minWidth: '200px',
      }}
    >
      <div>FPS: {info.fps}</div>
      <div>Section: {info.section}</div>
      <div>Scroll: {info.scrollPct}%</div>
      <div>Ball: ({info.ballPos.x}, {info.ballPos.y}, {info.ballPos.z})</div>
      <div>Cam: ({info.camPos.x}, {info.camPos.y}, {info.camPos.z})</div>
      <div>Breakpoint: {breakpoint}</div>
      <div>Quality Tier: {qualityTier}</div>
    </div>
  );
}
