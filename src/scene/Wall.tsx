"use client";

import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { frameFor } from "./framing";
import { useLook } from "./look";

export const REFLECTION_LAYER = 1;
/** The page's --wall (tokens.css). */
const WALL = "#f7f0df";

/**
 * The gallery wall. The canvas is transparent, so the page itself is the wall the visitor sees;
 * here we only draw what the spotlight adds to it (a faint pool of light) and what it takes away
 * (the shadows). A solid copy of the wall exists on a separate layer so the balls reflect it.
 */
export function Wall() {
  const look = useLook();
  const size = useThree((s) => s.size);
  const shadowMaterial = useMemo(
    () =>
      new THREE.ShadowMaterial({ color: new THREE.Color("#2b261f"), transparent: true, depthWrite: false }),
    [],
  );
  useEffect(() => {
    shadowMaterial.opacity = look.shadowOpacity;
  }, [shadowMaterial, look.shadowOpacity]);

  const pool = useMemo(
    () =>
      new THREE.ShaderMaterial({
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: { uStrength: { value: 0 } },
        vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uStrength; varying vec2 vUv;
          void main() {
            vec2 d = vUv - vec2(0.5, 0.55);
            float falloff = 1.0 - smoothstep(0.0, 0.5, length(d));
            gl_FragColor = vec4(vec3(1.0, 0.985, 0.96), uStrength * falloff * falloff);
          }`,
      }),
    [],
  );
  useEffect(() => {
    pool.uniforms.uStrength!.value = look.pool;
  }, [pool, look.pool]);

  // The pool must fade to nothing well inside the canvas so its edges match the page exactly.
  const framing = frameFor(size.width, size.height);
  const atWall = (framing.visibleHeight * (framing.distance + look.wallDistance)) / framing.distance;
  const poolSize: [number, number] = [atWall * (size.width / size.height) * 0.9, atWall * 0.9];

  const reflectionWall = useMemo(() => {
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.MeshBasicMaterial({ color: WALL, toneMapped: false }),
    );
    mesh.layers.set(REFLECTION_LAYER);
    return mesh;
  }, []);

  const z = -look.wallDistance;
  return (
    <>
      <primitive object={reflectionWall} position={[0, 0, z - 0.002]} />
      <mesh position={[0, 0, z]} scale={[...poolSize, 1]} material={pool} renderOrder={-2}>
        <planeGeometry />
      </mesh>
      <mesh position={[0, 0, z + 0.0005]} material={shadowMaterial} receiveShadow renderOrder={-1}>
        <planeGeometry args={[12, 12]} />
      </mesh>
    </>
  );
}
