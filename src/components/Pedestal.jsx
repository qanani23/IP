import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { motionState } from '../utils/motionState.js';

// ─── Pedestal ─────────────────────────────────────────────────────────────────
// Formal showcase platform displayed during Podium and Champion sections.
// Visibility is driven by motionState.pedestalVisible.

export default function Pedestal() {
  const groupRef = useRef();

  // Pedestal geometry: tiered cylinder platform
  const topRadius    = 1.3;
  const bottomRadius = 1.6;
  const height       = 0.25;
  const yPosition    = -1.5; // sits below the ball

  useFrame(() => {
    if (!groupRef.current) return;
    // Show/hide based on motionState
    groupRef.current.visible = motionState.pedestalVisible;
  });

  return (
    <group ref={groupRef} position={[0, yPosition, 0]} visible={false}>
      {/* Main platform */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[topRadius, bottomRadius, height, 64]} />
        <meshStandardMaterial
          color="#1a1a1a"
          roughness={0.3}
          metalness={0.6}
          envMapIntensity={1.0}
        />
      </mesh>

      {/* Thin accent ring on top */}
      <mesh position={[0, height / 2 + 0.01, 0]} castShadow={false}>
        <cylinderGeometry args={[topRadius + 0.02, topRadius + 0.02, 0.02, 64]} />
        <meshStandardMaterial
          color="#c9a84c"
          roughness={0.2}
          metalness={0.9}
          envMapIntensity={1.5}
        />
      </mesh>

      {/* Base slab */}
      <mesh position={[0, -height / 2 - 0.06, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[bottomRadius + 0.1, bottomRadius + 0.2, 0.1, 64]} />
        <meshStandardMaterial
          color="#111111"
          roughness={0.4}
          metalness={0.5}
        />
      </mesh>
    </group>
  );
}
