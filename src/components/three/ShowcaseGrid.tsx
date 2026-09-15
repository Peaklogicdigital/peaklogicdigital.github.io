"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Group, PointLight } from "three";
import MiniCanvas from "./MiniCanvas";

function GridSurface() {
  const groupRef = useRef<Group>(null);
  const rimLightRef = useRef<PointLight>(null);
  const tilt = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const targetX = state.pointer.y * 0.3;
    const targetY = state.pointer.x * 0.3;
    tilt.current.x = MathUtils.lerp(tilt.current.x, targetX, 0.08);
    tilt.current.y = MathUtils.lerp(tilt.current.y, targetY, 0.08);

    if (groupRef.current) {
      groupRef.current.rotation.x = -tilt.current.x;
      groupRef.current.rotation.y = tilt.current.y;
    }
    if (rimLightRef.current) {
      rimLightRef.current.position.x = state.pointer.x * 3;
      rimLightRef.current.position.y = state.pointer.y * 2;
    }
  });

  return (
    <>
      <pointLight ref={rimLightRef} position={[0, 0, 1.5]} intensity={2} color="#22d3ee" />
      <group ref={groupRef}>
        <mesh>
          <planeGeometry args={[3.2, 2.2, 24, 16]} />
          <meshStandardMaterial color="#0a0b0e" metalness={0.6} roughness={0.5} />
        </mesh>
        <mesh position={[0, 0, 0.002]}>
          <planeGeometry args={[3.2, 2.2, 24, 16]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.15} />
        </mesh>
      </group>
    </>
  );
}

export default function ShowcaseGrid() {
  return (
    <MiniCanvas cameraZ={3.4}>
      <GridSurface />
    </MiniCanvas>
  );
}
