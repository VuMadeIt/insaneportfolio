import gsap from "gsap";
import { type Vec3, vec } from "@/physics/vec";
import { frameFor } from "./framing";
import { restoreTime } from "./slowmo";
import { cradle, lite, requestRender } from "./world";

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
/**
 * The way in waits just above the frame rather than where a story parks the balls, and comes down
 * quicker, so the balls arrive with the tagline. Peak acceleration 4 * 0.5 / 1.0^2 = 2 m/s^2, well
 * under gravity: the strings stay taut.
 */
const ENTER = EXIT + 0.05;
const ARRIVE_TIME = 1;

const offsets: Vec3[] = cradle.balls.map(() => vec());
let timeline: gsap.core.Timeline | null = null;
let startedAt = 0;

/** Idle sway amplitude at the ball centre (m): just enough to say "touch me". */
const SWAY = 0.003;
const OMEGA2 = cradle.config.gravity / L;
let swaying = false;

/**
 * The idle sway (PLAN 15.11): on the home page the four balls swing together, a few millimetres,
 * like a cradle in a draught. Kept going the way you keep a swing going: when the group has lost
 * about a third of its energy, it gets a nudge as it passes the bottom. All four get the same
 * velocity, so they never touch and never clack. A hand on a ball ends it until the next arrival.
 * Not on touch devices (PLAN 15.18): there the scene stops rendering once the balls hang still.
 */
function sway() {
  if (cradle.hand) {
    swaying = false;
    return;
  }
  let x = 0;
  let v = 0;
  cradle.balls.forEach((b, i) => {
    x += b.pos.x - cradle.anchorMid(i).x;
    v += b.vel.x;
  });
  x /= cradle.balls.length;
  v /= cradle.balls.length;
  const target = 0.5 * OMEGA2 * SWAY * SWAY;
  if (0.5 * v * v + 0.5 * OMEGA2 * x * x > 0.7 * target || Math.abs(x) > 0.25 * SWAY) return;
  const speed = (Math.sign(v) || 1) * Math.sqrt(2 * target - OMEGA2 * x * x);
  cradle.balls.forEach((b, i) => cradle.push(i, speed - b.vel.x));
}

cradle.beforeStep = (time) => {
  if (!timeline) return void (swaying && sway());
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
  swaying = false;
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

export function close(duration = LOWER_TIME): void {
  if (reducedMotion()) return enter(null);
  const tl = begin();
  // Once everything has come down (the sway waits for the timeline to finish).
  swaying = !lite;
  offsets.forEach((o, i) => {
    if (o.y >= EXIT * 0.5) tl.to(o, { y: 0, x: 0, duration, ease: "power2.inOut" }, i * 0.06);
    else shapedGlide(tl, o, vec(), 0);
  });
}

/**
 * The way in (PLAN 15.6): every ball waits above the frame, hanging still, then all are lowered as
 * when a story closes. Runs on simulation time, so it starts when the scene first steps.
 */
export function intro(): void {
  if (reducedMotion()) return enter(null);
  timeline?.kill();
  timeline = null;
  cradle.release();
  offsets.forEach((o, i) => {
    o.x = 0;
    o.y = ENTER;
    cradle.teleportAnchors(i, o);
    cradle.lift(i, 0);
  });
  close(ARRIVE_TIME);
}

/** Jump straight into a state with everything hanging still (deep links, reduced motion). */
export function enter(selected: number | null): void {
  restoreTime();
  timeline?.kill();
  timeline = null;
  swaying = selected === null && !reducedMotion() && !lite;
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
