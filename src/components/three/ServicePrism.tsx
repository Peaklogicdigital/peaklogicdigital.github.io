"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group } from "three";
import MiniCanvas from "./MiniCanvas";
import "./FrostedGlassMaterial";

function Prism() {
  const groupRef = useRef<Group>(null);
  const tilt = useRef({ x: 0, y: 0 });

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (!group) return;

    const targetTiltX = state.pointer.y * 0.5;
    const targetTiltY = state.pointer.x * 0.5;
    tilt.current.x = MathUtils.lerp(tilt.current.x, targetTiltX, 0.08);
    tilt.current.y = MathUtils.lerp(tilt.current.y, targetTiltY, 0.08);

    group.rotation.x = tilt.current.x + Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    group.rotation.z = -tilt.current.y * 0.5;
    group.rotation.y += delta * 0.25;
  });

  return (
    <group ref={groupRef}>
      <mesh scale={1.3}>
        <icosahedronGeometry args={[1, 0]} />
        <frostedGlassMaterial transparent uOpacity={0.2} />
      </mesh>
      <mesh scale={1.3}>
        <icosahedronGeometry args={[1, 0]} />
        <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.35} />
      </mesh>
      <mesh scale={0.55}>
        <icosahedronGeometry args={[1, 1]} />
        <meshStandardMaterial color="#0a0b0e" metalness={0.9} roughness={0.25} />
      </mesh>
    </group>
  );
}

export default function ServicePrism() {
  return (
    <MiniCanvas cameraZ={4.5}>
      <Prism />
    </MiniCanvas>
  );
}
