// ─── HouseModel ───────────────────────────────────────────────────────────────
// Loads a .glb house model and drives it via motionState (same contract as
// the old Basketball component). Smooth fade-swap when the selected house
// changes. Auto-scales each model to a consistent world-space size.

import { useRef, useEffect, useState, Suspense, Component } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Center } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { motionState } from '../utils/motionState.js';

// ─── Consistent target size for all models ────────────────────────────────────
// Every GLB is auto-scaled so its bounding box fits inside this cube.
const TARGET_SIZE = 1.8;

// ─── Fallback procedural house ────────────────────────────────────────────────
function FallbackHouse({ color = '#c9a84c', accentColor = '#ffd700' }) {
  return (
    <group>
      <mesh position={[0, -0.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 1.0, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.65, 0]} castShadow>
        <coneGeometry args={[1.15, 0.7, 4]} />
        <meshStandardMaterial color={accentColor} roughness={0.3} metalness={0.15} />
      </mesh>
      <mesh position={[0, -0.28, 0.61]}>
        <boxGeometry args={[0.28, 0.44, 0.02]} />
        <meshStandardMaterial color={accentColor} roughness={0.5} />
      </mesh>
      <mesh position={[-0.48, 0.08, 0.61]}>
        <boxGeometry args={[0.28, 0.28, 0.02]} />
        <meshStandardMaterial color="#a8d8ea" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.48, 0.08, 0.61]}>
        <boxGeometry args={[0.28, 0.28, 0.02]} />
        <meshStandardMaterial color="#a8d8ea" roughness={0.1} metalness={0.3} transparent opacity={0.7} />
      </mesh>
      <mesh position={[0.45, 0.9, -0.2]} castShadow>
        <boxGeometry args={[0.18, 0.4, 0.18]} />
        <meshStandardMaterial color={color} roughness={0.6} />
      </mesh>
    </group>
  );
}

// ─── Error boundary for GLB loading failures ─────────────────────────────────
class GLBErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn('[HouseModel] GLB load failed:', err?.message);
    this.props.onError?.();
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// ─── Single loaded GLB scene ──────────────────────────────────────────────────
function GLBScene({ glbPath }) {
  const { scene } = useGLTF(glbPath);

  // Clone so multiple instances don't share materials/state
  const cloned = scene.clone(true);

  // Auto-scale: fit the model's bounding box to TARGET_SIZE
  const box    = new THREE.Box3().setFromObject(cloned);
  const size   = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale  = maxDim > 0 ? TARGET_SIZE / maxDim : 1;

  // Center the model on its bounding box midpoint
  const center = new THREE.Vector3();
  box.getCenter(center);
  cloned.position.sub(center.multiplyScalar(scale));

  return <primitive object={cloned} scale={scale} />;
}

// ─── Safe GLB wrapper — shows fallback while loading or on error ──────────────
function SafeGLB({ glbPath, fallbackColor, accentColor }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <FallbackHouse color={fallbackColor} accentColor={accentColor} />;
  }

  return (
    <Suspense fallback={<FallbackHouse color={fallbackColor} accentColor={accentColor} />}>
      <GLBErrorBoundary onError={() => setFailed(true)}>
        <GLBScene glbPath={glbPath} />
      </GLBErrorBoundary>
    </Suspense>
  );
}

// ─── HouseModel — main export ─────────────────────────────────────────────────
// Props:
//   house  — entry from HOUSES array
//   theme  — optional ThemeContext theme (for accent color override)
export default function HouseModel({ house, theme }) {
  const groupRef    = useRef();
  const opacityRef  = useRef({ value: 1 });
  const prevIdRef   = useRef(null);

  const fallbackColor = theme?.primary  || house?.fallbackColor || '#c9a84c';
  const accentColor   = theme?.accent   || house?.accentColor   || '#ffd700';
  const glbPath       = house?.glb      || null;

  // Fade-swap animation when the selected house changes
  useEffect(() => {
    if (!groupRef.current) return;

    const currentId = house?.id;

    // First mount — just appear
    if (prevIdRef.current === null) {
      prevIdRef.current = currentId;
      opacityRef.current.value = 1;
      return;
    }

    // Same house — nothing to do
    if (prevIdRef.current === currentId) return;

    prevIdRef.current = currentId;

    // Fade out → fade in
    gsap.killTweensOf(opacityRef.current);
    gsap.to(opacityRef.current, {
      value: 0,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(opacityRef.current, {
          value: 1,
          duration: 0.5,
          ease: 'power2.out',
        });
      },
    });
  }, [house?.id]);

  // Apply motionState transforms every frame (same contract as Basketball)
  useFrame(() => {
    if (!groupRef.current) return;

    const p = motionState.position;
    const r = motionState.rotation;
    const s = motionState.scale + (motionState.hoverScaleDelta || 0);

    groupRef.current.position.set(p.x, p.y, p.z);

    // Houses rotate gently on Y only — no basketball tumbling
    groupRef.current.rotation.y = r.y + (motionState.hoverRotationBoost || 0) * 0.3;
    groupRef.current.rotation.x = r.x * 0.08; // very subtle tilt
    groupRef.current.scale.setScalar(s);

    // Apply fade opacity to every mesh in the model
    const opacity = opacityRef.current.value;
    groupRef.current.traverse((child) => {
      if (child.isMesh && child.material) {
        const mats = Array.isArray(child.material) ? child.material : [child.material];
        mats.forEach((m) => {
          if (m.transparent !== true) m.transparent = true;
          m.opacity = opacity;
        });
      }
    });
  });

  return (
    <group ref={groupRef}>
      {glbPath ? (
        <SafeGLB
          glbPath={glbPath}
          fallbackColor={fallbackColor}
          accentColor={accentColor}
        />
      ) : (
        <FallbackHouse color={fallbackColor} accentColor={accentColor} />
      )}
    </group>
  );
}

// Pre-warm the GLB cache for all house models so swaps are instant
import { HOUSES } from '../data/houseData.js';
HOUSES.forEach((h) => {
  if (h.glb) {
    try { useGLTF.preload(h.glb); } catch { /* ignore */ }
  }
});
