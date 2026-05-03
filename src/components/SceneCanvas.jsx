import { Suspense, useRef, useEffect } from 'react';
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Preload } from '@react-three/drei';
import * as THREE from 'three';
import gsap from 'gsap';
import { Z } from '../config/tokens.js';
import HouseModel from './HouseModel.jsx';
import Pedestal from './Pedestal.jsx';
import FloatingPhysicsLabels from './FloatingPhysicsLabels.jsx';
import { useSceneAlignment } from '../hooks/useSceneAlignment.js';
import { useSceneMotion } from '../hooks/useSceneMotion.js';
import { motionState } from '../utils/motionState.js';
import { COPY } from '../utils/copy.js';
import { registerCamera } from '../utils/projectionSystem.js';

// ─── WebGL detection ──────────────────────────────────────────────────────────
function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl') || canvas.getContext('experimental-webgl'));
  } catch {
    return false;
  }
}

// ─── Static fallback (no WebGL) ───────────────────────────────────────────────
function StaticFallback() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: '#0a0a0a',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: Z.scene,
      }}
    >
      <div style={{ textAlign: 'center', color: '#fff', padding: '40px' }}>
        <h1 style={{ fontSize: '40px', marginBottom: '16px' }}>{COPY.fallback.heading}</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', maxWidth: '400px' }}>
          {COPY.fallback.sub}
        </p>
      </div>
    </div>
  );
}

// ─── Scene lights ─────────────────────────────────────────────────────────────
// Dynamic lighting: each section has its own mood. Intensities lerp every frame.
//
// Section moods:
//   0 Hero        — bright showcase, warm key
//   1 Performance — dramatic, high contrast
//   2 Aerodynamics — technical, cool fill
//   3 Technical   — balanced, neutral
//   4 Podium      — spotlight, theatrical
//   5 Champion    — heroic, warm + bright
//   6 Cart        — inviting, soft + even

const SECTION_LIGHTS = [
  { key: 4.0, spot: 3.5, ambient: 0.8,  rim: 1.5,  fill: 2.0 }, // 0 Hero
  { key: 5.5, spot: 4.5, ambient: 0.5,  rim: 2.0,  fill: 1.5 }, // 1 Performance
  { key: 3.5, spot: 3.0, ambient: 1.0,  rim: 1.0,  fill: 2.5 }, // 2 Aerodynamics
  { key: 4.2, spot: 3.8, ambient: 0.75, rim: 1.3,  fill: 2.0 }, // 3 Technical
  { key: 6.5, spot: 6.0, ambient: 0.4,  rim: 2.5,  fill: 1.0 }, // 4 Podium
  { key: 5.5, spot: 5.0, ambient: 0.6,  rim: 2.2,  fill: 2.2 }, // 5 Champion
  { key: 4.0, spot: 3.5, ambient: 0.9,  rim: 1.2,  fill: 2.5 }, // 6 Cart
];

