"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { CradleModel } from "./Cradle";
import { CAMERA_HEIGHT, FOV, frameFor } from "./framing";
import { Interaction } from "./Interaction";
import { Lighting } from "./Lighting";
import { useLook } from "./look";
import { StringShadows } from "./StringShadows";
import { Wall } from "./Wall";
import { setInvalidate } from "./world";

const TONE_MAPS = {
  neutral: THREE.NeutralToneMapping,
  agx: THREE.AgXToneMapping,
  aces: THREE.ACESFilmicToneMapping,
} as const;

/** A fixed long-lens camera with a lens shift, so verticals stay parallel like a product photo. */
function Rig() {
  const { camera, size } = useThree();
  useEffect(() => {
    const cam = camera as THREE.PerspectiveCamera;
    const f = frameFor(size.width, size.height);
    cam.fov = FOV;
    cam.position.set(0, CAMERA_HEIGHT, f.distance);
    cam.lookAt(0, CAMERA_HEIGHT, 0);
    cam.setViewOffset(size.width, size.height, 0, f.shiftPx, size.width, size.height);
    cam.updateProjectionMatrix();
  }, [camera, size.width, size.height]);
  return null;
}

/** Lets the DOM layer wake the on-demand render loop. */
function RenderHook() {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    setInvalidate(invalidate);
    return () => setInvalidate(() => {});
  }, [invalidate]);
  return null;
}

function Exposure() {
  const { gl } = useThree();
  const toneMap = useLook((s) => s.toneMap);
  const exposure = useLook((s) => s.exposure);
  useEffect(() => {
    gl.toneMapping = TONE_MAPS[toneMap];
    gl.toneMappingExposure = exposure;
  }, [gl, toneMap, exposure]);
  return null;
}

/** Signals once the environment has loaded and every ball has rendered its reflections. */
function Ready({ onReady }: { onReady?: () => void }) {
  const frames = useRef(0);
  useFrame(() => {
    if (++frames.current === 4) onReady?.();
  });
  return null;
}

/**
 * Compiles every shader in the scene before the first frame. Rendering straight away links the
 * programs synchronously, which on Windows (ANGLE over Direct3D) froze the whole page for several
 * seconds on a first visit: no drop, no hover videos, no scrolling. With KHR_parallel_shader_compile
 * the browser compiles them off the main thread while the page stays responsive. The balls'
 * reflection cubes render into targets without tone mapping, which needs its own variant of every
 * material, so those are compiled too, with a cube target bound.
 */
function Precompile({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const { gl, scene, camera, invalidate } = useThree();
  useEffect(() => {
    let live = true;
    const compile = async () => {
      await gl.compileAsync(scene, camera);
      const cube = (
        scene.userData.cubes as { target: THREE.WebGLCubeRenderTarget; camera: THREE.CubeCamera }[]
      )?.[0];
      if (!cube) return;
      gl.setRenderTarget(cube.target);
      // The variant is chosen synchronously, from the bound target; only the wait is async.
      const pending = gl.compileAsync(scene, cube.camera.children[0] as THREE.Camera);
      gl.setRenderTarget(null);
      await pending;
    };
    compile()
      .catch(() => {})
      .then(() => live && onDone());
    return () => void (live = false);
  }, [gl, scene, camera, onDone]);
  // The first frame, once the loop is on (a frame later, after the canvas has taken the new mode).
  useEffect(() => {
    if (!ready) return;
    const id = requestAnimationFrame(() => invalidate());
    return () => cancelAnimationFrame(id);
  }, [ready, invalidate]);
  return null;
}

export default function Stage({ onFirstFrame }: { onFirstFrame?: () => void }) {
  const [ready, setReady] = useState(false);
  const done = useCallback(() => setReady(true), []);
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      frameloop={ready ? "demand" : "never"}
      shadows
      camera={{ fov: FOV, near: 0.05, far: 20 }}
      onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
    >
      <Rig />
      <Exposure />
      <RenderHook />
      <Interaction />
      <Suspense fallback={null}>
        <Lighting />
        <Wall />
        <CradleModel />
        <StringShadows />
        <Precompile ready={ready} onDone={done} />
        <Ready onReady={onFirstFrame} />
      </Suspense>
    </Canvas>
  );
}
