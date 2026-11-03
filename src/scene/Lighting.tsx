"use client";

import { SoftShadows, useEnvironment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useLook } from "./look";
import { cradle } from "./world";

/** The HDRI the balls reflect and the key light that throws their shadows on the wall. */
export function Lighting() {
  const look = useLook();
  const scene = useThree((s) => s.scene);
  const gl = useThree((s) => s.gl);
  const env = useEnvironment({ files: `/hdri/${look.hdri}.hdr` });

  useEffect(() => {
    scene.environment = env;
    scene.environmentIntensity = look.envIntensity;
    scene.environmentRotation.set(0, look.envRotation, 0);
    scene.backgroundRotation.set(0, look.envRotation, 0);
    scene.backgroundIntensity = look.envIntensity;
    scene.userData.reflectionBackground = env;
  }, [scene, env, look.envIntensity, look.envRotation]);

  // PCSS mode: drei's SoftShadows owns the shadow map type (it needs the Basic path's raw depth).
  useEffect(() => {
    if (look.shadow !== "vsm" || gl.shadowMap.type === THREE.VSMShadowMap) return;
    gl.shadowMap.type = THREE.VSMShadowMap;
    scene.traverse((o) => {
      const m = (o as THREE.Mesh).material as THREE.Material | undefined;
      if (m) m.needsUpdate = true;
    });
  }, [gl, scene, look.shadow]);

  const spot = useMemo(() => {
    const light = new THREE.SpotLight("#fff6ea", look.keyIntensity, 0, 0.22, 0.65, 2);
    light.castShadow = true;
    light.shadow.mapSize.set(2048, 2048);
    light.shadow.bias = -0.00005;
    light.shadow.normalBias = 0.0015;
    light.shadow.camera.near = 1;
    light.shadow.camera.far = 8;
    return light;
  }, [look.keyIntensity]);

  useEffect(() => {
    spot.position.set(...look.keyPosition);
    spot.target.position.set(0, cradle.derived.pendulumLength * 0.3, -look.wallDistance);
    spot.target.updateMatrixWorld();
    // VSM blur sized to the physical penumbra: emitter size * blocker-to-wall / light-to-blocker.
    const lightDistance = spot.position.length();
    const penumbra = (look.lightSize * look.wallDistance) / lightDistance;
    const texel = (2 * (lightDistance + look.wallDistance) * Math.tan(spot.angle)) / spot.shadow.mapSize.x;
    spot.shadow.radius = look.shadow === "vsm" ? Math.max(1, penumbra / texel / 2) : 1;
    spot.shadow.blurSamples = 24;
    spot.shadow.needsUpdate = true;
  }, [spot, look.keyPosition, look.wallDistance, look.shadow, look.lightSize]);

  return (
    <>
      <primitive object={spot} />
      <primitive object={spot.target} />
      {look.shadow === "pcss" && <SoftShadows size={look.lightSize * 220} samples={20} focus={0.4} />}
    </>
  );
}
