import gsap from "gsap";
import { type Vec3, vec } from "@/physics/vec";
import { frameFor } from "./framing";
import { restoreTime } from "./slowmo";
import { cradle, requestRender } from "./world";

/**
 * The click choreography (PLAN 1.3, 4.7). One paused GSAP timeline moves the kinematic anchors
 * and nothing else; the physics simulates the balls hanging from them. The timeline is driven by
 * simulation time through `cradle.beforeStep`, so the motion is identical at any frame rate.
 */

const L = cradle.derived.pendulumLength;
/** Small-angle pendulum period: the glide is shaped against it. */
const PERIOD = 2 * Math.PI * Math.sqrt(L / cradle.config.gravity);
const DIP = -0.045 * L;
/** The rise accelerates until the balls have left the top of any framing... */
const EXIT = 0.45;
/** ...then brakes, off-screen, to where they wait. */
const OUT = 0.75;
const DIP_TIME = 0.16;
const RISE_TIME = 0.85;
/** power3.in ends at 3 * EXIT / RISE_TIME; power2.out starts at 2 * d / t: match them. */
const BRAKE_TIME = (2 * (OUT - EXIT) * RISE_TIME) / (3 * EXIT);
const GLIDE_TIME = 0.45;
const LOWER_TIME = 1.4;

const offsets: Vec3[] = cradle.balls.map(() => vec());
let timeline: gsap.core.Timeline | null = null;
let startedAt = 0;

cradle.beforeStep = (time) => {
  if (!timeline) return;
  timeline.time(time - startedAt);
  offsets.forEach((o, i) => cradle.setAnchorOffset(i, o));
  if (timeline.progress() >= 1) timeline = null;
};

/** Where the selected ball's anchors go: the left third on wide screens, top centre on phones. */
function storyOffset(i: number): Vec3 {
  const { innerWidth: w, innerHeight: h } = window;
  const f = frameFor(w, h);
  const restX = cradle.balls[i]!.restAnchors[0].x;
  if (w / h < 0.9) return vec(-restX, (f.ballFromTop - 0.24) * f.visibleHeight, 0);
  const visibleWidth = (f.visibleHeight * w) / h;
  return vec(-visibleWidth / 6 - restX, 0, 0);
}

function begin(): gsap.core.Timeline {
  restoreTime();
  timeline?.kill();
  startedAt = cradle.time;
  cradle.wake();
  requestRender();
  timeline = gsap.timeline({ paused: true });
  return timeline;
}

/**
 * Zero-vibration input shaping (as on cranes): two half moves half a period apart. The ball lags
 * and swings while its anchor travels, and the second half cancels the swing the first one started,
 * so it arrives hanging still without any damping or scripting of the ball itself.
 */
function shapedGlide(tl: gsap.core.Timeline, o: Vec3, to: Vec3, at: number) {
  const half = { x: (to.x - o.x) / 2, y: (to.y - o.y) / 2 };
  const ease = "power2.inOut";
  tl.to(o, { x: `+=${half.x}`, y: `+=${half.y}`, duration: GLIDE_TIME, ease }, at);
  tl.to(o, { x: `+=${half.x}`, y: `+=${half.y}`, duration: GLIDE_TIME, ease }, at + PERIOD / 2);
}

export function open(selected: number): void {
  if (reducedMotion()) return enter(selected);
  const tl = begin();
  const target = storyOffset(selected);
  // Every anchor phase starts and ends at rest or at matched speed, and never brakes harder than
  // gravity, so the strings stay taut: the motion reads as a curtain, not as balls being thrown.
  offsets.forEach((o, i) => {
    tl.to(o, { y: DIP, duration: DIP_TIME, ease: "sine.inOut" }, 0);
    if (i === selected) tl.to(o, { y: 0, duration: 0.5, ease: "power2.inOut" }, DIP_TIME);
    else {
      tl.to(o, { y: EXIT, x: 0, duration: RISE_TIME, ease: "power3.in" }, DIP_TIME);
      tl.to(o, { y: OUT, duration: BRAKE_TIME, ease: "power2.out" }, DIP_TIME + RISE_TIME);
    }
  });
  shapedGlide(tl, offsets[selected]!, target, DIP_TIME + RISE_TIME * 0.7);
}

export function close(): void {
  if (reducedMotion()) return enter(null);
  const tl = begin();
  offsets.forEach((o, i) => {
    if (o.y >= EXIT * 0.5) tl.to(o, { y: 0, x: 0, duration: LOWER_TIME, ease: "power2.inOut" }, i * 0.06);
    else shapedGlide(tl, o, vec(), 0);
  });
}

/** Jump straight into a state with everything hanging still (deep links, reduced motion). */
export function enter(selected: number | null): void {
  restoreTime();
  timeline?.kill();
  timeline = null;
  cradle.balls.forEach((_, i) => {
    const o = selected === null ? vec() : i === selected ? storyOffset(i) : vec(0, OUT, 0);
    offsets[i]!.x = o.x;
    offsets[i]!.y = o.y;
    cradle.teleportAnchors(i, o);
  });
  cradle.wake();
  requestRender();
}

/** Re-aim the selected ball after a resize, without animation. */
export function reframe(selected: number | null): void {
  if (selected !== null && !timeline) enter(selected);
}

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
