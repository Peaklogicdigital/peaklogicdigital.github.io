"use client";

import { Suspense, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";

const PulseGridMaterial = shaderMaterial(
  { uTime: 0, uTexture: null as unknown as THREE.Texture },
  /* glsl vertex */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl fragment */ `
    uniform float uTime;
    uniform sampler2D uTexture;
    varying vec2 vUv;

    void main() {
      vec4 texColor = texture2D(uTexture, vUv);

      // Isolate the bright cyan pixels (high green + blue, low red).
      float cyanMask = smoothstep(0.35, 0.85, texColor.g)
        * smoothstep(0.35, 0.85, texColor.b)
        * (1.0 - smoothstep(0.0, 0.4, texColor.r));

      // Slow ambient breathing pulse.
      float breathe = 0.5 + 0.5 * sin(uTime * 0.6);
      vec3 color = texColor.rgb + texColor.rgb * cyanMask * breathe * 1.2;

      gl_FragColor = vec4(color, texColor.a);
    }
  `
);

extend({ PulseGridMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    pulseGridMaterial: ThreeElement<typeof PulseGridMaterial>;
  }
}

function GridLayer() {
  const texture = useTexture("/assets/image_1.png");
  const materialRef = useRef<InstanceType<typeof PulseGridMaterial>>(null);
  const { viewport } = useThree();

  useFrame((state) => {
    if (materialRef.current) {
      materialRef.current.uTime = state.clock.elapsedTime;
    }
  });

  return (
    <mesh scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <pulseGridMaterial ref={materialRef} uTexture={texture} transparent />
    </mesh>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1]">
      <Canvas camera={{ position: [0, 0, 1] }}>
        <Suspense fallback={null}>
          <GridLayer />
        </Suspense>
      </Canvas>
    </div>
  );
}