function SceneLights({ accentColor = '#c9a84c' }) {
  const keyLightRef     = useRef();
  const spotlightRef    = useRef();
  const ambientRef      = useRef();
  const rimLightRef     = useRef();
  const fillLightRef    = useRef();
  const currentMood     = useRef({ ...SECTION_LIGHTS[0] });

  // Animate rim light color when accentColor changes
  useEffect(() => {
    if (!rimLightRef.current) return;
    const targetColor = new THREE.Color(accentColor);
    gsap.to(rimLightRef.current.color, {
      r: targetColor.r,
      g: targetColor.g,
      b: targetColor.b,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, [accentColor]);

  // Per-frame lerp of light intensities toward the active section's mood
  useFrame(() => {
    const target = SECTION_LIGHTS[motionState.activeSectionIndex] || SECTION_LIGHTS[0];
    const lf = 0.04; // lerp factor — smooth ~25-frame transition

    currentMood.current.key     += (target.key     - currentMood.current.key)     * lf;
    currentMood.current.spot    += (target.spot    - currentMood.current.spot)    * lf;
    currentMood.current.ambient += (target.ambient - currentMood.current.ambient) * lf;
    currentMood.current.rim     += (target.rim     - currentMood.current.rim)     * lf;
    currentMood.current.fill    += (target.fill    - currentMood.current.fill)    * lf;

    if (keyLightRef.current)  keyLightRef.current.intensity  = currentMood.current.key;
    if (spotlightRef.current) spotlightRef.current.intensity = currentMood.current.spot;
    if (ambientRef.current)   ambientRef.current.intensity   = currentMood.current.ambient;
    if (rimLightRef.current)  rimLightRef.current.intensity  = currentMood.current.rim;
    if (fillLightRef.current) fillLightRef.current.intensity = currentMood.current.fill;
  });

  return (
    <>
      {/* Primary key light — upper front */}
      <directionalLight
        ref={keyLightRef}
        position={[3, 5, 3]}
        intensity={4.0}
        castShadow={false}
      />

      {/* Spotlight on ball — makes it the star of the show */}
      <spotLight
        ref={spotlightRef}
        position={[0, 4, 4]}
        intensity={3.5}
        angle={0.5}
        penumbra={0.3}
        distance={15}
        decay={1.5}
        color="#ffffff"
        target-position={[0, 0, 0]}
      />

      {/* Ambient fill */}
      <ambientLight ref={ambientRef} intensity={0.8} />

      {/* Rim / accent light — defines silhouette (dynamic color) */}
      <directionalLight
        ref={rimLightRef}
        position={[-4, 2, -3]}
        intensity={1.5}
        color={accentColor}
      />

      {/* Front fill light */}
      <directionalLight
        ref={fillLightRef}
        position={[0, 2, 5]}
        intensity={2.0}
        color="#ffffff"
      />

      {/* Back fill + side lights — fixed intensity */}
      <pointLight position={[0, -3, -4]} intensity={0.8} color="#ffffff" />
      <pointLight position={[3, 0, 0]}  intensity={1.2} color="#ffffff" />
      <pointLight position={[-3, 0, 0]} intensity={1.2} color="#ffffff" />
    </>
  );
}

// ─── CameraRegistrar — registers camera for 3D→2D projection ────────────────
function CameraRegistrar() {
  const { camera, gl } = useThree();
  useEffect(() => {
    registerCamera(camera, gl.domElement);
  }, [camera, gl]);
  return null;
}

// ─── Camera FOV updater (inside Canvas) ──────────────────────────────────────
function CameraFovUpdater({ cameraFov }) {
  const { camera } = useThree();
  useEffect(() => {
    if (camera.fov !== cameraFov) {
      camera.fov = cameraFov;
      camera.updateProjectionMatrix();
    }
  }, [camera, cameraFov]);
  return null;
}

// ─── SceneMotionController (inside Canvas) ───────────────────────────────────
// Calls useSceneMotion to apply motionState to 3D objects every frame.
function SceneMotionController({ breakpoint }) {
  const ballRef = useRef(null);
  useSceneMotion({ ballRef, breakpoint });
  return null;
}

// ─── EnvironmentSync — Updates scene background and fog based on theme ──────
function EnvironmentSync({ backgroundColor = '#1a1510', fogColor = '#0a0a08' }) {
  const { scene } = useThree();

  useEffect(() => {
    const targetBg = new THREE.Color(backgroundColor);
    const targetFog = new THREE.Color(fogColor);

    // Animate background color
    if (scene.background) {
      gsap.to(scene.background, {
        r: targetBg.r,
        g: targetBg.g,
        b: targetBg.b,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    } else {
      scene.background = targetBg;
    }

    // Animate fog color
    if (scene.fog) {
      gsap.to(scene.fog.color, {
        r: targetFog.r,
        g: targetFog.g,
        b: targetFog.b,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    } else {
      scene.fog = new THREE.Fog(targetFog, 5, 20);
    }
  }, [scene, backgroundColor, fogColor]);

  return null;
}

// ─── Scene content (inside Canvas) ───────────────────────────────────────────
function SceneContent({ cameraFov, breakpoint, theme, activeHouse }) {
  return (
    <>
      <CameraRegistrar />
      <CameraFovUpdater cameraFov={cameraFov} />
      <SceneMotionController breakpoint={breakpoint} />
      <EnvironmentSync 
        backgroundColor={theme?.background || '#0a0a0a'} 
        fogColor={theme?.fog || '#0a0a0a'} 
      />
      <SceneLights accentColor={theme?.accent || '#c9a84c'} />
      <HouseModel house={activeHouse} theme={theme} />
      <Pedestal />
      <FloatingPhysicsLabels accentColor={theme?.accent || '#c9a84c'} />
      <Preload all />
    </>
  );
}

// ─── SceneCanvas ──────────────────────────────────────────────────────────────
export default function SceneCanvas({ onReady, theme, activeHouse, canvasRef: externalRef }) {
  const { cameraFov, sceneOffset, breakpoint } = useSceneAlignment();
  const localRef  = useRef(null);
  const wrapperRef = externalRef || localRef;

  useEffect(() => {
    if (motionState.scrollProgress === 0) {
      motionState.position.x = 0;
      motionState.position.y = 0;
      motionState.scale = 1.0;
    }
  }, [sceneOffset, breakpoint]);

  useEffect(() => {
    const timer = setTimeout(() => { onReady?.(); }, 500);
    return () => clearTimeout(timer);
  }, [onReady]);

  // Sync sceneOffset into motionState base position
  // Hero starts at RIGHT_CLOSE (1.8 on desktop) — set by App.jsx scroll timeline
  // This effect only sets the initial position before scroll kicks in
  useEffect(() => {
    // Only reset if scroll hasn't started — don't fight GSAP
    if (motionState.scrollProgress === 0) {
      motionState.position.x = 0;
      motionState.position.y = 0;
      motionState.scale = 1.0;
    }
  }, [sceneOffset, breakpoint]);

  // Signal ready after a short delay for scene to initialize
  useEffect(() => {
    const timer = setTimeout(() => {
      onReady?.();
    }, 500);
    return () => clearTimeout(timer);
  }, [onReady]);

  // Ball hover + drag interactions
  useEffect(() => {
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    // ── Desktop: hover scale boost ────────────────────────────────────────────
    const canHover = window.matchMedia('(hover: hover)').matches;
    if (canHover) {
      let hoverInTween  = null;
      let hoverOutTween = null;

      const handlePointerEnter = () => {
        if (hoverOutTween) hoverOutTween.kill();
        hoverInTween = gsapImport?.to(motionState, {
          hoverScaleDelta: 0.025,
          duration: 0.3,
          ease: 'back.out(1.7)',
        });
      };

      const handlePointerLeave = () => {
        if (hoverInTween) hoverInTween.kill();
        hoverOutTween = gsapImport?.to(motionState, {
          hoverScaleDelta: 0,
          duration: 0.4,
          ease: 'expo.out',
        });
        motionState.hoverRotationBoost = 0;
      };

      wrapper.addEventListener('pointerenter', handlePointerEnter);
      wrapper.addEventListener('pointerleave', handlePointerLeave);

      return () => {
        wrapper.removeEventListener('pointerenter', handlePointerEnter);
        wrapper.removeEventListener('pointerleave', handlePointerLeave);
      };
    }

    // ── Mobile: touch drag handled by HeroSection drag overlay ───────────────
    // Touch events on the hero section's overlay div write to motionState directly.
    // Nothing to do here for mobile.
  }, [breakpoint]);

  if (!supportsWebGL()) {
    return <StaticFallback />;
  }

  return (
    <div
      ref={wrapperRef}
      className="scene-canvas-wrapper"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: 0,
        overflow: 'hidden',
        zIndex: 0,
        pointerEvents: 'none',
        willChange: 'transform',
      }}
    >
      <Canvas
        camera={{
          fov: cameraFov,
          near: 0.1,
          far: 100,
          position: [0, 0, 5],
        }}
        dpr={[1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
        }}
        frameloop="always"
        style={{ background: 'transparent' }}
      >
        <Suspense fallback={null}>
          <SceneContent
            cameraFov={cameraFov}
            breakpoint={breakpoint}
            theme={theme}
            activeHouse={activeHouse}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

// Lazy import gsap for hover (avoids circular dep issues)
let gsapImport = null;
import('gsap').then(m => { gsapImport = m.default || m.gsap || m; });
