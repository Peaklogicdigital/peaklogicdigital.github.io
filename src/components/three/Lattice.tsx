"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Line } from "@react-three/drei";
import { MathUtils, Vector3 } from "three";
import type { Group, Mesh } from "three";
import MiniCanvas from "./MiniCanvas";

const NODES: [number, number, number][] = [
  [-1.1, 0.6, 0.2],
  [0.4, 1.0, -0.3],
  [1.2, 0.1, 0.1],
  [0.6, -0.9, 0.3],
  [-0.6, -0.7, -0.2],
  [-1.3, -0.1, 0.4],
  [0, 0.05, 0.6],
];

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 0],
  [0, 6],
  [2, 6],
  [4, 6],
];

function LatticeScene() {
  const groupRef = useRef<Group>(null);
  const tilt = useRef({ x: 0, y: 0 });
  const hovered = useRef(false);
  const pulseRefs = useRef<(Mesh | null)[]>([]);
  const pulseT = useRef(EDGES.map((_, i) => i * (1 / EDGES.length)));

  const nodeVecs = useMemo(() => NODES.map((p) => new Vector3(...p)), []);

  useFrame((state, delta) => {
    const group = groupRef.current;
    if (group) {
      const targetX = state.pointer.y * 0.35;
      const targetY = state.pointer.x * 0.35;
      tilt.current.x = MathUtils.lerp(tilt.current.x, targetX, 0.05);
      tilt.current.y = MathUtils.lerp(tilt.current.y, targetY, 0.05);
      group.rotation.x = tilt.current.x;
      group.rotation.y = tilt.current.y + state.clock.elapsedTime * 0.05;
    }

    EDGES.forEach((edge, i) => {
      const mesh = pulseRefs.current[i];
      if (!mesh) return;
      if (hovered.current) {
        pulseT.current[i] = (pulseT.current[i] + delta * 0.8) % 1;
        mesh.visible = true;
        const [a, b] = edge;
        mesh.position.lerpVectors(nodeVecs[a], nodeVecs[b], pulseT.current[i]);
      } else {
        mesh.visible = false;
      }
    });
  });

  return (
    <group
      ref={groupRef}
      onPointerOver={() => (hovered.current = true)}
      onPointerOut={() => (hovered.current = false)}
    >
      {NODES.map((pos, i) => (
        <mesh key={i} position={pos} scale={0.16}>
          <icosahedronGeometry args={[1, 0]} />
          <meshPhysicalMaterial
            color="#e8fbff"
            transmission={1}
            thickness={0.4}
            roughness={0.1}
            ior={1.5}
            clearcoat={1}
            envMapIntensity={1.4}
          />
        </mesh>
      ))}

      {EDGES.map(([a, b], i) => (
        <Line
          key={i}
          points={[NODES[a], NODES[b]]}
          color="#3f5566"
          transparent
          opacity={0.5}
          lineWidth={1}
        />
      ))}

      {EDGES.map((_, i) => (
        <mesh
          key={`pulse-${i}`}
          ref={(el) => {
            pulseRefs.current[i] = el;
          }}
          visible={false}
        >
          <sphereGeometry args={[0.045, 8, 8]} />
          <meshBasicMaterial color="#22d3ee" />
        </mesh>
      ))}
    </group>
  );
}

export default function Lattice({ cameraZ = 4.2 }: { cameraZ?: number }) {
  return (
    <MiniCanvas cameraZ={cameraZ}>
      <LatticeScene />
    </MiniCanvas>
  );
}
