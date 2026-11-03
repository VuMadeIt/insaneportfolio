"use client";

import { useFrame } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import { useLook } from "./look";
import { ropes } from "./world";

const STRING_WIDTH = 0.0004;
const SAMPLES = 24;

/**
 * Shadows of the strings, projected onto the wall plane from the spotlight. A shadow map cannot
 * resolve a 0.4 mm line, so this is done analytically: the penumbra of a thin line is
 * `lightSize * d_wall / d_light` wide, and its darkness is the fraction of the emitter the line
 * covers, `width * D_total / (d_light * lightSize)`. Physically faint, as on a real wall.
 */
export function StringShadows() {
  const look = useLook();
  const { geometry, material } = useMemo(() => {
    const geometry = new THREE.BufferGeometry();
    const perRope = SAMPLES * 2;
    geometry.setAttribute(
      "position",
      new THREE.BufferAttribute(new Float32Array(ropes.length * perRope * 3), 3),
    );
    geometry.setAttribute("side", new THREE.BufferAttribute(new Float32Array(ropes.length * perRope), 1));
    const side = geometry.getAttribute("side") as THREE.BufferAttribute;
    const index: number[] = [];
    for (let r = 0; r < ropes.length; r++) {
      for (let s = 0; s < SAMPLES; s++) {
        side.setX(r * perRope + s * 2, -1);
        side.setX(r * perRope + s * 2 + 1, 1);
        if (s === SAMPLES - 1) continue;
        const a = r * perRope + s * 2;
        index.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
      }
    }
    geometry.setIndex(index);
    const material = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      toneMapped: false,
      uniforms: { uDarkness: { value: 0 } },
      vertexShader: `attribute float side; varying float vSide;
        void main() { vSide = side; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
      fragmentShader: `uniform float uDarkness; varying float vSide;
        void main() { float a = exp(-3.0 * vSide * vSide); gl_FragColor = vec4(0.17, 0.15, 0.12, uDarkness * a); }`,
    });
    return { geometry, material };
  }, []);

  const light = useMemo(() => new THREE.Vector3(), []);
  const p = useMemo(() => new THREE.Vector3(), []);
  const next = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    light.set(...look.keyPosition);
    const wallZ = -look.wallDistance + 0.0008;
    const pos = geometry.getAttribute("position") as THREE.BufferAttribute;
    let darkness = 0;
    ropes.forEach((rope, r) => {
      const pts = rope.points;
      for (let s = 0; s < SAMPLES; s++) {
        const u = (s / (SAMPLES - 1)) * (pts.length - 1);
        const k = Math.min(pts.length - 2, Math.floor(u));
        const a = pts[k]!;
        const b = pts[k + 1]!;
        p.set(a.x + (b.x - a.x) * (u - k), a.y + (b.y - a.y) * (u - k), a.z + (b.z - a.z) * (u - k));
        const dLight = light.distanceTo(p);
        const t = (wallZ - light.z) / (p.z - light.z);
        const dWall = dLight * (t - 1);
        next.copy(p).sub(light).multiplyScalar(t).add(light);
        const penumbra = (look.lightSize * dWall) / dLight + STRING_WIDTH * t;
        // An umbra (the whole emitter hidden) is as dark as a ball's shadow core: shadowOpacity.
        darkness =
          Math.min(1, (STRING_WIDTH * t * dLight) / (dWall * look.lightSize + 1e-9)) * look.shadowOpacity;
        // Offset sideways in x: the strings are near vertical, so the ribbon's width is horizontal.
        pos.setXYZ(r * SAMPLES * 2 + s * 2, next.x - penumbra / 2, next.y, wallZ);
        pos.setXYZ(r * SAMPLES * 2 + s * 2 + 1, next.x + penumbra / 2, next.y, wallZ);
      }
    });
    pos.needsUpdate = true;
    material.uniforms.uDarkness!.value = darkness;
  });

  return <mesh geometry={geometry} material={material} frustumCulled={false} renderOrder={-1} />;
}
