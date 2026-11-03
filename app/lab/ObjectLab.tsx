"use client";

import { button, useControls } from "leva";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { cradle } from "@/scene/world";
import { HDRIS, type Look, defaultLook, useLook } from "@/scene/look";
import { type Material, useUi } from "@/state/ui";

const Stage = dynamic(() => import("@/scene/Stage"), { ssr: false });
const deg = (d: number) => (d * Math.PI) / 180;

/**
 * Applies `?key=value` overrides (used by screenshot scripts) before the first render, so leva's
 * controls start from them instead of resetting them on mount.
 */
function applyQuery() {
  const q = new URLSearchParams(window.location.search);
  const patch: Partial<Look> = {};
  for (const [k, v] of q) {
    if (!(k in defaultLook)) continue;
    const current = defaultLook[k as keyof Look];
    (patch as Record<string, unknown>)[k] = Array.isArray(current)
      ? v.split(",").map(Number)
      : typeof current === "number"
        ? Number(v)
        : v;
  }
  useLook.getState().set(patch);
  const material = q.get("material");
  if (material) useUi.getState().setMaterial(material as Material);
}

export function ObjectLab() {
  useState(() => typeof window !== "undefined" && applyQuery());
  useEffect(() => {
    const lift = new URLSearchParams(window.location.search).get("lift");
    if (lift) cradle.lift(0, deg(-Number(lift)));
  }, []);
  const set = useLook((s) => s.set);
  const setMaterial = useUi((s) => s.setMaterial);

  useControls(
    "object",
    () => ({
      material: {
        value: useUi.getState().material,
        options: ["chrome", "porcelain", "darkMetal"],
        onChange: (v: Material) => setMaterial(v),
      },
      string: {
        value: useLook.getState().string,
        options: ["nylon", "thread", "wire"],
        onChange: (v: Look["string"]) => set({ string: v }),
      },
      "lift 1": button(() => cradle.lift(0, deg(-30))),
      "lift 2": button(() => [0, 1].forEach((i) => cradle.lift(i, deg(-30)))),
      "slack drop": button(() => cradle.place(0, { x: cradle.balls[0]!.pos.x - 0.12, y: 0.15, z: 0 })),
    }),
    [],
  );
  useControls(
    "light",
    () => ({
      hdri: {
        value: useLook.getState().hdri,
        options: [...HDRIS],
        onChange: (v: Look["hdri"]) => set({ hdri: v }),
      },
      envIntensity: {
        value: useLook.getState().envIntensity,
        min: 0,
        max: 3,
        step: 0.05,
        onChange: (v: number) => set({ envIntensity: v }),
      },
      envRotation: {
        value: useLook.getState().envRotation,
        min: -Math.PI,
        max: Math.PI,
        step: 0.01,
        onChange: (v: number) => set({ envRotation: v }),
      },
      toneMap: {
        value: useLook.getState().toneMap,
        options: ["neutral", "agx", "aces"],
        onChange: (v: Look["toneMap"]) => set({ toneMap: v }),
      },
      exposure: {
        value: useLook.getState().exposure,
        min: 0.2,
        max: 3,
        step: 0.05,
        onChange: (v: number) => set({ exposure: v }),
      },
      keyIntensity: {
        value: useLook.getState().keyIntensity,
        min: 0,
        max: 200,
        step: 1,
        onChange: (v: number) => set({ keyIntensity: v }),
      },
      keyPosition: {
        value: useLook.getState().keyPosition,
        step: 0.05,
        onChange: (v: [number, number, number]) => set({ keyPosition: v }),
      },
    }),
    [],
  );
  useControls(
    "wall",
    () => ({
      shadow: {
        value: useLook.getState().shadow,
        options: ["pcss", "vsm"],
        onChange: (v: Look["shadow"]) => set({ shadow: v }),
      },
      shadowOpacity: {
        value: useLook.getState().shadowOpacity,
        min: 0,
        max: 1,
        step: 0.01,
        onChange: (v: number) => set({ shadowOpacity: v }),
      },
      lightSize: {
        value: useLook.getState().lightSize,
        min: 0.01,
        max: 0.4,
        step: 0.005,
        onChange: (v: number) => set({ lightSize: v }),
      },
      wallDistance: {
        value: useLook.getState().wallDistance,
        min: 0.15,
        max: 0.6,
        step: 0.01,
        onChange: (v: number) => set({ wallDistance: v }),
      },
      pool: {
        value: useLook.getState().pool,
        min: 0,
        max: 0.3,
        step: 0.005,
        onChange: (v: number) => set({ pool: v }),
      },
    }),
    [],
  );

  return <Stage />;
}
