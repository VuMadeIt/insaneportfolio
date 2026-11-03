import type { Vec3 } from "./vec";

/** A ball-ball impact, emitted for sound and for the visual string wobble. */
export interface CollisionEvent {
  /** Simulation time of the impact (s). */
  time: number;
  a: number;
  b: number;
  /** Relative normal speed just before the impact (m/s). */
  speed: number;
  /** Contact point (m). */
  point: Vec3;
}
