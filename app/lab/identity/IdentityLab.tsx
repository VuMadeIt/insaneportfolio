"use client";

import { Environment } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useMemo, useState } from "react";
import * as THREE from "three";
import { identities } from "@/content/identities";
import { VARIANT, withIdentity } from "@/scene/identities/material";
import { materialFactories } from "@/scene/materials";
import type { Reveal } from "@/state/ui";

const R = 0.0325;

function Ball({
  index,
  reveal,
  variant,
  time,
}: {
  index: number;
  reveal: number;
  variant: Reveal;
  time: number | null;
}) {
  const material = useMemo(
    () => withIdentity(materialFactories.chrome(), identities[index]!.slug, R, index * 1.7),
    [index],
  );
  const u = material.userData.identity;
  useFrame((_, dt) => {
    u.uReveal.value = reveal;
    u.uVariant.value = VARIANT[variant];
    u.uWeave.value = Math.min(1, u.uWeave.value + dt / 4);
    u.uTime.value = time ?? u.uTime.value + dt;
  });
  return (
    <mesh position={[(index - 1.5) * R * 2.3, 0, 0]} material={material}>
      <sphereGeometry args={[R, 128, 96]} />
    </mesh>
  );
}

/** Four identities, large and fully revealed, for side-by-side review against the references. */
export function IdentityLab() {
  const [q] = useState(() =>
    typeof window === "undefined" ? new URLSearchParams() : new URLSearchParams(window.location.search),
  );
  const variant = (q.get("reveal") ?? "b") as Reveal;
  const reveal = Number(q.get("value") ?? 1);
  const time = q.get("t") ? Number(q.get("t")) : null;
  return (
    <main className="h-dvh w-full bg-wall">
      <Canvas
        gl={{ antialias: true, alpha: true, toneMapping: THREE.NeutralToneMapping }}
        camera={{ fov: 18, position: [0, 0, 0.29] }}
        dpr={[1, 2]}
      >
        <Environment files="/hdri/gallery_neutral.hdr" />
        {identities.map((_, i) => (
          <Ball key={i} index={i} reveal={reveal} variant={variant} time={time} />
        ))}
      </Canvas>
    </main>
  );
}
