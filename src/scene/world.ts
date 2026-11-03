import { Cradle } from "@/physics/cradle";
import { Rope } from "@/physics/rope";
import { type Vec3, vec } from "@/physics/vec";

const ROPE_SEGMENTS = 20;

/**
 * The single physics world for the whole session. It lives outside React so the cradle keeps its
 * state across route changes and remounts of the canvas.
 */
export const cradle = new Cradle();

/** Render-time state shared by the scene components each frame. */
export const frame = {
  alpha: 0,
  /** Interpolated ball centres and eyelets for this frame. */
  centres: cradle.balls.map(() => vec()),
  eyelets: cradle.balls.map(() => vec()),
};

/** Two visual strings per ball: front then back anchor. */
export const ropes: Rope[] = cradle.balls.flatMap((b, i) =>
  b.anchors.map((a) => new Rope(cradle.config.stringLength, ROPE_SEGMENTS, a, cradle.eyelet(i))),
);

/** Advance physics by one render frame and refresh the interpolated frame state. */
export function tick(dt: number): void {
  frame.alpha = cradle.advance(dt);
  cradle.balls.forEach((_, i) => {
    cradle.renderPosition(i, frame.alpha, frame.centres[i]);
    cradle.eyelet(i, frame.centres[i], frame.eyelets[i]);
  });
}

export const ropeOf = (ball: number, side: 0 | 1) => ropes[ball * 2 + side]!;
export const anchorOf = (ball: number, side: 0 | 1): Vec3 => cradle.balls[ball]!.anchors[side];
