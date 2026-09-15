"use client";

import { Suspense, type ReactNode } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import CanvasErrorBoundary from "./CanvasErrorBoundary";

export default function MiniCanvas({
  children,
  cameraZ = 4,
}: {
  children: ReactNode;
  cameraZ?: number;
}) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        className="w-full h-full"
        dpr={[1, 1.5]}
        camera={{ position: [0, 0, cameraZ], fov: 40 }}
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={0.35} />
        <pointLight position={[2.5, 2, 3]} intensity={1.4} color="#22d3ee" />
        <pointLight position={[-2, -1.5, 2]} intensity={0.5} color="#67e8f9" />
        <Suspense fallback={null}>
          {children}
          {/* Procedural, network-free environment (no external HDR fetch) -
              gives transmission/clearcoat materials real reflections while
              matching the site's own cyan/obsidian palette. */}
          <Environment resolution={128}>
            <Lightformer
              form="rect"
              intensity={2.5}
              color="#22d3ee"
              position={[3, 2, 2]}
              scale={[3, 3, 1]}
            />
            <Lightformer
              form="rect"
              intensity={1.2}
              color="#ffffff"
              position={[-3, -1.5, 2]}
              scale={[2, 2, 1]}
            />
            <Lightformer
              form="ring"
              intensity={1.8}
              color="#67e8f9"
              position={[0, 0, -5]}
              scale={6}
            />
          </Environment>
        </Suspense>
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.4}
            luminanceSmoothing={0.3}
            intensity={0.7}
            mipmapBlur
          />
        </EffectComposer>
      </Canvas>
    </CanvasErrorBoundary>
  );
}
