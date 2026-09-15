"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
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

const DustMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0, 0), uScroll: 0, uPixelRatio: 1 },
  /* glsl vertex */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uPixelRatio;
    attribute float aSize;
    attribute float aSeed;
    varying float vAlpha;

    void main() {
      vec3 pos = position;

      pos.x += sin(uTime * 0.15 + aSeed * 6.2831) * 0.25;
      pos.y += cos(uTime * 0.12 + aSeed * 6.2831) * 0.2;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      // Particles closer to the camera parallax more.
      float dist = -mvPosition.z;
      float depthFactor = 1.0 - clamp((dist - 0.1) / 0.75, 0.0, 1.0);

      mvPosition.x += uMouse.x * 0.5 * depthFactor;
      mvPosition.y += uMouse.y * 0.35 * depthFactor;
      mvPosition.y += uScroll * (0.3 + depthFactor * 0.7);

      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = aSize * uPixelRatio * (1.1 / dist);
      vAlpha = 0.3 + 0.25 * sin(uTime * 0.4 + aSeed * 6.2831);
    }
  `,
  /* glsl fragment */ `
    varying float vAlpha;

    void main() {
      vec2 uv = gl_PointCoord - 0.5;
      float dist = length(uv);
      float alpha = smoothstep(0.5, 0.0, dist) * vAlpha;
      vec3 color = vec3(0.13, 0.83, 0.93);
      gl_FragColor = vec4(color, alpha * 0.45);
    }
  `
);

extend({ DustMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    dustMaterial: ThreeElement<typeof DustMaterial>;
  }
}

const ShardMaterial = shaderMaterial(
  { uTime: 0, uMouse: new THREE.Vector2(0, 0), uScroll: 0, uPixelRatio: 1 },
  /* glsl vertex */ `
    uniform float uTime;
    uniform vec2 uMouse;
    uniform float uScroll;
    uniform float uPixelRatio;
    attribute float aSize;
    attribute float aSeed;
    varying float vSeed;

    void main() {
      vec3 pos = position;

      pos.x += sin(uTime * 0.08 + aSeed * 6.2831) * 0.35;
      pos.y += cos(uTime * 0.06 + aSeed * 6.2831) * 0.3;

      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);

      float dist = -mvPosition.z;
      float depthFactor = 1.0 - clamp((dist - 0.1) / 0.75, 0.0, 1.0);

      mvPosition.x += uMouse.x * 0.35 * depthFactor;
      mvPosition.y += uMouse.y * 0.25 * depthFactor;
      mvPosition.y += uScroll * (0.2 + depthFactor * 0.5);

      gl_Position = projectionMatrix * mvPosition;

      gl_PointSize = aSize * uPixelRatio * (1.1 / dist);
      vSeed = aSeed;
    }
  `,
  /* glsl fragment */ `
    uniform float uTime;
    varying float vSeed;

    void main() {
      float angle = uTime * 0.1 + vSeed * 6.2831;
      float s = sin(angle);
      float c = cos(angle);
      vec2 uv = gl_PointCoord - 0.5;
      uv = mat2(c, -s, s, c) * uv;

      float diamond = abs(uv.x) + abs(uv.y);
      float alpha = smoothstep(0.5, 0.15, diamond) * 0.18;
      vec3 color = vec3(0.7, 0.95, 1.0);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ ShardMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    shardMaterial: ThreeElement<typeof ShardMaterial>;
  }
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

// Camera sits at z=1 looking toward -Z; the grid/fluid layers are opaque
// planes at z=0 and z=0.1 that fill the whole frustum, so dust has to live
// strictly in front of them (z between ~0.15 and 0.9) or it's invisible,
// fully occluded. Each particle's x/y spread is scaled to its own depth so
// it lands within (a bit beyond) the camera's frustum at that distance,
// keeping coverage even across the near/far band instead of clustering.
function makeParticleAttributes(count: number, sizeRange: [number, number]) {
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const seeds = new Float32Array(count);

  const halfFovTan = Math.tan((75 / 2) * (Math.PI / 180));
  const aspect =
    typeof window !== "undefined" ? window.innerWidth / window.innerHeight : 1.6;

  for (let i = 0; i < count; i++) {
    const z = 0.15 + Math.random() * 0.75;
    const distFromCamera = 1 - z;
    const halfHeight = distFromCamera * halfFovTan * 1.3;
    const halfWidth = halfHeight * aspect;

    positions[i * 3] = (Math.random() - 0.5) * 2 * halfWidth;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 2 * halfHeight;
    positions[i * 3 + 2] = z;
    sizes[i] = sizeRange[0] + Math.random() * (sizeRange[1] - sizeRange[0]);
    seeds[i] = Math.random();
  }

  return { positions, sizes, seeds };
}

function DustField() {
  const dustMaterialRef = useRef<InstanceType<typeof DustMaterial>>(null);
  const shardMaterialRef = useRef<InstanceType<typeof ShardMaterial>>(null);
  const mouseTarget = useRef({ x: 0, y: 0 });
  const scroll = useScrollVelocity();

  const dust = useMemo(() => makeParticleAttributes(320, [0.5, 1.3]), []);
  const shards = useMemo(() => makeParticleAttributes(28, [1.4, 2.6]), []);

  useFrame((state) => {
    const scrollValue = scroll.sample();
    const pixelRatio = state.gl.getPixelRatio();

    mouseTarget.current.x = MathUtils.lerp(mouseTarget.current.x, state.pointer.x, 0.03);
    mouseTarget.current.y = MathUtils.lerp(mouseTarget.current.y, state.pointer.y, 0.03);

    if (dustMaterialRef.current) {
      dustMaterialRef.current.uTime = state.clock.elapsedTime;
      dustMaterialRef.current.uMouse.set(mouseTarget.current.x, mouseTarget.current.y);
      dustMaterialRef.current.uScroll = scrollValue;
      dustMaterialRef.current.uPixelRatio = pixelRatio;
    }
    if (shardMaterialRef.current) {
      shardMaterialRef.current.uTime = state.clock.elapsedTime;
      shardMaterialRef.current.uMouse.set(mouseTarget.current.x, mouseTarget.current.y);
      shardMaterialRef.current.uScroll = scrollValue;
      shardMaterialRef.current.uPixelRatio = pixelRatio;
    }
  });

  return (
    <>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[dust.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[dust.sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[dust.seeds, 1]} />
        </bufferGeometry>
        <dustMaterial
          ref={dustMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
      <points frustumCulled={false}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[shards.positions, 3]} />
          <bufferAttribute attach="attributes-aSize" args={[shards.sizes, 1]} />
          <bufferAttribute attach="attributes-aSeed" args={[shards.seeds, 1]} />
        </bufferGeometry>
        <shardMaterial
          ref={shardMaterialRef}
          transparent
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed top-0 left-0 w-screen h-screen z-[-1]">
      <Canvas camera={{ position: [0, 0, 1] }} dpr={[1, 1.5]}>
        <Suspense fallback={null}>
          <DustField />
          <GridLayer />
          <FluidLayer />
        </Suspense>
      </Canvas>
    </div>
  );
}
