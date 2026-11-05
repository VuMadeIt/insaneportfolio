import { playWhoosh } from "@/audio/clack";
import type { Cradle } from "@/physics/cradle";

/**
 * Slow motion on hover (PLAN 12.7). A time scale multiplies the real frame time fed to the world
 * (physics accumulator, rope sim, identity clocks, clack pitch). The physics never sees it: its
 * fixed step, constants and solver are untouched, so trajectories in simulation time are identical.
 */

export const SLOW = 0.1;
const EASE_IN = 0.3;
const EASE_OUT = 0.8;
/**
 * Real seconds slow motion lasts after the pointer last touched a moving ball (PLAN 13.2). A
 * swinging ball leaves the pointer within a frame or two; this leaves time to follow and click it.
 */
export const HOLD = 1.5;
/** Fastest ball (m/s) below which hovering a swinging cradle does nothing new. */
const TRIGGER_SPEED = 0.05;

export const slowmo = {
  /** Approved by Lucas for production (2026-11-03); tests can switch it off. */
  enabled: true,
  /** Ball under a mouse pointer (never touch or keyboard focus). */
  hover: null as number | null,
  slowing: false,
  /** Real seconds since load, and when the current hold runs out. */
  realTime: 0,
  holdUntil: 0,
  /** 0 at real time, 1 fully slowed. */
  ramp: 0,
  scale: 1,
  /** Scaled seconds since load, for the identity animations. */
  clock: 0,
};

const reducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function wanted(c: Cradle): boolean {
  if (!slowmo.enabled || c.asleep || c.hand || reducedMotion()) return false;
  if (c.balls.some((b) => b.anchorVel.x || b.anchorVel.y || b.anchorVel.z)) return false;
  // Touching a moving ball (or any ball once slowed, even as it stops) starts or extends the hold.
  const moving = c.balls.some((b) => Math.hypot(b.vel.x, b.vel.y, b.vel.z) > TRIGGER_SPEED);
  if (slowmo.hover !== null && (slowmo.slowing || moving)) slowmo.holdUntil = slowmo.realTime + HOLD;
  return slowmo.realTime < slowmo.holdUntil;
}

/** Ease the time scale toward what the pointer asks for and return this frame's scaled step. */
export function advanceClock(realDt: number, c: Cradle): number {
  slowmo.realTime += realDt;
  const want = wanted(c);
  if (want !== slowmo.slowing) {
    slowmo.slowing = want;
    playWhoosh(want ? "down" : "up");
  }
  slowmo.ramp = Math.min(1, Math.max(0, slowmo.ramp + realDt / (want ? EASE_IN : -EASE_OUT)));
  // Smoothstep in log time: the slowdown feels even, like a film ramp rather than a brake.
  const s = slowmo.ramp * slowmo.ramp * (3 - 2 * slowmo.ramp);
  slowmo.scale = SLOW ** s;
  const dt = realDt * slowmo.scale;
  slowmo.clock += dt;
  return dt;
}

/** Back to real time at once (a press on a ball, before any grab or choreography). */
export function restoreTime(): void {
  if (slowmo.slowing) playWhoosh("up");
  slowmo.slowing = false;
  slowmo.holdUntil = 0;
  slowmo.ramp = 0;
  slowmo.scale = 1;
}
