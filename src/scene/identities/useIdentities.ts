"use client";

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useEffect, useMemo } from "react";
import * as THREE from "three";
import { useUi } from "@/state/ui";
import { useLook } from "../look";
import { cradle, frame, requestRender } from "../world";
import { type IdentityUniforms, VARIANT } from "./material";

gsap.registerPlugin(CustomEase);
const SITE_EASE = CustomEase.create("site", "0.23, 1, 0.32, 1");
const REVEAL_DURATION = 0.8;
const PEOPLE = 0;
const EXPERIMENTS = 2;
const GAZE_REACH = 0.07;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Drives the identity uniforms: the reveal tween on hover, focus or selection, and each identity's
 * life (blinks, gaze, the atom's weave). Returns a per-frame updater that reports whether anything
 * is still animating, so the on-demand loop keeps rendering only while it must.
 */
export function useIdentities(uniforms: IdentityUniforms[]) {
  const hovered = useUi((s) => s.hovered);
  const selected = useUi((s) => s.selected);
  const variant = useUi((s) => s.reveal);
  const revealAll = useLook((s) => s.revealAll);

  useEffect(() => {
    uniforms.forEach((u, i) => {
      const target = revealAll >= 0 ? revealAll : i === hovered || i === selected ? 1 : 0;
      if (target > u.uReveal.value && i === EXPERIMENTS) u.uWeave.value = 0;
      if (target > u.uReveal.value) u.uHit.value.set(frame.hit.x, frame.hit.y, frame.hit.z).normalize();
      gsap.to(u.uReveal, {
        value: target,
        duration: revealAll >= 0 || reducedMotion() ? 0 : REVEAL_DURATION,
        ease: SITE_EASE,
        overwrite: true,
        onUpdate: requestRender,
      });
      u.uFlow.value = target ? 1.8 : 1;
    });
    requestRender();
  }, [uniforms, hovered, selected, revealAll]);

  useEffect(() => {
    uniforms.forEach((u) => (u.uVariant.value = VARIANT[variant]));
    requestRender();
  }, [uniforms, variant]);

  const life = useMemo(
    () => ({
      nextBlink: 3,
      blinkStart: -1,
      gaze: new THREE.Vector2(),
      saccade: new THREE.Vector2(),
      nextSaccade: 0,
    }),
    [],
  );

  return (time: number, dt: number): boolean => {
    const still = reducedMotion();
    let animating = false;
    uniforms.forEach((u, i) => {
      const shown = u.uReveal.value > 0.001;
      if (!shown) return;
      animating ||= !still;
      if (!still) u.uTime.value += dt;
      if (i === EXPERIMENTS) u.uWeave.value = Math.min(1, u.uWeave.value + dt / 4);
      if (i !== PEOPLE || still) return;
      // Blinks every 3 to 7 s: about 120 ms to close, 180 ms to open.
      if (time > life.nextBlink && life.blinkStart < 0) life.blinkStart = time;
      if (life.blinkStart >= 0) {
        const t = time - life.blinkStart;
        u.uBlink.value = t < 0.12 ? t / 0.12 : Math.max(0, 1 - (t - 0.12) / 0.18);
        if (t > 0.3) {
          life.blinkStart = -1;
          life.nextBlink = time + 3 + Math.random() * 4;
        }
      }
      // Micro-saccades: small jumps around a glance toward the cursor.
      if (time > life.nextSaccade) {
        life.saccade.set((Math.random() - 0.5) * 0.03, (Math.random() - 0.5) * 0.03);
        life.nextSaccade = time + 0.4 + Math.random() * 1.4;
      }
      const c = frame.centres[i]!;
      const toward = new THREE.Vector2(frame.pointer.x - c.x, frame.pointer.y - c.y).multiplyScalar(0.4);
      if (toward.length() > GAZE_REACH) toward.setLength(GAZE_REACH);
      life.gaze.lerp(toward.add(life.saccade), Math.min(1, dt * 12));
      u.uGaze.value.copy(life.gaze);
    });
    return animating || cradle.hand !== null;
  };
}
