"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { MathUtils } from "three";
import type { Mesh, Group } from "three";
import MiniCanvas from "./MiniCanvas";

function Core() {
  const coreRef = useRef<Mesh>(null);
  const ringARef = useRef<Group>(null);
  const ringBRef = useRef<Group>(null);
  const hovered = useRef(false);
  const speed = useRef(1);
  const glow = useRef(0.5);

  useFrame((state, delta) => {
    const targetSpeed = hovered.current ? 3 : 1;
    const targetGlow = hovered.current ? 1.2 : 0.5;
    speed.current = MathUtils.lerp(speed.current, targetSpeed, 0.06);
    glow.current = MathUtils.lerp(glow.current, targetGlow, 0.08);

    if (ringARef.current) ringARef.current.rotation.x += delta * 0.6 * speed.current;
    if (ringBRef.current) ringBRef.current.rotation.y -= delta * 0.5 * speed.current;

    if (coreRef.current) {
      const pulse = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.06;
      coreRef.current.scale.setScalar(pulse);
      const material = coreRef.current.material;
      if (!Array.isArray(material) && "emissiveIntensity" in material) {
        material.emissiveIntensity = glow.current * 2;
      }
    }
  });

  return (
    <group
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
    >
      <mesh visible={false}>
        <sphereGeometry args={[1.8, 8, 8]} />
        <meshBasicMaterial />
      </mesh>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[0.55, 2]} />
        <meshPhysicalMaterial
          color="#22d3ee"
          emissive="#22d3ee"
          emissiveIntensity={1}
          metalness={0.2}
          roughness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.1}
          envMapIntensity={1.5}
        />
      </mesh>
      <group ref={ringARef} rotation={[0.4, 0, 0]}>
        <mesh>
          <torusGeometry args={[1.15, 0.05, 16, 64]} />
          <meshPhysicalMaterial
            color="#0a0b0e"
            metalness={1}
            roughness={0.15}
            clearcoat={1}
            clearcoatRoughness={0.15}
            envMapIntensity={1.4}
          />
        </mesh>
      </group>
      <group ref={ringBRef} rotation={[1.1, 0.6, 0]}>
        <mesh>
          <torusGeometry args={[1.4, 0.04, 16, 64]} />
          <meshPhysicalMaterial
            color="#12151a"
            metalness={0.95}
            roughness={0.2}
            clearcoat={1}
            clearcoatRoughness={0.2}
            envMapIntensity={1.4}
          />
        </mesh>
      </group>
    </group>
  );
}

export default function DataCore() {
  return (
    <MiniCanvas cameraZ={4.5}>
      <Core />
    </MiniCanvas>
  );
}
