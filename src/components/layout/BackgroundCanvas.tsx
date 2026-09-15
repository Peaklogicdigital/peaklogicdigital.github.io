"use client";

import { Suspense, useEffect, useRef } from "react";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import { shaderMaterial, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { MathUtils } from "three";

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

const FluidMaterial = shaderMaterial(
  {
    u_tex: null as unknown as THREE.Texture,
    u_mouse: new THREE.Vector2(0.5, 0.5),
    u_time: 0,
  },
  /* glsl vertex */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl fragment */ `
    uniform sampler2D u_tex;
    uniform vec2 u_mouse;
    uniform float u_time;
    varying vec2 vUv;

    void main() {
      float dist = distance(vUv, u_mouse);
      float ripple = sin(dist * 40.0 - u_time * 2.0) * 0.02 * smoothstep(0.35, 0.0, dist);
      vec2 distortedUv = vUv + ripple;

      vec4 texColor = texture2D(u_tex, distortedUv);
      gl_FragColor = vec4(texColor.rgb, 0.65);
    }
  `
);

extend({ FluidMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    fluidMaterial: ThreeElement<typeof FluidMaterial>;
  }
}

function FluidLayer() {
  const texture = useTexture("/assets/image_0.png");
  const materialRef = useRef<InstanceType<typeof FluidMaterial>>(null);
  const { viewport } = useThree();

  const touchTarget = useRef({ x: 0.5, y: 0.5 });
  const lastTouchAt = useRef(0);

  useEffect(() => {
    function handleTouchMove(event: TouchEvent) {
      const touch = event.touches[0];
      if (!touch) return;
      touchTarget.current = {
        x: touch.clientX / window.innerWidth,
        y: 1 - touch.clientY / window.innerHeight,
      };
      lastTouchAt.current = performance.now();
    }

    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    return () => window.removeEventListener("touchmove", handleTouchMove);
  }, []);

  useFrame((state) => {
    const material = materialRef.current;
    if (!material) return;

    const recentTouch = performance.now() - lastTouchAt.current < 200;
    const targetX = recentTouch
      ? touchTarget.current.x
      : state.pointer.x * 0.5 + 0.5;
    const targetY = recentTouch
      ? touchTarget.current.y
      : state.pointer.y * 0.5 + 0.5;

    material.u_mouse.x = MathUtils.lerp(material.u_mouse.x, targetX, 0.05);
    material.u_mouse.y = MathUtils.lerp(material.u_mouse.y, targetY, 0.05);
    material.u_time = state.clock.elapsedTime;
  });

  return (
    <mesh position={[0, 0, 0.1]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <fluidMaterial ref={materialRef} u_tex={texture} transparent />
    </mesh>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1]">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <GridLayer />
          <FluidLayer />
        </Suspense>
      </Canvas>
    </div>
  );
}
