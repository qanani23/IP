import { useRef, useMemo, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { extend } from '@react-three/fiber';
import gsap from 'gsap';
import { motionState } from '../utils/motionState.js';
import { ROTATION } from '../config/tokens.js';

// ─── Import GLSL shaders as raw strings ──────────────────────────────────────
import vertexShader from '../shaders/pebble.vert.glsl?raw';
import fragmentShader from '../shaders/pebble.frag.glsl?raw';

// ─── PebbleShaderMaterial ─────────────────────────────────────────────────────
const PebbleShaderMaterial = shaderMaterial(
  {
    uTime:        0,
    uPebbleDepth: 0.012, // 0.5mm normalized to sphere radius ~0.042 world units
    uLightDir:    new THREE.Vector3(0.6, 1.0, 0.8),
    uBaseColor:   new THREE.Color('#c9a84c'), // Dynamic base color
    uAccentColor: new THREE.Color('#ffd700'), // Dynamic accent color
  },
  vertexShader,
  fragmentShader
);

extend({ PebbleShaderMaterial });

// ─── Seam geometry helper ─────────────────────────────────────────────────────
// Creates a TubeGeometry following a regulation basketball seam arc
function createSeamCurve(axis, offset, radius) {
  const points = [];
  const segments = 64;
  for (let i = 0; i <= segments; i++) {
    const t = (i / segments) * Math.PI * 2;
    let x, y, z;
    if (axis === 'y') {
      x = Math.cos(t) * radius;
      y = Math.sin(t) * offset;
      z = Math.sin(t) * radius * Math.sqrt(1 - offset * offset);
    } else {
      x = Math.sin(t) * offset;
      y = Math.cos(t) * radius;
      z = Math.sin(t) * radius * Math.sqrt(1 - offset * offset);
    }
    points.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.CatmullRomCurve3(points, true);
}

// ─── Basketball component ─────────────────────────────────────────────────────
export default function Basketball({ theme }) {
  const meshRef    = useRef();
  const matRef     = useRef();
  const glowRef    = useRef();
  const seamsRef   = useRef([]);
  const shaderOk   = useRef(true);
  const { gl }     = useThree();

  // ── Bounce state — tracks entry into Section 2 (Technical/Weight & Balance) ─
  // When the ball transitions into section index 2 (Aerodynamics in the
  // App.jsx timeline, which is the "Weight & Balance" narrative beat), we
  // fire a one-shot damped bounce on the Y axis.
  const lastSectionIndex = useRef(0);
  const bounceOffset     = useRef(0);   // additive Y offset in world units
  const bounceVelocity   = useRef(0);   // current bounce velocity
  
  // Use provided theme or fallback to default gold
  const activeTheme = theme || {
    primary: '#c9a84c',
    accent: '#ffd700'
  };

  // Geometry — 64×64 segments (Tier 0)
  const geometry = useMemo(() => new THREE.SphereGeometry(1, 64, 64), []);

  // Seam geometries — 4 arcs
  const seamGeometries = useMemo(() => {
    const r = 1.01; // slightly above surface
    return [
      new THREE.TubeGeometry(createSeamCurve('y',  0.0, r), 128, 0.012, 8, true),
      new THREE.TubeGeometry(createSeamCurve('y',  0.5, r), 128, 0.012, 8, true),
      new THREE.TubeGeometry(createSeamCurve('x',  0.0, r), 128, 0.012, 8, true),
      new THREE.TubeGeometry(createSeamCurve('x',  0.5, r), 128, 0.012, 8, true),
    ];
  }, []);

  const seamMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#1a0a00',
    roughness: 0.9,
    metalness: 0.0,
  }), []);

  // Fallback material if shader fails
  const fallbackMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: '#e8500a',
    roughness: 0.8,
    metalness: 0.1,
  }), []);

  // Detect shader compile errors
  useEffect(() => {
    if (!matRef.current) return;
    try {
      // Force compile to detect errors early
      gl.compile(meshRef.current?.parent || {}, { isScene: true });
    } catch (e) {
      console.warn('[Basketball] PebbleShader compile error, using fallback:', e);
      shaderOk.current = false;
      if (meshRef.current) {
        meshRef.current.material = fallbackMaterial;
      }
    }
  }, [gl, fallbackMaterial]);

  // Animate color changes with GSAP when theme changes
  useEffect(() => {
    if (!matRef.current || !shaderOk.current || !activeTheme) return;

    const targetBase = new THREE.Color(activeTheme.primary);
    const targetAccent = new THREE.Color(activeTheme.accent);

    // Smooth GSAP tween for color transition (0.8s)
    gsap.to(matRef.current.uBaseColor, {
      r: targetBase.r,
      g: targetBase.g,
      b: targetBase.b,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    gsap.to(matRef.current.uAccentColor, {
      r: targetAccent.r,
      g: targetAccent.g,
      b: targetAccent.b,
      duration: 0.8,
      ease: 'power2.inOut',
    });

    // Animate glow layer color
    if (glowRef.current) {
      gsap.to(glowRef.current.color, {
        r: targetAccent.r,
        g: targetAccent.g,
        b: targetAccent.b,
        duration: 0.8,
        ease: 'power2.inOut',
      });
    }

    // Add spin animation when theme changes
    // Animate motionState.rotation.y instead of mesh rotation
    // because useFrame applies motionState every frame
    const currentRotationY = motionState.rotation.y;
    
    // Spin 360 degrees (2 * Math.PI radians) + current rotation
    gsap.to(motionState.rotation, {
      y: currentRotationY + Math.PI * 2,
      duration: 0.8,
      ease: 'power2.inOut',
    });
  }, [activeTheme]);

  // Apply motionState to mesh every frame
  useFrame((state) => {
    if (!meshRef.current) return;

    const ms = motionState;
    const t  = state.clock.elapsedTime;

    // ── Section-entry bounce (Section 2 — Weight & Balance) ──────────────────
    // When the active section changes TO index 2, fire a damped spring bounce.
    // The bounce is purely additive on Y — it doesn't fight GSAP's position.
    const BOUNCE_SECTIONS = new Set([2]); // sections that trigger a bounce
    if (ms.activeSectionIndex !== lastSectionIndex.current) {
      if (BOUNCE_SECTIONS.has(ms.activeSectionIndex)) {
        // Kick the bounce upward — gravity + damping will bring it back
        bounceVelocity.current = 0.18;
      }
      lastSectionIndex.current = ms.activeSectionIndex;
    }

    // Damped spring: gravity pulls down, damping bleeds energy each frame
    const GRAVITY  = -0.022;
    const DAMPING  = 0.72;
    if (Math.abs(bounceOffset.current) > 0.001 || Math.abs(bounceVelocity.current) > 0.001) {
      bounceVelocity.current += GRAVITY;
      bounceOffset.current   += bounceVelocity.current;
      // Floor at 0 — ball can't go below its resting position
      if (bounceOffset.current < 0) {
        bounceOffset.current  = 0;
        bounceVelocity.current = -bounceVelocity.current * DAMPING; // reflect + damp
      }
    }

    // Apply position from motionState
    // Hero: gentle sine bob to keep it alive. Other sections: very subtle.
    const isHero = ms.activeSectionIndex === 0;
    const floatY = isHero
      ? Math.sin(t * 1.2) * 0.06   // Hero: visible gentle bob
      : Math.sin(t * 0.8) * 0.015; // Other sections: barely perceptible
    meshRef.current.position.set(
      ms.position.x,
      ms.position.y + floatY + bounceOffset.current,
      ms.position.z
    );

    // Apply cumulative rotation from motionState
    meshRef.current.rotation.set(
      ms.rotation.x,
      ms.rotation.y,
      ms.rotation.z
    );

    // Apply scale (base + hover delta)
    // Subtle vertical squash during bounce: ball squashes slightly at impact
    const rawSquash = bounceOffset.current > 0.01
      ? 1 + bounceOffset.current * 0.08   // stretch while airborne
      : 1 - Math.abs(bounceVelocity.current) * 0.6; // squash at impact
    // Clamp squash so scale never goes negative or below 0.5
    const squash = Math.max(0.5, Math.min(1.5, rawSquash));
    const totalScale = ms.scale + ms.hoverScaleDelta;
    meshRef.current.scale.set(
      totalScale / Math.sqrt(squash),  // compensate X/Z to preserve volume
      totalScale * squash,
      totalScale / Math.sqrt(squash)
    );

    // ── Seam parallax — subtle depth separation per seam ─────────────────────
    // Each seam gets a tiny independent scale offset based on scroll progress
    // and its index, creating a sense of depth between the seam layers.
    seamsRef.current.forEach((seam, i) => {
      if (!seam) return;
      seam.position.copy(meshRef.current.position);
      seam.rotation.copy(meshRef.current.rotation);

      // Parallax: seams 0 & 2 are "outer", 1 & 3 are "inner"
      const parallaxDepth = Math.sin(ms.scrollProgress * Math.PI * 2 + i * 1.2) * 0.018;
      const seamScale = totalScale + parallaxDepth;
      seam.scale.setScalar(seamScale);
    });

    // Update shader time uniform
    if (matRef.current && shaderOk.current) {
      matRef.current.uTime = t;
    }
  });

  return (
    // Plain group — no Float wrapper. Float was fighting GSAP position values.
    // Hero idle bob is handled manually in useFrame via floatY.
    <group>
      <group>
        {/* Main ball mesh */}
        <mesh
          ref={meshRef}
          geometry={geometry}
        >
          {shaderOk.current ? (
            <pebbleShaderMaterial
              ref={matRef}
              uTime={0}
              uPebbleDepth={0.012}
              uBaseColor={new THREE.Color(activeTheme.primary)}
              uAccentColor={new THREE.Color(activeTheme.accent)}
            />
          ) : (
            <meshStandardMaterial
              color="#e8500a"
              roughness={0.8}
              metalness={0.1}
            />
          )}
        </mesh>

        {/* Subtle glow layer for enhanced visibility */}
        <mesh
          geometry={geometry}
          scale={1.02}
        >
          <meshBasicMaterial
            ref={glowRef}
            color={activeTheme.accent}
            transparent
            opacity={0.08}
            side={THREE.BackSide}
            blending={THREE.AdditiveBlending}
          />
        </mesh>

        {/* Seam lines */}
        {seamGeometries.map((geo, i) => (
          <mesh
            key={i}
            ref={el => seamsRef.current[i] = el}
            geometry={geo}
            material={seamMaterial}
            castShadow={false}
            receiveShadow={false}
          />
        ))}
      </group>
    </group>
  );
}
