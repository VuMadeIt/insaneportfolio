"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";
import { vec } from "@/physics/vec";
import { frameFor } from "@/scene/framing";
import { afterFrame, capture, cradle, frame, requestRender } from "@/scene/world";

const Stage = dynamic(() => import("@/scene/Stage"), { ssr: false });

/** The canvas is this many times the window and cropped to it: a close-up at full resolution. */
const ZOOM = 2.4;
/** Where the ball hangs in the picture, from the top. */
const BALL_AT = 0.6;
/** Where it hangs in the (landscape) canvas, from the top; the same at any landscape size. */
const BALL_IN_CANVAS = frameFor(1200, 630).ballFromTop;
const BOX: React.CSSProperties = {
  width: `${ZOOM * 100}vw`,
  height: `${ZOOM * 100}vh`,
  left: `${((1 - ZOOM) / 2) * 100}vw`,
  top: `${(BALL_AT - BALL_IN_CANVAS * ZOOM) * 100}vh`,
};

declare global {
  interface Window {
    /** Lift the ball to `deg` and release it from rest. */
    __release?: (deg: number) => void;
    /** Draw one frame (1/30 s of world time); resolves with the ball's x (m). */
    __frame?: () => Promise<number>;
  }
}

/**
 * The share preview's scene (PLAN 15.14): one of the cradle's balls on its own, the other three
 * lifted out of frame, in close-up, swinging wide enough to leave the picture on both sides. Real
 * physics, filmed one frame at a time by scripts/og.mjs so the motion is exact at any capture speed.
 */
export function OgStage() {
  useEffect(() => {
    capture.dt = 1 / 30;
    capture.manual = true;
    const centre = cradle.anchorMid(0).x;
    cradle.balls.forEach((_, i) => cradle.teleportAnchors(i, i === 0 ? vec(-centre, 0, 0) : vec(0, 1.5, 0)));
    window.__release = (deg) => cradle.lift(0, (deg * Math.PI) / 180);
    window.__frame = () =>
      new Promise((done) => {
        const once = () => {
          afterFrame.delete(once);
          done(frame.centres[0]!.x);
        };
        afterFrame.add(once);
        requestRender();
        setTimeout(() => done(Number.NaN), 4000);
      });
    return () => {
      capture.dt = 0;
      capture.manual = false;
    };
  }, []);
  return (
    <div className="fixed inset-0 overflow-hidden bg-wall">
      <div className="absolute" style={BOX}>
        <Stage onFirstFrame={() => document.body.setAttribute("data-ready", "1")} />
      </div>
    </div>
  );
}
