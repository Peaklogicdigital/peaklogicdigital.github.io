"use client";

import { useRef } from "react";
import { useFrame, extend } from "@react-three/fiber";
import { shaderMaterial } from "@react-three/drei";
import { MathUtils } from "three";
import type { Group } from "three";
import type { ThreeElement } from "@react-three/fiber";
import MiniCanvas from "./MiniCanvas";

const LightSweepMaterial = shaderMaterial(
  { uTime: 0 },
  /* glsl vertex */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl fragment */ `
    uniform float uTime;
    varying vec2 vUv;

    void main() {
      float diag = vUv.x + vUv.y;
      float sweep = smoothstep(0.0, 0.15, 0.15 - abs(mod(diag - uTime * 0.3, 2.0) - 1.0));
      vec3 base = vec3(0.15, 0.7, 0.85);
      vec3 color = base + sweep * vec3(0.4, 0.9, 1.0);
      float alpha = 0.12 + sweep * 0.35;
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ LightSweepMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    lightSweepMaterial: ThreeElement<typeof LightSweepMaterial>;
  }
}

function ParallaxLayers() {
  const backRef = useRef<Group>(null);
  const frontRef = useRef<Group>(null);
  const materialRef = useRef<InstanceType<typeof LightSweepMaterial>>(null);
  const offset = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    const targetX = state.pointer.x;
    const targetY = state.pointer.y;
    offset.current.x = MathUtils.lerp(offset.current.x, targetX, 0.06);
    offset.current.y = MathUtils.lerp(offset.current.y, targetY, 0.06);

    if (backRef.current) {
      backRef.current.position.x = offset.current.x * 0.08;
      backRef.current.position.y = offset.current.y * 0.06;
    }
    if (frontRef.current) {
      frontRef.current.position.x = offset.current.x * 0.35;
      frontRef.current.position.y = offset.current.y * 0.25;
      frontRef.current.rotation.z = offset.current.x * 0.04;
    }
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <>
      <group ref={backRef}>
        <mesh>
          <planeGeometry args={[3, 2, 12, 8]} />
          <meshStandardMaterial color="#0a0b0e" metalness={0.5} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.001]}>
          <planeGeometry args={[3, 2, 12, 8]} />
          <meshBasicMaterial color="#22d3ee" wireframe transparent opacity={0.12} />
        </mesh>
      </group>
      <group ref={frontRef} position={[0, 0, 0.6]}>
        <mesh>
          <planeGeometry args={[2.2, 1.5]} />
          <lightSweepMaterial ref={materialRef} transparent />
        </mesh>
      </group>
    </>
  );
}

export default function ShowcaseParallax() {
  return (
    <MiniCanvas cameraZ={4}>
      <ParallaxLayers />
    </MiniCanvas>
  );
}
