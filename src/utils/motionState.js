// ─── motionState — Single Source of Truth for Ball + Camera Transforms ────────
//
// OWNERSHIP RULES:
//   WRITE: useScrollController (via GSAP tweens) ONLY
//   READ:  useSceneMotion (via useFrame) ONLY
//   NEVER: React useState, component props, or any other system
//
// This object is a plain mutable ref — not reactive.
// GSAP animates its properties directly. R3F reads them each frame.

export const motionState = {
  // Ball world-space position
  position: { x: 0, y: 0, z: 0 },

  // Ball rotation (cumulative, never reset)
  rotation: { x: 0, y: 0, z: 0 },

  // Ball uniform scale
  scale: 1,

  // Camera world-space position (GSAP writes keyframe targets here)
  cameraPosition: { x: 0, y: 0, z: 5 },

  // Camera lookAt override:
  //   null  → track ball.position every frame (default)
  //   {x,y,z} → fixed world-space target (Champion + Cart sections)
  cameraLookAtOverride: null,

  // Additive hover delta (applied on top of GSAP base scale)
  hoverScaleDelta: 0,

  // Additive hover rotation boost (rad/frame, applied in useSceneMotion)
  hoverRotationBoost: 0,

  // Current active section index (0–6), set by useScrollController
  activeSectionIndex: 0,

  // Scroll progress 0–1, set by useScrollController
  scrollProgress: 0,

  // Whether Pedestal should be visible
  pedestalVisible: false,
};

// Section index constants for clarity
export const SECTION = {
  HERO:         0,
  PERFORMANCE:  1,
  AERODYNAMICS: 2,
  TECHNICAL:    3,
  PODIUM:       4,
  CHAMPION:     5,
  CART:         6,
};
