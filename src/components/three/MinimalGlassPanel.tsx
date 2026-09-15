"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import type { Mesh } from "three";
import MiniCanvas from "./MiniCanvas";

function Panel() {
  const meshRef = useRef<Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.15) * 0.25;
      meshRef.current.rotation.x = Math.cos(state.clock.elapsedTime * 0.12) * 0.08;
    }
  });

  return (
    <RoundedBox ref={meshRef} args={[2.6, 1.7, 0.15]} radius={0.08} smoothness={4}>
      <meshPhysicalMaterial
        color="#0a0b0e"
        metalness={0.4}
        roughness={0.25}
        clearcoat={1}
        clearcoatRoughness={0.15}
        envMapIntensity={1}
      />
    </RoundedBox>
  );
}

export default function MinimalGlassPanel() {
  return (
    <MiniCanvas cameraZ={4}>
      <Panel />
    </MiniCanvas>
  );
}
