"use client";

import { useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

const NODE_COUNT = 100;

type Node = {
  x: number;
  y: number;
  z: number;
  scale: number;
  floatSpeed: number;
  floatOffset: number;
};

function NodeMatrix() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const { viewport } = useThree();

  // Math.random is impure, so node positions are seeded once via a useState
  // lazy initializer (React's sanctioned escape hatch for non-deterministic
  // initial values) instead of being generated directly during render.
  const [nodes] = useState<Node[]>(() =>
    Array.from({ length: NODE_COUNT }, () => ({
      x: (Math.random() - 0.5) * viewport.width * 1.6,
      y: (Math.random() - 0.5) * viewport.height * 1.6,
      z: (Math.random() - 0.5) * 6,
      scale: 0.15 + Math.random() * 0.25,
      floatSpeed: 0.1 + Math.random() * 0.2,
      floatOffset: Math.random() * Math.PI * 2,
    }))
  );

  // Pure useFrame mutation, no React state, so this never re-renders React.
  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    mesh.rotation.y += 0.0008;
    mesh.rotation.x += 0.0003;

    const t = state.clock.elapsedTime;
    for (let i = 0; i < nodes.length; i++) {
      const node = nodes[i];
      const y = node.y + Math.sin(t * node.floatSpeed + node.floatOffset) * 0.4;
      dummy.position.set(node.x, y, node.z);
      dummy.scale.setScalar(node.scale);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, NODE_COUNT]}>
      <icosahedronGeometry args={[1, 0]} />
      <meshBasicMaterial color="#00ffff" wireframe transparent opacity={0.2} />
    </instancedMesh>
  );
}

export default function BackgroundCanvas() {
  return (
    <div className="fixed inset-0 z-[-1]">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 60 }}
        dpr={[1, 1.5]}
        gl={{ powerPreference: "high-performance", antialias: false, alpha: true }}
      >
        <NodeMatrix />
      </Canvas>
    </div>
  );
}
