"use client";

import { useThree } from "@react-three/fiber";
import { useEffect } from "react";
import * as THREE from "three";
import { unlockAudio } from "@/audio/clack";
import { useUi } from "@/state/ui";
import { restoreTime, slowmo } from "./slowmo";
import { cradle, frame, requestRender, taps } from "./world";

const HIT_RADIUS = cradle.config.ball.radius * 1.08;

/**
 * Pointer input on the canvas: hover, grab, drag in the swing plane, release (keeping the ball's
 * velocity, so a flick throws it). Only touches that land on a ball are captured; anywhere else
 * the page scrolls as usual.
 */
export function Interaction() {
  const { gl, camera } = useThree();

  useEffect(() => {
    const el = gl.domElement;
    const ray = new THREE.Raycaster();
    const ndc = new THREE.Vector2();
    const centre = new THREE.Vector3();
    const offset = new THREE.Vector3();
    let dragging: number | null = null;
    /** The ball last pressed: slow motion waits until the pointer has left it. */
    let pressedOn: number | null = null;
    // A press that barely moves and ends quickly is a tap, not a drag.
    const press = { x: 0, y: 0, time: 0, ball: null as number | null };
    const isTap = (e: PointerEvent) =>
      Math.hypot(e.clientX - press.x, e.clientY - press.y) < 6 && performance.now() - press.time < 400;

    const aim = (e: { clientX: number; clientY: number }) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
    };
    /** Nearest ball the ray passes through, or null. */
    const sphere = new THREE.Sphere(new THREE.Vector3(), HIT_RADIUS);
    const hitPoint = new THREE.Vector3();
    const scratch = new THREE.Vector3();
    const pick = () => {
      let best: number | null = null;
      let bestT = Infinity;
      frame.centres.forEach((c, i) => {
        sphere.center.set(c.x, c.y, c.z);
        const hit = ray.ray.intersectSphere(sphere, scratch);
        const t = hit ? ray.ray.origin.distanceTo(hit) : Infinity;
        if (t < bestT) {
          [best, bestT] = [i, t];
          hitPoint.copy(scratch);
        }
      });
      return best;
    };
    /** Where the ray meets the swing plane (z = 0). */
    const onPlane = (out: THREE.Vector3) => {
      const { origin, direction } = ray.ray;
      return out
        .copy(direction)
        .multiplyScalar(-origin.z / direction.z)
        .add(origin);
    };
    const target = new THREE.Vector3();

    const down = (e: PointerEvent) => {
      unlockAudio();
      restoreTime();
      aim(e);
      const i = pick();
      pressedOn = i;
      slowmo.hover = null;
      Object.assign(press, { x: e.clientX, y: e.clientY, time: performance.now(), ball: i });
      if (i === null) return;
      e.preventDefault();
      el.setPointerCapture(e.pointerId);
      dragging = i;
      const c = frame.centres[i]!;
      onPlane(offset).sub(centre.set(c.x, c.y, 0));
      cradle.grab(i, onPlane(target).sub(offset));
      el.style.cursor = "grabbing";
      requestRender();
    };
    const move = (e: PointerEvent) => {
      aim(e);
      if (dragging !== null) {
        cradle.moveHand(onPlane(target).sub(offset));
        requestRender();
        return;
      }
      if (e.pointerType !== "mouse") return;
      const i = pick();
      const p = onPlane(target);
      frame.pointer.x = p.x;
      frame.pointer.y = p.y;
      if (i !== null) {
        const c = frame.centres[i]!;
        frame.hit.x = hitPoint.x - c.x;
        frame.hit.y = hitPoint.y - c.y;
        frame.hit.z = hitPoint.z - c.z;
      }
      if (i !== pressedOn) pressedOn = null;
      slowmo.hover = pressedOn === null && useUi.getState().selected === null ? i : null;
      if (useUi.getState().hovered !== i) useUi.getState().setHovered(i);
      el.style.cursor = i === null ? "" : "grab";
    };
    const up = (e: PointerEvent) => {
      if (e.type === "pointerup" && isTap(e)) {
        if (press.ball === null) taps.wall();
        else taps.ball(press.ball, e.pointerType);
      }
      if (dragging === null) return;
      if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
      dragging = null;
      cradle.release();
      el.style.cursor = "grab";
      requestRender();
    };
    // Touch pointers "leave" on every lift; only a mouse leaving the canvas ends a hover.
    const leave = (e: PointerEvent) => {
      slowmo.hover = pressedOn = null;
      if (e.pointerType === "mouse" && dragging === null && useUi.getState().hovered !== null) {
        useUi.getState().setHovered(null);
      }
    };
    // A touch that starts on a ball belongs to the ball, not to page scrolling.
    const touch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      aim(t);
      if (pick() !== null) e.preventDefault();
    };

    el.style.touchAction = "pan-y";
    el.addEventListener("pointerdown", down);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerup", up);
    el.addEventListener("pointercancel", up);
    el.addEventListener("pointerleave", leave);
    el.addEventListener("touchstart", touch, { passive: false });
    return () => {
      el.removeEventListener("pointerdown", down);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerup", up);
      el.removeEventListener("pointercancel", up);
      el.removeEventListener("pointerleave", leave);
      el.removeEventListener("touchstart", touch);
    };
  }, [gl, camera]);

  return null;
}
