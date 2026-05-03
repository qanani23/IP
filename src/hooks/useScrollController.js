import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { motionState, SECTION } from '../utils/motionState.js';
import { SCRUB, ROTATION } from '../config/tokens.js';
import { DEBUG } from '../config/debug.js';

gsap.registerPlugin(ScrollTrigger);

// ─── Section keyframe definitions ────────────────────────────────────────────
// Each section occupies 100vh. Total scroll: 700vh.
// Section overlap: 12% of each section's range blends into the next.
// All rotation values are cumulative (never reset).

function buildKeyframes(sceneOffset, breakpoint) {
  const off = sceneOffset;
  const isMobile = breakpoint === 'mobile';

  // Mobile: reduce camera movement by 20%, rotation by 15%
  const camMult = isMobile ? 0.8 : 1.0;
  const rotMult = isMobile ? 0.85 : 1.0;
  const fullRot = Math.PI * 2 * (isMobile ? ROTATION.scrollFullRotationMobile : ROTATION.scrollFullRotation);

  return [
    // 0: Hero (0–14%)
    {
      position:       { x: off, y: 0, z: 0 },
      rotation:       { x: 0, y: 0, z: 0 },
      scale:          1,
      cameraPosition: { x: 0, y: 0, z: 5 * camMult + (1 - camMult) },
      cameraLookAtOverride: null,
      pedestalVisible: false,
    },
    // 1: Performance (14–28%)
    {
      position:       { x: off, y: 0.3, z: 0 },
      rotation:       { x: 0, y: fullRot * 0.25 * rotMult, z: 0 },
      scale:          1,
      cameraPosition: { x: 0.5 * camMult, y: 0.5 * camMult, z: 4 },
      cameraLookAtOverride: null,
      pedestalVisible: false,
    },
    // 2: Aerodynamics (28–42%)
    {
      position:       { x: off * 1.1, y: -0.2, z: 0 },
      rotation:       { x: -0.52 * rotMult, y: fullRot * 0.5 * rotMult, z: 0 },
      scale:          1,
      cameraPosition: { x: -0.3 * camMult, y: 0, z: 4.5 },
      cameraLookAtOverride: null,
      pedestalVisible: false,
    },
    // 3: Technical (42–56%)
    {
      position:       { x: off, y: 0.1, z: 0 },
      rotation:       { x: -0.52 * rotMult, y: fullRot * 0.625 * rotMult, z: 0 },
      scale:          1,
      cameraPosition: { x: 0, y: 0.2 * camMult, z: 4.2 },
      cameraLookAtOverride: null,
      pedestalVisible: false,
    },
    // 4: Podium (56–70%)
    {
      position:       { x: 0, y: -0.5, z: 0 },
      rotation:       { x: -0.52 * rotMult, y: fullRot * 0.75 * rotMult, z: 0 },
      scale:          1,
      cameraPosition: { x: 0, y: 0.8 * camMult, z: 5.5 },
      cameraLookAtOverride: null,
      pedestalVisible: true,
    },
    // 5: Champion (70–84%)
    {
      position:       { x: 0, y: 0, z: 0 },
      rotation:       { x: 0, y: fullRot * 0.875 * rotMult, z: 0 },
      scale:          1.05,
      cameraPosition: { x: 0, y: 0, z: 4.8 },
      cameraLookAtOverride: { x: 0, y: 0, z: 0 },
      pedestalVisible: true,
    },
    // 6: Cart (84–100%)
    {
      position:       { x: 0, y: 0, z: 0 },
      rotation:       { x: 0, y: fullRot * rotMult, z: 0 },
      scale:          1.05,
      cameraPosition: { x: 0, y: 0, z: 4.8 },
      cameraLookAtOverride: { x: 0, y: 0, z: 0 },
      pedestalVisible: false,
    },
  ];
}

// ─── useScrollController ──────────────────────────────────────────────────────
// Owns: GSAP master timeline, ScrollTrigger pinning, keyframe definitions.
// Does NOT touch 3D objects — writes target values to motionState only.

