import * as THREE from "three";
import type { Material } from "@/state/ui";
import { withImperfections } from "./imperfections";

/** Chromium's measured reflectance (F0) in linear sRGB, from physicallybased.info. */
const CHROMIUM = new THREE.Color().setRGB(0.549, 0.556, 0.554, THREE.LinearSRGBColorSpace);

export function chrome(): THREE.MeshPhysicalMaterial {
  return withImperfections(
    new THREE.MeshPhysicalMaterial({ color: CHROMIUM, metalness: 1, roughness: 0.035 }),
    0.09,
    0.01,
  );
}

export function porcelain(): THREE.MeshPhysicalMaterial {
  return withImperfections(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color("#d9d4ca"),
      metalness: 0,
      roughness: 0.45,
      clearcoat: 1,
      clearcoatRoughness: 0.05,
    }),
    0.02,
    0.04,
  );
}

export function darkMetal(): THREE.MeshPhysicalMaterial {
  return withImperfections(
    new THREE.MeshPhysicalMaterial({
      color: new THREE.Color().setRGB(0.16, 0.165, 0.175, THREE.LinearSRGBColorSpace),
      metalness: 1,
      roughness: 0.22,
    }),
    0.05,
    0.08,
  );
}

export const materialFactories: Record<Material, () => THREE.MeshPhysicalMaterial> = {
  chrome,
  porcelain,
  darkMetal,
};
