import type { Vec3 } from "./vec";

/** One ball: a point-mass rigid body hung from two anchors (bifilar suspension). */
export interface Body {
  pos: Vec3;
  /** Position at the start of the current substep. */
  prev: Vec3;
  /** Position at the start of the current fixed step (for render interpolation). */
  stepStart: Vec3;
  vel: Vec3;
  invMass: number;
  /** Rest positions of the front (z+) and back (z-) anchors. */
  restAnchors: [Vec3, Vec3];
  /** Current anchor positions (rest + kinematic offset). */
  anchors: [Vec3, Vec3];
  /** Kinematic anchor offset at the start and at the end of the current fixed step. */
  offsetFrom: Vec3;
  offsetTo: Vec3;
  /** Anchor velocity during the current step. */
  anchorVel: Vec3;
}
