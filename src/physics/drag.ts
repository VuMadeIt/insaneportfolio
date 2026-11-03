import type { Body } from "./body";
import { type Vec3, clone, copy } from "./vec";

/** The pointer "hand": a soft spring-damper from one ball to a target point in the swing plane. */
export interface Hand {
  ball: number;
  /** Target at the end of the current fixed step. */
  target: Vec3;
  /** Target at the start of the current fixed step. */
  from: Vec3;
  /** Interpolated target for the current substep. */
  current: Vec3;
  /** Previous substep's interpolated target (for the damping term). */
  last: Vec3;
}

export const createHand = (ball: number, target: Vec3): Hand => ({
  ball,
  target: clone(target),
  from: clone(target),
  current: clone(target),
  last: clone(target),
});

/** Keep the hand's target within `maxAngle` of straight down from the anchor midpoint. */
export function clampTarget(out: Vec3, target: Vec3, mid: Vec3, maxAngle: number): Vec3 {
  copy(out, target);
  out.z = mid.z;
  const dx = target.x - mid.x;
  const dy = target.y - mid.y;
  const angle = Math.atan2(dx, -dy);
  if (Math.abs(angle) > maxAngle) {
    const r = Math.hypot(dx, dy);
    out.x = mid.x + r * Math.sin(maxAngle) * Math.sign(angle);
    out.y = mid.y - r * Math.cos(maxAngle);
  }
  return out;
}

/**
 * XPBD zero-rest-length constraint with damping (Macklin et al. 2016, eq. 26), one iteration per
 * substep. Equivalent to an implicit spring of stiffness k and damper c, so it is stable at any
 * stiffness and the strings (solved afterwards as hard constraints) always win.
 */
export function solveHand(body: Body, hand: Hand, h: number, stiffness: number, damping: number): void {
  const w = body.invMass;
  const alphaTilde = 1 / (stiffness * h * h);
  const gamma = damping / (stiffness * h);
  const denom = (1 + gamma) * w + alphaTilde;
  const p = body.pos;
  const q = body.prev;
  const t = hand.current;
  const l = hand.last;
  p.x += (w * (-(p.x - t.x) - gamma * (p.x - q.x - (t.x - l.x)))) / denom;
  p.y += (w * (-(p.y - t.y) - gamma * (p.y - q.y - (t.y - l.y)))) / denom;
  p.z += (w * (-(p.z - t.z) - gamma * (p.z - q.z - (t.z - l.z)))) / denom;
}
