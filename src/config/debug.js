// ─── Debug Configuration ──────────────────────────────────────────────────────
// Single flag controlling all debug output.
// Always false in production — never ship debug overlays.

export const DEV_MODE = false;

// Individual system toggles (all gated behind DEV_MODE)
export const DEBUG = {
  scrollController:  false,
  projectionSystem:  false,
  audioEngine:       false,
  sceneAlignment:    false,
  fpsMonitor:        false,
  overlay:           false,
};
