import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import type { ThreeElement } from "@react-three/fiber";
import * as THREE from "three";

const FrostedGlassMaterial = shaderMaterial(
  {
    uRimColor: new THREE.Color("#22d3ee"),
    uBaseColor: new THREE.Color("#0d1117"),
    uOpacity: 0.25,
  },
  /* glsl vertex */ `
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vNormal = normalize(normalMatrix * normal);
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      vViewPosition = -mvPosition.xyz;
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  /* glsl fragment */ `
    uniform vec3 uRimColor;
    uniform vec3 uBaseColor;
    uniform float uOpacity;
    varying vec3 vNormal;
    varying vec3 vViewPosition;

    void main() {
      vec3 viewDir = normalize(vViewPosition);
      float fresnel = pow(1.0 - max(dot(normalize(vNormal), viewDir), 0.0), 2.5);
      vec3 color = mix(uBaseColor, uRimColor, fresnel);
      float alpha = clamp(uOpacity + fresnel * 0.7, 0.0, 1.0);
      gl_FragColor = vec4(color, alpha);
    }
  `
);

extend({ FrostedGlassMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    frostedGlassMaterial: ThreeElement<typeof FrostedGlassMaterial>;
  }
}

export default FrostedGlassMaterial;
