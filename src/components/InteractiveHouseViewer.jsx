// ─── InteractiveHouseViewer ───────────────────────────────────────────────────
// Self-contained R3F canvas with OrbitControls for a single house GLB.
// Drop it anywhere — it manages its own scene, lights, and interaction.
// Users can drag to rotate, scroll to zoom, and it auto-spins when idle.

import { Suspense, useRef, useState, useEffect, Component } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, Environment } from '@react-three/drei';
import * as THREE from 'three';

const TARGET_SIZE = 2.2;

// ─── Fallback procedural house ────────────────────────────────────────────────
function FallbackHouse({ color = '#c9a84c', accentColor = '#ffd700' }) {
  return (
    <group>
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[1.6, 1.0, 1.2]} />
        <meshStandardMaterial color={color} roughness={0.4} metalness={0.1} />
      </mesh>
      <mesh position={[0, 0.65, 0]}>
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
    </group>
  );
}

// ─── Error boundary ───────────────────────────────────────────────────────────
class GLBErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { hasError: false }; }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return <FallbackHouse color={this.props.color} accentColor={this.props.accentColor} />;
    }
    return this.props.children;
  }
}

// ─── GLB loader ───────────────────────────────────────────────────────────────
function GLBScene({ glbPath }) {
  const { scene } = useGLTF(glbPath);
  const cloned = scene.clone(true);
  const box = new THREE.Box3().setFromObject(cloned);
  const size = new THREE.Vector3();
  box.getSize(size);
  const maxDim = Math.max(size.x, size.y, size.z);
  const scale = maxDim > 0 ? TARGET_SIZE / maxDim : 1;
  const center = new THREE.Vector3();
  box.getCenter(center);
  cloned.position.sub(center.multiplyScalar(scale));
  return <primitive object={cloned} scale={scale} />;
}

// ─── Auto-spin rig — stops when user interacts, resumes after 2s idle ─────────
function AutoSpin({ controlsRef, accentColor }) {
  const groupRef = useRef();
  const idleTimer = useRef(null);
  const isUserInteracting = useRef(false);
  const spinSpeed = useRef(0.004);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    const onStart = () => {
      isUserInteracting.current = true;
      spinSpeed.current = 0;
      clearTimeout(idleTimer.current);
    };
    const onEnd = () => {
      clearTimeout(idleTimer.current);
      idleTimer.current = setTimeout(() => {
        isUserInteracting.current = false;
        spinSpeed.current = 0.004;
      }, 2000);
    };

    controls.addEventListener('start', onStart);
    controls.addEventListener('end', onEnd);
    return () => {
      controls.removeEventListener('start', onStart);
      controls.removeEventListener('end', onEnd);
      clearTimeout(idleTimer.current);
    };
  }, [controlsRef]);

  useFrame(() => {
    if (!isUserInteracting.current && groupRef.current) {
      groupRef.current.rotation.y += spinSpeed.current;
    }
  });

  return <group ref={groupRef} />;
}

// ─── Scene content ────────────────────────────────────────────────────────────
function SceneContent({ house, controlsRef }) {
  const fallbackColor = house?.fallbackColor || '#c9a84c';
  const accentColor   = house?.accentColor   || '#ffd700';

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[4, 6, 4]}  intensity={3.5} />
      <directionalLight position={[-4, 2, -3]} intensity={1.5} color={accentColor} />
      <directionalLight position={[0, 2, 5]}   intensity={2.0} />
      <pointLight position={[3, 0, 0]}  intensity={1.0} />
      <pointLight position={[-3, 0, 0]} intensity={1.0} />

      {/* Auto-spin wrapper */}
      <AutoSpin controlsRef={controlsRef} accentColor={accentColor} />

      {/* House model — centered */}
      <Center>
        {house?.glb ? (
          <Suspense fallback={<FallbackHouse color={fallbackColor} accentColor={accentColor} />}>
            <GLBErrorBoundary color={fallbackColor} accentColor={accentColor}>
              <GLBScene glbPath={house.glb} />
            </GLBErrorBoundary>
          </Suspense>
        ) : (
          <FallbackHouse color={fallbackColor} accentColor={accentColor} />
        )}
      </Center>

      {/* Orbit controls */}
      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom={true}
        minDistance={2.5}
        maxDistance={7}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 1.8}
        autoRotate={false}
        dampingFactor={0.08}
        enableDamping={true}
        rotateSpeed={0.7}
        zoomSpeed={0.6}
      />
    </>
  );
}

// ─── InteractiveHouseViewer — main export ─────────────────────────────────────
// Props:
//   house       — entry from HOUSES array
//   height      — canvas height in px (default 260)
//   borderRadius — css border-radius (default 0)
export default function InteractiveHouseViewer({ house, height = 260, borderRadius = 0 }) {
  const controlsRef = useRef();
  const [hinted, setHinted] = useState(true);

  // Hide the "drag to rotate" hint after first interaction
  useEffect(() => {
    const timer = setTimeout(() => setHinted(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ position: 'relative', height, borderRadius, overflow: 'hidden', cursor: 'grab' }}>
      <Canvas
        camera={{ fov: 45, near: 0.1, far: 100, position: [0, 1, 5] }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
        frameloop="always"
      >
        <SceneContent house={house} controlsRef={controlsRef} />
      </Canvas>

      {/* Drag hint overlay */}
      {hinted && (
        <div style={{
          position: 'absolute', bottom: '10px', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '6px',
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(6px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '20px',
          padding: '5px 12px',
          pointerEvents: 'none',
          animation: 'fadeHint 3s ease forwards',
        }}>
          <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
            <circle cx="6.5" cy="6.5" r="5.5" stroke="rgba(255,255,255,0.5)" strokeWidth="1"/>
            <path d="M4 6.5h5M6.5 4v5" stroke="rgba(255,255,255,0.5)" strokeWidth="1.2" strokeLinecap="round"/>
          </svg>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.55)', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
            Drag to rotate · Scroll to zoom
          </span>
        </div>
      )}

      <style>{`
        @keyframes fadeHint {
          0%   { opacity: 0; transform: translateX(-50%) translateY(4px); }
          20%  { opacity: 1; transform: translateX(-50%) translateY(0); }
          80%  { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}

