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

const RibbonMaterial = shaderMaterial(
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

    // Distance-to-curve glow for one fiber-optic ribbon: a tight hot core
    // plus a soft halo (cheap fake bloom, no post-processing pass needed).
    // uScroll stretches the amplitude/width and speeds up the phase so the
    // ribbons visibly react as the page scrolls.
    float ribbon(
      vec2 uv, float freq, float speed, float phase,
      float amp, float yOffset, float width,
      float time, vec2 mouse, float scrollAmt
    ) {
      float stretch = 1.0 + abs(scrollAmt) * 0.8;
      float t = time * speed + phase + scrollAmt * 2.5;

      float y = yOffset
        + sin(uv.x * freq + t) * amp * stretch
        + sin(uv.x * freq * 2.3 - t * 1.3) * amp * 0.3;

      // Bend gently toward the mouse near its x position.
      float mx = mouse.x * 0.5 + 0.5;
      float my = mouse.y * 0.5 + 0.5;
      float bend = exp(-pow(uv.x - mx, 2.0) * 16.0) * 0.16;
      y += (my - y) * bend;

      float d = abs(uv.y - y);
      float core = exp(-d * d / (width * width));
      float halo = exp(-d * d / (width * width * 20.0)) * 0.45;
      return core + halo;
    }

    void main() {
      vec2 uv = vUv;
      uv.x *= uAspect;
      vec2 mouseUv = uMouse;

      float s = clamp(uScroll * 3.5, -1.0, 1.0);

      // Widths bumped up for thicker, more immediately visible ribbons.
      float r1 = ribbon(uv, 1.5, 0.05, 0.0, 0.14, 0.64, 0.016, uTime, mouseUv, s);
      float r2 = ribbon(uv, 1.1, -0.045, 2.4, 0.16, 0.46, 0.0145, uTime, mouseUv, s);
      float r3 = ribbon(uv, 1.9, 0.06, 4.6, 0.11, 0.30, 0.013, uTime, mouseUv, s);
      float r4 = ribbon(uv, 1.3, -0.038, 1.2, 0.15, 0.74, 0.015, uTime, mouseUv, s);

      float total = (r1 + r2 + r3 + r4) * 1.35;

      vec3 cyan = vec3(0.12, 0.85, 1.0);
      vec3 color = cyan * total;
      // Where ribbons overlap, the combined intensity is high - push that
      // toward bright white instead of just a brighter cyan.
      color = mix(color, vec3(1.0), clamp((total - 0.7) * 1.1, 0.0, 1.0));

      float alpha = clamp(total * 1.6, 0.0, 1.0);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ RibbonMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    ribbonMaterial: ThreeElement<typeof RibbonMaterial>;
  }
}

function RibbonField() {
  const materialRef = useRef<InstanceType<typeof RibbonMaterial>>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const scroll = useScrollVelocity();
  const { viewport, size } = useThree();

  useFrame((state) => {
    const scrollValue = scroll.sample();
    mouseTarget.current.x = MathUtils.lerp(mouseTarget.current.x, state.pointer.x, 0.06);
    mouseTarget.current.y = MathUtils.lerp(mouseTarget.current.y, state.pointer.y, 0.06);

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
      <ribbonMaterial
        ref={materialRef}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1]">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]} gl={{ alpha: true }}>
        <Suspense fallback={null}>
          <GridLayer />
          <FluidLayer />
          <RibbonField />
        </Suspense>
      </Canvas>
    </div>
  );
}
