import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { motionState } from '../utils/motionState.js';

// ─── FloatingPropertyLabels ───────────────────────────────────────────────────
// 3D data tags that orbit the house model during the Architecture section.
// Shows real estate metrics — price, sqft, rating, features.
// Fades in on section 2 (Aerodynamics/Architecture), fades out otherwise.

const LABELS = [
  { text: 'Walk Score: 98',        angle: 0,              radius: 2.4, yOffset:  0.5  },
  { text: 'Agent Rating: 4.9★',   angle: Math.PI * 0.55, radius: 2.1, yOffset: -0.1  },
  { text: '3,200 sq ft',           angle: Math.PI * 1.1,  radius: 2.3, yOffset:  0.3  },
  { text: 'A+ School District',    angle: Math.PI * 1.6,  radius: 2.0, yOffset: -0.5  },
  { text: 'Year Built: 2022',      angle: Math.PI * 0.28, radius: 2.2, yOffset:  0.7  },
  { text: 'Smart Home Ready',      angle: Math.PI * 1.82, radius: 2.1, yOffset: -0.7  },
];

const AERO_SECTION = 2;

export default function FloatingPhysicsLabels({ accentColor = '#c9a84c' }) {
  const groupRef   = useRef();
  const labelRefs  = useRef([]);
  const opacityRef = useRef(0);
  const orbitAngle = useRef(0);

  useFrame((state, delta) => {
    const isActive = motionState.activeSectionIndex === AERO_SECTION;
    const target   = isActive ? 1 : 0;

    opacityRef.current += (target - opacityRef.current) * 0.05;

    if (opacityRef.current < 0.005) return;

    orbitAngle.current += delta * 0.12; // slow, elegant drift

    const bx = motionState.position.x;
    const by = motionState.position.y;
    const bz = motionState.position.z;

    labelRefs.current.forEach((label, i) => {
      if (!label) return;
      const def   = LABELS[i];
      const angle = def.angle + orbitAngle.current;

      label.position.set(
        bx + Math.cos(angle) * def.radius,
        by + def.yOffset,
        bz + Math.sin(angle) * def.radius * 0.35
      );

      label.lookAt(state.camera.position);

      const stagger = i * 0.06;
      label.material.opacity = Math.min(Math.max(0, opacityRef.current - stagger), 0.85);
    });

    if (groupRef.current) {
      groupRef.current.visible = opacityRef.current > 0.01;
    }
  });

  return (
    <group ref={groupRef}>
      {LABELS.map((def, i) => (
        <Text
          key={i}
          ref={el => labelRefs.current[i] = el}
          fontSize={0.10}
          color={accentColor}
          anchorX="center"
          anchorY="middle"
          font={undefined}
          material-transparent
          material-opacity={0}
          material-depthWrite={false}
          renderOrder={1}
        >
          {def.text}
        </Text>
      ))}
    </group>
  );
}
