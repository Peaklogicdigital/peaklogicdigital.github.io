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

function useScrollVelocity() {
  const velocity = useRef(0);
  const lastScroll = useRef(0);

  useEffect(() => {
    lastScroll.current = window.scrollY;
  }, []);

  return {
    velocity,
    sample() {
      const current = window.scrollY;
      const delta = current - lastScroll.current;
      lastScroll.current = current;
      velocity.current = MathUtils.lerp(velocity.current, delta * 0.002, 0.1);
      return velocity.current;
    },
  };
}

const AuroraMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0, 0), uScroll: 0, uAspect: 1.6 },
  /* glsl vertex */ `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  /* glsl fragment */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uAspect;
    varying vec2 vUv;

    // Two layered sine fields, cheap enough to stay at 60fps on a single
    // full-screen quad, combined into slow drifting aurora-like bands.
    float flow(vec2 uv, float t) {
      float a = sin(uv.x * 2.2 + t * 1.15 + sin(uv.y * 3.0 - t * 0.7) * 1.4);
      float b = sin(uv.y * 1.8 - t * 0.85 + sin(uv.x * 2.6 + t * 0.5) * 1.2);
      return (a + b) * 0.5;
    }

    void main() {
      vec2 uv = vUv;
      uv.x = (uv.x - 0.5) * uAspect + 0.5;

      vec2 driftUv = uv + uMouse * 0.05 + vec2(0.0, uScroll * 0.18);
      float t = uTime * 0.07;

      float f1 = flow(driftUv * 1.3, t);
      float f2 = flow(driftUv * 2.1 + 5.2, -t * 0.7);
      float band = f1 * 0.6 + f2 * 0.4;
      band = band * 0.5 + 0.5;

      vec3 colorDeep = vec3(0.03, 0.07, 0.1);
      vec3 colorCyan = vec3(0.15, 0.85, 0.95);
      vec3 colorViolet = vec3(0.5, 0.3, 0.9);

      vec3 color = mix(colorDeep, colorCyan, smoothstep(0.32, 0.8, band));
      color = mix(color, colorViolet, smoothstep(0.68, 0.98, f2 * 0.5 + 0.5) * 0.55);

      float alpha = smoothstep(0.1, 0.85, band) * 0.5;
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ AuroraMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    auroraMaterial: ThreeElement<typeof AuroraMaterial>;
  }
}

function AuroraLayer() {
  const materialRef = useRef<InstanceType<typeof AuroraMaterial>>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const scroll = useScrollVelocity();
  const { viewport, size } = useThree();

  useFrame((state) => {
    const scrollValue = scroll.sample();
    mouseTarget.current.x = MathUtils.lerp(mouseTarget.current.x, state.pointer.x, 0.04);
    mouseTarget.current.y = MathUtils.lerp(mouseTarget.current.y, state.pointer.y, 0.04);

    const material = materialRef.current;
    if (!material) return;

    material.uTime = state.clock.elapsedTime;
    material.uMouse.set(mouseTarget.current.x, mouseTarget.current.y);
    material.uScroll = scrollValue;
    material.uAspect = size.width / size.height;
  });

  return (
    <mesh position={[0, 0, 0.5]} scale={[viewport.width, viewport.height, 1]}>
      <planeGeometry args={[1, 1]} />
      <auroraMaterial ref={materialRef} transparent depthWrite={false} />
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
          <AuroraLayer />
        </Suspense>
      </Canvas>
    </div>
  );
}
