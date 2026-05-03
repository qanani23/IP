import * as THREE from 'three';
import { DEBUG } from '../config/debug.js';

// ─── projectionSystem ─────────────────────────────────────────────────────────
// Converts 3D ball world position to 2D screen coordinates.
// Uses proper THREE.js camera projection for pixel-accurate results.

// Shared camera reference — set by SceneCanvas when camera is available
let _camera = null;
let _domElement = null;

/**
 * Register the Three.js camera and canvas element.
 * Called from inside the R3F Canvas via a useEffect.
 */
export function registerCamera(camera, domElement) {
  _camera = camera;
  _domElement = domElement;
}

/**
 * Get ball screen position using proper 3D→2D projection.
 * Falls back to canvas center if camera not registered.
 * @param {object} motionStateOrMesh - motionState object with position {x,y,z}
 * @param {HTMLCanvasElement} domElement - The R3F canvas element
 * @returns {{ x: number, y: number }} Viewport coordinates (px, fixed positioning)
 */
export function getBallScreenPosition(motionStateOrMesh, domElement) {
  const canvas = domElement || _domElement;
  const camera = _camera;

  // Build world position vector
  let worldPos;
  if (motionStateOrMesh && motionStateOrMesh.isObject3D) {
    worldPos = new THREE.Vector3();
    motionStateOrMesh.getWorldPosition(worldPos);
  } else if (motionStateOrMesh && motionStateOrMesh.position) {
    worldPos = new THREE.Vector3(
      motionStateOrMesh.position.x,
      motionStateOrMesh.position.y,
      motionStateOrMesh.position.z
    );
  } else {
    return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  }

  // If we have a camera, do proper projection
  if (camera && canvas) {
    const result = projectWorldToScreen(worldPos, camera, canvas);
    if (DEBUG.projectionSystem) {
      console.log('[projectionSystem] getBallScreenPosition (projected):', result);
    }
    return result;
  }

  // Fallback: approximate from canvas rect
  if (canvas) {
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }

  return { x: window.innerWidth / 2, y: window.innerHeight / 2 };
}

/**
 * Project a THREE.Vector3 world position to screen coordinates using a camera.
 * Returns viewport-relative coordinates suitable for position: fixed elements.
 */
export function projectWorldToScreen(worldPos, camera, domElement) {
  const rect = domElement.getBoundingClientRect();
  const projected = worldPos.clone().project(camera);

  // NDC (-1 to +1) → screen pixels
  const x = (projected.x  *  0.5 + 0.5) * rect.width  + rect.left;
  const y = (projected.y  * -0.5 + 0.5) * rect.height + rect.top;

  if (DEBUG.projectionSystem) {
    console.log('[projectionSystem] projectWorldToScreen:', { worldPos: worldPos.toArray(), screen: { x, y } });
  }

  return { x, y };
}

/**
 * Get the center position of the cart icon element.
 */
export function getCartIconPosition(cartIconRef) {
  if (!cartIconRef?.current) {
    return { x: window.innerWidth - 60, y: 32 };
  }

  const rect = cartIconRef.current.getBoundingClientRect();
  const endPos = {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };

  if (DEBUG.projectionSystem) {
    console.log('[projectionSystem] getCartIconPosition:', endPos);
  }

  return endPos;
}
