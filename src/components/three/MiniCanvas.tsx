"use client";

import { Canvas } from "@react-three/fiber";
import type { ReactNode } from "react";

export default function MiniCanvas({
  children,
  cameraZ = 4,
}: {
  children: ReactNode;
  cameraZ?: number;
}) {
  return (
    <Canvas
      className="w-full h-full"
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, cameraZ], fov: 40 }}
      gl={{ antialias: true, alpha: true }}
    >
      <ambientLight intensity={0.35} />
      <pointLight position={[2.5, 2, 3]} intensity={1.4} color="#22d3ee" />
      <pointLight position={[-2, -1.5, 2]} intensity={0.5} color="#67e8f9" />
      {children}
    </Canvas>
  );
}
