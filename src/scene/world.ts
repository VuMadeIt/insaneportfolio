import { Cradle } from "@/physics/cradle";
import type { CollisionEvent } from "@/physics/events";
import { Rope } from "@/physics/rope";
import { type Vec3, vec } from "@/physics/vec";

const ROPE_SEGMENTS = 20;

/**
 * The single physics world for the whole session. It lives outside React so the cradle keeps its
 * state across route changes and remounts of the canvas.
 */
export const cradle = new Cradle();

/** Render-time state shared by the scene and the DOM layer each frame. */
export const frame = {
  alpha: 0,
  /** Interpolated ball centres and eyelets for this frame. */
  centres: cradle.balls.map(() => vec()),
  eyelets: cradle.balls.map(() => vec()),
  /** Impacts during this frame. */
  events: [] as CollisionEvent[],
  /** Ball centres and radii projected to CSS pixels in the canvas, for the DOM buttons. */
  screen: cradle.balls.map(() => ({ x: 0, y: 0, r: 0 })),
  /** Pointer on the swing plane (world, m), and the hover point's direction from the hovered ball. */
  pointer: vec(0, 0, 1),
  hit: vec(0, 0, 1),
};

/** Two visual strings per ball: front then back anchor. */
export const ropes: Rope[] = cradle.balls.flatMap((b, i) =>
  b.anchors.map((a) => new Rope(cradle.config.stringLength, ROPE_SEGMENTS, a, cradle.eyelet(i))),
);

/** Advance physics by one render frame and refresh the interpolated frame state. */
export function tick(dt: number): void {
  frame.alpha = cradle.advance(dt);
  frame.events = cradle.drainEvents();
  cradle.balls.forEach((_, i) => {
    cradle.renderPosition(i, frame.alpha, frame.centres[i]);
    cradle.eyelet(i, frame.centres[i], frame.eyelets[i]);
  });
}

export const ropeOf = (ball: number, side: 0 | 1) => ropes[ball * 2 + side]!;
export const anchorOf = (ball: number, side: 0 | 1): Vec3 => cradle.balls[ball]!.anchors[side];

/** Called after every rendered frame (the DOM layer positions its buttons from `frame.screen`). */
export const afterFrame = new Set<() => void>();

/** Taps on the canvas, handled by the interface layer (StoryController). */
export const taps: { ball: (ball: number, pointerType: string) => void; wall: () => void } = {
  ball: () => {},
  wall: () => {},
};

/**
 * Frame-by-frame capture (scripts/og.mjs): every rendered frame advances the world by exactly
 * `dt` seconds, and frames are only drawn when asked for. Off (0 / false) on the site.
 */
export const capture = { dt: 0, manual: false };

/** The canvas renders on demand; anything that changes the world from outside calls this. */
let invalidate: () => void = () => {};
export const setInvalidate = (fn: () => void) => void (invalidate = fn);
export const requestRender = () => invalidate();