export function useScrollController({ sceneOffset, breakpoint, scrollWrapperRef }) {
  const timelineRef = useRef(null);
  const triggersRef = useRef([]);

  useEffect(() => {
    if (!scrollWrapperRef?.current) return;

    // ── Kill all existing ScrollTriggers (ScrollTrigger Stability Rule) ──────
    ScrollTrigger.getAll().forEach(t => t.kill());
    if (timelineRef.current) {
      timelineRef.current.kill();
      timelineRef.current = null;
    }

    const keyframes = buildKeyframes(sceneOffset, breakpoint);
    const totalSections = keyframes.length; // 7
    const sectionHeight = 100; // vh per section
    const totalHeight   = totalSections * sectionHeight; // 700vh
    const overlapFraction = 0.12; // 12% overlap between sections

    // ── Pin the scroll wrapper for the full 700vh ─────────────────────────────
    const pinTrigger = ScrollTrigger.create({
      trigger:  scrollWrapperRef.current,
      start:    'top top',
      end:      `+=${totalHeight}vh`,
      pin:      true,
      pinSpacing: true,
      markers:  DEBUG.scrollController && process.env.NODE_ENV === 'development',
    });
    triggersRef.current.push(pinTrigger);

    // ── Master timeline ───────────────────────────────────────────────────────
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger:  scrollWrapperRef.current,
        start:    'top top',
        end:      `+=${totalHeight}vh`,
        scrub:    SCRUB,
        markers:  DEBUG.scrollController && process.env.NODE_ENV === 'development',
        onUpdate: (self) => {
          motionState.scrollProgress = self.progress;

          // Determine active section
          const sectionProgress = self.progress * totalSections;
          const sectionIndex = Math.min(Math.floor(sectionProgress), totalSections - 1);
          motionState.activeSectionIndex = sectionIndex;

          if (DEBUG.scrollController) {
            const names = ['Hero','Performance','Aerodynamics','Technical','Podium','Champion','Cart'];
            console.log(`[ScrollController] ${(self.progress * 100).toFixed(1)}% | ${names[sectionIndex]}`);
          }
        },
      },
    });

    // ── Add keyframe tweens with 12% overlap ──────────────────────────────────
    // Each section occupies 1/7 of the total timeline (normalized 0–1)
    const sectionDuration = 1 / totalSections;
    const overlapDuration = sectionDuration * overlapFraction;

    for (let i = 0; i < totalSections - 1; i++) {
      const from = keyframes[i];
      const to   = keyframes[i + 1];
      const startPos = i * sectionDuration + overlapDuration;
      const endPos   = (i + 1) * sectionDuration + overlapDuration;
      const dur      = endPos - startPos;

      // Ball position
      tl.to(motionState.position, {
        x: to.position.x,
        y: to.position.y,
        z: to.position.z,
        ease: 'expo.out',
        duration: dur,
      }, startPos);

      // Ball rotation (cumulative, ease: none for proportional scroll feel)
      tl.to(motionState.rotation, {
        x: to.rotation.x,
        y: to.rotation.y,
        z: to.rotation.z,
        ease: 'none',
        duration: dur,
      }, startPos);

      // Ball scale
      tl.to(motionState, {
        scale: to.scale,
        ease: 'expo.out',
        duration: dur,
      }, startPos);

      // Camera position
      tl.to(motionState.cameraPosition, {
        x: to.cameraPosition.x,
        y: to.cameraPosition.y,
        z: to.cameraPosition.z,
        ease: 'expo.out',
        duration: dur,
      }, startPos);

      // Pedestal visibility (snap at midpoint)
      const midPos = startPos + dur * 0.5;
      tl.call(() => {
        motionState.pedestalVisible = to.pedestalVisible;
      }, [], midPos);

      // Camera lookAt override
      tl.call(() => {
        motionState.cameraLookAtOverride = to.cameraLookAtOverride;
      }, [], startPos);
    }

    timelineRef.current = tl;

    // Refresh after build
    ScrollTrigger.refresh();

    return () => {
      // Cleanup on unmount or dependency change
      ScrollTrigger.getAll().forEach(t => t.kill());
      if (timelineRef.current) {
        timelineRef.current.kill();
        timelineRef.current = null;
      }
      triggersRef.current = [];
    };
  }, [sceneOffset, breakpoint, scrollWrapperRef]);

  return timelineRef;
}
