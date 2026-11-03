"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useUi } from "@/state/ui";
import { useLook } from "./look";
import { materialFactories } from "./materials";
import { stringMaterial } from "./materials/string";
import { StringTube } from "./stringGeometry";
import { REFLECTION_LAYER } from "./Wall";
import { anchorOf, cradle, frame, ropeOf, ropes, tick } from "./world";

const R = cradle.config.ball.radius;
const EYE = cradle.config.eyeletHeight;
const UP = new THREE.Vector3(0, 1, 0);
const STRING_RADIUS = 0.0002;
const CUBE_SIZE = 192;

/** Shared geometry: one sphere for all four balls and one screw eye. */
function useHardware() {
  return useMemo(() => {
    const sphere = new THREE.SphereGeometry(R, 128, 96);
    const ringRadius = 0.0026;
    const wire = 0.00065;
    const ring = new THREE.TorusGeometry(ringRadius, wire, 12, 40);
    ring.rotateY(Math.PI / 2);
    ring.translate(0, R + EYE - ringRadius - wire, 0);
    const shank = new THREE.CylinderGeometry(0.0011, 0.0013, 0.0045, 16);
    shank.translate(0, R + 0.0012, 0);
    const knot = new THREE.SphereGeometry(0.0008, 12, 8);
    knot.translate(0, R + EYE, 0);
    return { sphere, ring, shank, knot };
  }, []);
}

export function CradleModel() {
  const material = useUi((s) => s.material);
  const look = useLook();
  const { gl, scene, size, viewport } = useThree();
  const hardware = useHardware();
  const groups = useRef<(THREE.Group | null)[]>([]);
  const spheres = useRef<(THREE.Mesh | null)[]>([]);
  const lightPos = useMemo(() => new THREE.Vector3(), []);

  const cubes = useMemo(
    () =>
      cradle.balls.map(() => {
        const target = new THREE.WebGLCubeRenderTarget(CUBE_SIZE, { type: THREE.HalfFloatType });
        const camera = new THREE.CubeCamera(R * 1.02, 10, target);
        camera.children.forEach((c) => c.layers.enable(REFLECTION_LAYER));
        return { target, camera };
      }),
    [],
  );

  const ballMaterials = useMemo(
    () =>
      cubes.map((c) => {
        const m = materialFactories[material]();
        m.envMap = c.target.texture;
        return m;
      }),
    [cubes, material],
  );
  useEffect(() => () => ballMaterials.forEach((m) => m.dispose()), [ballMaterials]);
  useEffect(() => {
    ballMaterials.forEach((m) => (m.envMapIntensity = look.envIntensity));
  }, [ballMaterials, look.envIntensity]);

  const hardwareMaterial = useMemo(() => {
    const m = materialFactories.chrome();
    m.envMap = scene.environment;
    return m;
  }, [scene.environment]);
  const knotMaterial = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({ color: "#e9e6df", roughness: 0.35, transparent: true, opacity: 0.8 }),
    [],
  );

  const tubes = useMemo(() => ropes.map(() => new StringTube(48, STRING_RADIUS)), []);
  const lineMaterial = useMemo(() => stringMaterial(look.string, lightPos), [look.string, lightPos]);

  useEffect(() => {
    lightPos.set(...look.keyPosition);
  }, [lightPos, look.keyPosition]);
  useEffect(() => {
    lineMaterial.uniforms.uViewportHeight!.value = size.height * viewport.dpr;
  }, [lineMaterial, size.height, viewport.dpr]);

  const up = useMemo(() => new THREE.Vector3(), []);
  const q = useMemo(() => new THREE.Quaternion(), []);
  const frameCount = useRef(0);

  useFrame((_, dt) => {
    tick(dt);
    cradle.balls.forEach((_, i) => {
      const g = groups.current[i];
      if (!g) return;
      const c = frame.centres[i]!;
      const mid = cradle.anchorMid(i);
      up.set(mid.x - c.x, mid.y - c.y, mid.z - c.z).normalize();
      g.position.set(c.x, c.y, c.z);
      g.quaternion.copy(q.setFromUnitVectors(UP, up));
    });
    ropes.forEach((rope, k) => {
      const ball = k >> 1;
      const side = (k & 1) as 0 | 1;
      rope.step(dt, anchorOf(ball, side), frame.eyelets[ball]!);
      tubes[k]!.update(ropeOf(ball, side).points);
    });

    // Each ball sees its neighbours, the strings and the wall: one cube camera per frame, in turn.
    const env = scene.userData.reflectionBackground as THREE.Texture | undefined;
    if (!env) return;
    const n = frameCount.current++;
    const batch = n < 2 ? cubes.length : 1;
    for (let k = 0; k < batch; k++) {
      const i = (n + k) % cubes.length;
      const cube = cubes[i]!;
      const g = groups.current[i];
      if (!g) continue;
      g.visible = false;
      cube.camera.position.copy(g.position);
      scene.background = env;
      cube.camera.update(gl, scene);
      scene.background = null;
      g.visible = true;
      cube.target.texture.needsPMREMUpdate = true;
    }
  });

  return (
    <>
      {cradle.balls.map((_, i) => (
        <group key={i} ref={(g) => void (groups.current[i] = g)}>
          <mesh
            ref={(m) => void (spheres.current[i] = m)}
            geometry={hardware.sphere}
            material={ballMaterials[i]}
            castShadow
          />
          <mesh geometry={hardware.shank} material={hardwareMaterial} castShadow />
          <mesh geometry={hardware.ring} material={hardwareMaterial} castShadow />
          <mesh geometry={hardware.knot} material={knotMaterial} />
        </group>
      ))}
      {tubes.map((t, k) => (
        <mesh key={k} geometry={t.geometry} material={lineMaterial} frustumCulled={false} renderOrder={2} />
      ))}
    </>
  );
}
