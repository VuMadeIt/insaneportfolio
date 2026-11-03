"use client";

import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { playImpacts } from "@/audio/clack";
import { identities } from "@/content/identities";
import { useUi } from "@/state/ui";
import { withIdentity } from "./identities/material";
import { useIdentities } from "./identities/useIdentities";
import { useLook } from "./look";
import { materialFactories } from "./materials";
import { stringMaterial } from "./materials/string";
import { StringTube } from "./stringGeometry";
import { REFLECTION_LAYER } from "./Wall";
import { afterFrame, anchorOf, cradle, frame, requestRender, ropeOf, ropes, tick } from "./world";

const R = cradle.config.ball.radius;
const EYE = cradle.config.eyeletHeight;
const UP = new THREE.Vector3(0, 1, 0);
const STRING_RADIUS = 0.0002;
const CUBE_SIZE = 192;
/** Transverse string kick per m/s of impact speed (m/s). */
const STRING_KICK = 0.05;
const SETTLE_TIME = 1.5;
const MAX_FRAME = 0.05;

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
      cubes.map((c, i) => {
        const m = withIdentity(materialFactories[material](), identities[i]!.slug, R, i * 1.7);
        m.envMap = c.target.texture;
        return m;
      }),
    [cubes, material],
  );
  const identityUniforms = useMemo(() => ballMaterials.map((m) => m.userData.identity), [ballMaterials]);
  const updateIdentities = useIdentities(identityUniforms);
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
  const projected = useMemo(() => new THREE.Vector3(), []);
  const kick = useMemo(() => ({ x: 0, y: 0, z: 0 }), []);
  const frameCount = useRef(0);
  const lastActive = useRef(0);
  const onScreen = useRef(true);

  // Render only while the hero is visible.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      onScreen.current = !!e?.isIntersecting;
      if (onScreen.current) requestRender();
    });
    io.observe(gl.domElement);
    return () => io.disconnect();
  }, [gl]);

  useFrame((state, delta) => {
    const dt = Math.min(delta, MAX_FRAME);
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

    // A hard hit sends a small shiver up both strings of the two balls involved.
    for (const e of frame.events) {
      kick.x = e.speed * STRING_KICK;
      for (const ball of [e.a, e.b]) for (const side of [0, 1] as const) ropeOf(ball, side).kick(kick);
    }
    playImpacts(frame.events, useUi.getState().sound);

    ropes.forEach((rope, k) => {
      const ball = k >> 1;
      const side = (k & 1) as 0 | 1;
      rope.step(dt, anchorOf(ball, side), frame.eyelets[ball]!);
      tubes[k]!.update(rope.points);
    });

    // Each ball sees its neighbours, the strings and the wall: one cube camera per frame, in turn.
    const env = scene.userData.reflectionBackground as THREE.Texture | undefined;
    if (env) {
      const n = frameCount.current++;
      const batch = n < 2 ? cubes.length : 1;
      // The six cube faces must not each re-render the shadow map (it is redrawn for the main view).
      const autoShadows = gl.shadowMap.autoUpdate;
      gl.shadowMap.autoUpdate = false;
      identityUniforms.forEach((u) => (u.uDetail.value = 0));
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
      gl.shadowMap.autoUpdate = autoShadows;
      identityUniforms.forEach((u) => (u.uDetail.value = 1));
    }

    // Project the balls for the DOM layer (accessible buttons, captions).
    frame.centres.forEach((c, i) => {
      projected.set(c.x, c.y, c.z).project(state.camera);
      const x = ((projected.x + 1) / 2) * state.size.width;
      const y = ((1 - projected.y) / 2) * state.size.height;
      projected.set(c.x + R, c.y, c.z).project(state.camera);
      const s = frame.screen[i]!;
      s.x = x;
      s.y = y;
      s.r = ((projected.x + 1) / 2) * state.size.width - x;
    });
    afterFrame.forEach((f) => f());
    const animating = updateIdentities(state.clock.elapsedTime, dt);

    // Keep rendering while anything moves; the strings get a moment to settle after the balls sleep.
    const now = state.clock.elapsedTime;
    if (!cradle.asleep) lastActive.current = now;
    const busy =
      animating || !cradle.asleep || now - lastActive.current < SETTLE_TIME || frameCount.current < 8;
    if (busy && onScreen.current) state.invalidate();
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
