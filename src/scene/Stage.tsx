"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useEffect, useRef } from "react";
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

export default function Stage({ onFirstFrame }: { onFirstFrame?: () => void }) {
  return (
    <Canvas
      className="!absolute inset-0"
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 2]}
      frameloop="demand"
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
        <Ready onReady={onFirstFrame} />
      </Suspense>
    </Canvas>
  );
}
