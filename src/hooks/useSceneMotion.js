import { useRef } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { motionState } from '../utils/motionState.js';
import { CAMERA, ROTATION } from '../config/tokens.js';

// ─── useSceneMotion ───────────────────────────────────────────────────────────
// Reads motionState every frame and applies to Ball mesh and camera.
// GSAP writes scroll-driven target values to motionState.
// This hook applies them to the Three.js camera with smooth interpolation.
// The Basketball component reads motionState directly in its own useFrame.

export function useSceneMotion({ ballRef, breakpoint }) {
  const { camera } = useThree();
  const lookAtTarget  = useRef(new THREE.Vector3());
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const isMobile = breakpoint === 'mobile';

  // ── Scroll velocity tracking ──────────────────────────────────────────────
  const lastScrollY    = useRef(typeof window !== 'undefined' ? window.scrollY : 0);
  const scrollVelocity = useRef(0);
  const smoothVelocity = useRef(0);

  useFrame((state) => {
    const ms = motionState;

    const currentScrollY = window.scrollY;
    const rawDelta = currentScrollY - lastScrollY.current;
    lastScrollY.current = currentScrollY;

    // Exponential smoothing: α = 0.25 (responsive but not jittery)
    scrollVelocity.current = rawDelta;
    smoothVelocity.current += (scrollVelocity.current - smoothVelocity.current) * 0.25;

    // Decay toward zero when not scrolling
    smoothVelocity.current *= 0.88;

    // ── Idle Y rotation — Hero section only ──────────────────────────────────
    // On other sections, GSAP scroll drives rotation. Idle only on Hero.
    if (ms.activeSectionIndex === 0) {
      const idleSpeed = isMobile ? ROTATION.idleSpeedMobile : ROTATION.idleSpeed;
      ms.rotation.y += idleSpeed;
    }

    // ── Velocity-based rotation boost (all sections) ─────────────────────────
    // Clamp to ±maxJumpPerFrame so a sudden fast scroll can't snap the ball.
    const velocityBoost = smoothVelocity.current * 0.0018;
    const clampedBoost  = Math.max(-ROTATION.maxJumpPerFrame, Math.min(ROTATION.maxJumpPerFrame, velocityBoost));
    ms.rotation.y += clampedBoost;

    // Hover rotation boost (additive, all sections)
    if (ms.hoverRotationBoost > 0) {
      ms.rotation.y += ms.hoverRotationBoost;
    }

    // ── Camera position — lerp toward motionState target ─────────────────────
    const lf = 0.06;
    camera.position.x += (ms.cameraPosition.x - camera.position.x) * lf;
    camera.position.y += (ms.cameraPosition.y - camera.position.y) * lf;
    camera.position.z += (ms.cameraPosition.z - camera.position.z) * lf;

    // Safety: never closer than minDistance
    if (camera.position.z < CAMERA.minDistance) {
      camera.position.z = CAMERA.minDistance;
    }

    // ── Camera lookAt ─────────────────────────────────────────────────────────
    if (ms.cameraLookAtOverride) {
      lookAtTarget.current.set(
        ms.cameraLookAtOverride.x,
        ms.cameraLookAtOverride.y,
        ms.cameraLookAtOverride.z
      );
    } else {
      // Track ball with slight upward bias — more flattering angle
      lookAtTarget.current.set(ms.position.x, ms.position.y + 0.15, ms.position.z);
    }

    currentLookAt.current.lerp(lookAtTarget.current, lf * 2.5);
    camera.lookAt(currentLookAt.current);
    camera.updateMatrixWorld();

    // ── Invalidate renderer ───────────────────────────────────────────────────
    state.invalidate();
  });
}
