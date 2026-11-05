import type { CollisionEvent } from "@/physics/events";
import sprite from "./clacks.json";
import whooshes from "./whoosh.json";

/** Impacts closer together than this are one clack: a chain sounds as a single hit. */
const CHAIN_WINDOW = 0.006;
/** Below this relative speed (m/s) an impact is inaudible. */
const SILENT_BELOW = 0.015;
/** Impact speed that plays at full sample level (m/s); a 30 degree release hits at about 1.15. */
const FULL_SPEED = 1.4;
/** Hertz contact: peak force, and so peak pressure, grows as v^1.2 (see scripts/physics/calibrate.ts). */
const HERTZ = 1.2;
const MASTER = 0.55;
/** Slow motion pitches the clacks down with time, but never so far that they stop sounding like steel. */
const MIN_RATE = 0.45;
// Lucas: a third quieter than the first cut (0.8).
const WHOOSH_GAIN = 0.53;

let ctx: AudioContext | null = null;
let buffer: AudioBuffer | null = null;
let whooshBuffer: AudioBuffer | null = null;
let master: GainNode | null = null;
let loading: Promise<void> | null = null;
let lastClack = -Infinity;
/** The nav's sound button (PLAN 13.1); remembered in localStorage, read on first use. */
let muted: boolean | null = null;
const listeners = new Set<() => void>();

export const isMuted = (): boolean =>
  (muted ??= typeof localStorage !== "undefined" && localStorage.getItem("sound") === "off");
export function setMuted(value: boolean): void {
  muted = value;
  localStorage.setItem("sound", value ? "off" : "on");
  if (master) master.gain.value = value ? 0 : MASTER;
  listeners.forEach((l) => l());
}
export function subscribeMuted(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/** Create the audio context on the first user gesture and load the sample sprite. */
export function unlockAudio(): void {
  if (ctx) {
    if (ctx.state === "suspended" && !document.hidden) void ctx.resume();
    return;
  }
  ctx = new AudioContext();
  master = ctx.createGain();
  master.gain.value = isMuted() ? 0 : MASTER;
  master.connect(ctx.destination);
  const ext = new Audio().canPlayType('audio/webm; codecs="opus"') ? "webm" : "mp3";
  const load = (name: string) =>
    fetch(`/audio/${name}.${ext}`)
      .then((r) => r.arrayBuffer())
      .then((data) => ctx!.decodeAudioData(data))
      .catch(() => null);
  loading = load("clacks").then((decoded) => void (buffer = decoded));
  void load("whoosh").then((decoded) => void (whooshBuffer = decoded));
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) void ctx?.suspend();
    else void ctx?.resume();
  });
}

export const audioReady = () => loading;

/**
 * Group one frame's impacts into clacks. Impacts within a few milliseconds of each other (one
 * chain) become a single clack at the loudest impact's speed, placed where it happened. `last` is
 * the time of the previous impact, so a chain split across two frames still plays once.
 */
export function chainClacks(events: CollisionEvent[], last: number) {
  const clacks: { speed: number; x: number }[] = [];
  const sorted = [...events].sort((a, b) => a.time - b.time);
  let group: CollisionEvent[] = [];
  const flush = () => {
    if (!group.length) return;
    const loudest = group.reduce((a, b) => (b.speed > a.speed ? b : a));
    if (group[0]!.time - last > CHAIN_WINDOW) clacks.push({ speed: loudest.speed, x: loudest.point.x });
    last = group[group.length - 1]!.time;
    group = [];
  };
  for (const e of sorted) {
    if (group.length && e.time - group[group.length - 1]!.time > CHAIN_WINDOW) flush();
    group.push(e);
  }
  flush();
  return { clacks, last };
}

/** Play one frame's impacts as clacks; `timeScale` < 1 is slow motion. */
export function playImpacts(events: CollisionEvent[], timeScale = 1): void {
  if (!events.length) return;
  const result = chainClacks(events, lastClack);
  lastClack = result.last;
  if (!ctx || !buffer || !master || isMuted() || ctx.state !== "running") return;
  for (const c of result.clacks) clack(c.speed, c.x, Math.max(MIN_RATE, timeScale));
}

/** The slow-motion whoosh: "down" as time slows, "up" (the same sound reversed) as it returns. */
export function playWhoosh(kind: "down" | "up"): void {
  if (!ctx || !whooshBuffer || !master || isMuted() || ctx.state !== "running") return;
  const clip = whooshes[kind];
  const source = ctx.createBufferSource();
  source.buffer = whooshBuffer;
  const gain = ctx.createGain();
  gain.gain.value = WHOOSH_GAIN;
  source.connect(gain).connect(master);
  source.start(0, clip.start, clip.duration);
}

/** One clack from outside the cradle (the ball in "moving"); `pan` -1..1, `gain` scales the level. */
export function playClack(speed: number, pan = 0, gain = 1): void {
  if (!ctx || !buffer || !master || isMuted() || ctx.state !== "running") return;
  clack(speed, pan * 0.3 * 2, 1, gain);
}

function clack(speed: number, x: number, rate: number, gainScale = 1): void {
  if (speed < SILENT_BELOW || !ctx || !buffer || !master) return;
  const level = Math.min(1, Math.pow(speed / FULL_SPEED, HERTZ));
  const clip = sprite.clips[Math.floor(Math.random() * sprite.clips.length)]!;
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.playbackRate.value = rate * (1 + (Math.random() * 2 - 1) * 0.03);
  // Soft hits sound duller: open the filter with impact speed.
  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 3500 + 14500 * Math.min(1, speed / FULL_SPEED);
  const gain = ctx.createGain();
  gain.gain.value = level * gainScale;
  const pan = ctx.createStereoPanner();
  pan.pan.value = Math.max(-1, Math.min(1, x / 0.3)) * 0.5;
  source.connect(filter).connect(gain).connect(pan).connect(master);
  source.start(0, clip.start, clip.duration);
}
