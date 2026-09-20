"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import type { Group, Mesh } from "three";
import MiniCanvas from "./MiniCanvas";

function Panel() {
  const groupRef = useRef<Group>(null);
  const meshRef = useRef<Mesh>(null);

  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.2;
    }
    if (meshRef.current) {
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.12;
    }
  });

  return (
    <group ref={groupRef}>
      <pointLight position={[0, 0, 0.6]} intensity={2.2} color="#00e5ff" distance={4} />
      <mesh ref={meshRef} rotation={[Math.PI / 2.4, 0, 0]}>
        <torusGeometry args={[1, 0.4, 32, 128]} />
        <meshPhysicalMaterial
          color="#ffffff"
          transmission={1}
          thickness={0.5}
          roughness={0.1}
          ior={1.5}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

export default function MinimalGlassPanel() {
  return (
    <MiniCanvas cameraZ={4}>
      <Panel />
    </MiniCanvas>
  );
}
