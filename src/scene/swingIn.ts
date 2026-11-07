/**
 * How People swings in on arrival (PLAN 15.19). The ball must start beyond the left edge, `distance`
 * metres before the point where it meets its neighbour, and meet it at `hit` m/s on every screen.
 * A pendulum let go at `angle` meets it at sqrt(2gL(1 - cos angle)). Where the screen is too wide
 * for that swing alone to start off it, the anchor glides in at a constant `speed`, unseen above
 * the frame, and stops as the ball passes the bottom: the ball swings freely in the gliding frame,
 * and arrives with the glide's speed added to its swing's.
 */
export interface SwingIn {
  /** Angle the ball is let go at, behind its anchor (rad). */
  angle: number;
  /** Anchor glide speed (m/s). */
  speed: number;
  /** From letting go to the hit (s). */
  duration: number;
}

/** Time for an ideal pendulum to swing from `angle` down to the bottom: a quarter period (s). */
export function fallTime(angle: number, length: number, gravity: number): number {
  // Quarter period = K(sin(angle / 2)) sqrt(L / g), with K from the arithmetic-geometric mean.
  let a = 1;
  let b = Math.cos(angle / 2);
  for (let i = 0; i < 8; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return (Math.PI / (2 * a)) * Math.sqrt(length / gravity);
}

export function planSwingIn(distance: number, hit: number, length: number, gravity: number): SwingIn {
  const swing = (angle: number) => Math.sqrt(2 * gravity * length * (1 - Math.cos(angle)));
  const time = (angle: number) => fallTime(angle, length, gravity);
  // Horizontal distance covered from letting go to the hit; shrinks as the swing takes over.
  const reach = (angle: number) => (hit - swing(angle)) * time(angle) + length * Math.sin(angle);
  const top = Math.acos(1 - (hit * hit) / (2 * gravity * length));
  if (reach(top) >= distance) return { angle: top, speed: 0, duration: time(top) };
  if (reach(0) <= distance) return { angle: 0, speed: hit, duration: distance / hit };
  let lo = 0;
  let hi = top;
  for (let i = 0; i < 40; i++) {
    const mid = (lo + hi) / 2;
    if (reach(mid) > distance) lo = mid;
    else hi = mid;
  }
  return { angle: lo, speed: hit - swing(lo), duration: time(lo) };
}

/** The anchor's x offset from its rest, `t` seconds after the ball is let go. */
export const glideAt = (plan: SwingIn, t: number) => -plan.speed * Math.max(0, plan.duration - t);
