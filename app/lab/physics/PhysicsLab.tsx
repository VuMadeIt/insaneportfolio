"use client";

import { useEffect, useRef, useState } from "react";
import { type ConfigOverrides, defaultConfig, withConfig } from "@/physics/config";
import { Cradle } from "@/physics/cradle";
import { vec } from "@/physics/vec";

const deg = (d: number) => (d * Math.PI) / 180;
const HISTORY = 12;
const COLORS = ["#c0392b", "#2c7fb8", "#27ae60", "#8e44ad", "#d35400"];

type Scenario = "one" | "two" | "three" | "slack" | "glide";

interface Params {
  restitution: number;
  hysteresis: number;
  stringLength: number;
  gapMm: number;
  radiusMm: number;
  substeps: number;
  airDensity: number;
  desk: boolean;
}

const initial: Params = {
  restitution: defaultConfig.ball.restitution,
  hysteresis: defaultConfig.hysteresis,
  stringLength: defaultConfig.stringLength,
  gapMm: defaultConfig.gap * 1000,
  radiusMm: defaultConfig.ball.radius * 1000,
  substeps: defaultConfig.substeps,
  airDensity: defaultConfig.airDensity,
  desk: false,
};

/** The recording's geometry (calibrate.ts): a five-ball desk cradle. */
const DESK: ConfigOverrides = { count: 5, stringLength: 0.1, anchorHalfSpread: 0.04, eyeletHeight: 0.003 };

function build(p: Params, scenario: Scenario): Cradle {
  const c = new Cradle(
    withConfig({
      ...(p.desk ? DESK : {}),
      ball: { restitution: p.restitution, radius: (p.desk ? 9.5 : p.radiusMm) / 1000 },
      hysteresis: p.hysteresis,
      ...(p.desk ? {} : { stringLength: p.stringLength }),
      gap: p.gapMm / 1000,
      substeps: p.substeps,
      airDensity: p.airDensity,
    }),
  );
  const lifted = { one: 1, two: 2, three: 3 } as const;
  if (scenario in lifted)
    for (let i = 0; i < lifted[scenario as keyof typeof lifted]; i++) c.lift(i, deg(-30));
  if (scenario === "slack") {
    const mid = c.anchorMid(0);
    const L = c.derived.pendulumLength * 0.6;
    c.place(0, vec(mid.x - L * Math.sin(deg(50)), mid.y - L * Math.cos(deg(50)), 0));
  }
  if (scenario === "glide") c.wake();
  return c;
}

interface Sample {
  t: number;
  angles: number[];
  energy: number;
}

export function PhysicsLab({ recordingOnsets }: { recordingOnsets: number[] }) {
  const [params, setParams] = useState(initial);
  const [scenario, setScenario] = useState<Scenario>("one");
  const [speed, setSpeed] = useState(1);
  const [run, setRun] = useState(0);
  const view = useRef<HTMLCanvasElement>(null);
  const plot = useRef<HTMLCanvasElement>(null);
  const readout = useRef<HTMLPreElement>(null);
  const speedRef = useRef(speed);

  useEffect(() => {
    speedRef.current = speed;
  }, [speed]);

  useEffect(() => {
    const cradle = build(params, scenario);
    const samples: Sample[] = [];
    const impacts: number[] = [];
    let lastImpact = -1;
    let lastSpeed = 0;
    // Glide and drag scenarios start at rest; normalise their energy plot to a 10 deg swing instead.
    const e0 = Math.max(
      cradle.energy(),
      cradle.derived.mass * 9.81 * cradle.derived.pendulumLength * (1 - Math.cos(deg(10))),
    );
    let worstString = 0;
    let glideStart = -1;
    let raf = 0;
    let last = performance.now();
    const canvas = view.current!;
    const ctx = canvas.getContext("2d")!;
    const pctx = plot.current!.getContext("2d")!;
    const L = cradle.derived.pendulumLength;
    const scale = () => Math.min(canvas.width / (2.4 * L), canvas.height / (1.25 * L));
    const toScreen = (x: number, y: number) =>
      [canvas.width / 2 + x * scale(), canvas.height * 0.08 + (L - y) * scale()] as const;
    const toWorld = (sx: number, sy: number) =>
      vec((sx - canvas.width / 2) / scale(), L - (sy - canvas.height * 0.08) / scale(), 0);

    const pointer = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      return toWorld(
        ((e.clientX - r.left) * canvas.width) / r.width,
        ((e.clientY - r.top) * canvas.height) / r.height,
      );
    };
    const down = (e: PointerEvent) => {
      const p = pointer(e);
      const hit = cradle.balls.findIndex(
        (b) => Math.hypot(b.pos.x - p.x, b.pos.y - p.y) < cradle.config.ball.radius * 1.5,
      );
      if (hit < 0) return;
      canvas.setPointerCapture(e.pointerId);
      cradle.grab(hit, p);
    };
    const move = (e: PointerEvent) => cradle.moveHand(pointer(e));
    const up = () => cradle.release();
    canvas.addEventListener("pointerdown", down);
    canvas.addEventListener("pointermove", move);
    canvas.addEventListener("pointerup", up);

    const frame = (now: number) => {
      const dt = Math.min(0.1, (now - last) / 1000) * speedRef.current;
      last = now;
      if (scenario === "glide") {
        if (glideStart < 0) glideStart = cradle.time + 0.5;
        const u = Math.min(1, Math.max(0, (cradle.time - glideStart) / 1.1));
        const ease = 1 - Math.pow(1 - u, 3);
        cradle.balls.forEach((_, i) => cradle.setAnchorOffset(i, vec(-0.3 * ease, 0, 0)));
      }
      const alpha = cradle.advance(dt);
      for (const ev of cradle.drainEvents()) {
        if (ev.time - lastImpact > 0.03) impacts.push(ev.time);
        lastImpact = ev.time;
        lastSpeed = ev.speed;
      }
      worstString = Math.max(worstString, cradle.maxStringError());
      samples.push({
        t: cradle.time,
        angles: cradle.balls.map((_, i) => cradle.angle(i)),
        energy: cradle.energy(),
      });
      while (samples.length && samples[0]!.t < cradle.time - HISTORY) samples.shift();

      // Side view.
      ctx.fillStyle = "#f7f0df";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      cradle.balls.forEach((_, i) => {
        const p = cradle.renderPosition(i, alpha);
        const e = cradle.eyelet(i, p);
        const mid = cradle.anchorMid(i);
        const [ax, ay] = toScreen(mid.x, mid.y);
        const [ex, ey] = toScreen(e.x, e.y);
        const [cx, cy] = toScreen(p.x, p.y);
        ctx.strokeStyle = "#999";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(ax, ay);
        ctx.lineTo(ex, ey);
        ctx.stroke();
        ctx.fillStyle = cradle.hand?.ball === i ? "#444" : "#888";
        ctx.beginPath();
        ctx.arc(cx, cy, cradle.config.ball.radius * scale(), 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = COLORS[i]!;
        ctx.fillRect(cx - 2, cy - 2, 4, 4);
      });

      // Plots: angles (top), energy (bottom), impact ticks vs the recording's onsets.
      const W = pctx.canvas.width;
      const H = pctx.canvas.height;
      pctx.fillStyle = "#fff";
      pctx.fillRect(0, 0, W, H);
      const t0 = cradle.time - HISTORY;
      const tx = (t: number) => ((t - t0) / HISTORY) * W;
      const maxAngle = deg(35);
      cradle.balls.forEach((_, i) => {
        pctx.strokeStyle = COLORS[i]!;
        pctx.beginPath();
        samples.forEach((s, k) => {
          const y = H * 0.3 - (s.angles[i]! / maxAngle) * H * 0.27;
          if (k) pctx.lineTo(tx(s.t), y);
          else pctx.moveTo(tx(s.t), y);
        });
        pctx.stroke();
      });
      pctx.strokeStyle = "#111";
      pctx.beginPath();
      samples.forEach((s, k) => {
        const y = H * 0.85 - (s.energy / e0) * H * 0.25;
        if (k) pctx.lineTo(tx(s.t), y);
        else pctx.moveTo(tx(s.t), y);
      });
      pctx.stroke();
      pctx.fillStyle = "#111";
      for (const t of impacts) if (t > t0) pctx.fillRect(tx(t), H * 0.6, 1, 10);
      if (params.desk && impacts.length) {
        pctx.fillStyle = "#c0392b";
        for (const o of recordingOnsets) {
          const t = impacts[0]! + o - recordingOnsets[0]!;
          if (t > t0 && t < cradle.time) pctx.fillRect(tx(t), H * 0.6 + 12, 1, 10);
        }
      }

      const n = impacts.length;
      readout.current!.textContent = [
        `t ${cradle.time.toFixed(2)} s   ${cradle.asleep ? "asleep" : "awake"}   mass ${cradle.derived.mass.toFixed(3)} kg   L ${(L * 1000).toFixed(1)} mm   T0 ${(2 * Math.PI * Math.sqrt(L / 9.81)).toFixed(3)} s`,
        `E/E0 ${(cradle.energy() / e0).toFixed(4)}   px ${cradle.momentumX().toFixed(4)} kg m/s   worst string stretch ${(worstString * 1000).toFixed(4)} mm`,
        `impacts ${n}   last interval ${n > 1 ? (impacts[n - 1]! - impacts[n - 2]!).toFixed(3) : "-"} s   last speed ${lastSpeed.toFixed(3)} m/s`,
        `angles ${cradle.balls.map((_, i) => ((cradle.angle(i) * 180) / Math.PI).toFixed(2)).join("  ")} deg`,
      ].join("\n");
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", down);
      canvas.removeEventListener("pointermove", move);
      canvas.removeEventListener("pointerup", up);
    };
  }, [params, scenario, run, recordingOnsets]);

  const slider = (key: keyof Params, label: string, min: number, max: number, step: number) => (
    <label className="flex items-center gap-3 text-[14px]">
      <span className="w-40">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={params[key] as number}
        onChange={(e) => setParams({ ...params, [key]: Number(e.target.value) })}
      />
      <span className="w-16 tabular-nums">{params[key] as number}</span>
    </label>
  );

  return (
    <main className="grid min-h-dvh grid-cols-1 gap-6 p-6 lg:grid-cols-[1fr_380px]">
      <div className="flex flex-col gap-4">
        <canvas ref={view} width={1200} height={640} className="w-full touch-none border border-rule" />
        <canvas ref={plot} width={1200} height={360} className="w-full border border-rule" />
        <pre ref={readout} className="text-[13px] leading-snug" />
      </div>
      <aside className="flex flex-col gap-3">
        <h1 className="text-[22px]">Physics lab</h1>
        <p className="text-[14px] text-muted">
          Side view. Drag a ball. Red ticks under the impact ticks are the recording&apos;s onsets (desk
          preset).
        </p>
        <div className="flex flex-wrap gap-2 text-[14px]">
          {(["one", "two", "three", "slack", "glide"] as Scenario[]).map((s) => (
            <button
              key={s}
              onClick={() => (s === scenario ? setRun(run + 1) : setScenario(s))}
              className={`border px-3 py-1 ${s === scenario ? "border-ink" : "border-rule"}`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="flex gap-2 text-[14px]">
          {[1, 0.25, 0.05].map((s) => (
            <button
              key={s}
              onClick={() => setSpeed(s)}
              className={`border px-3 py-1 ${s === speed ? "border-ink" : "border-rule"}`}
            >
              {s}x
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-[14px]">
          <input
            type="checkbox"
            checked={params.desk}
            onChange={(e) => setParams({ ...params, desk: e.target.checked })}
          />
          Desk preset (recording geometry, 5 balls)
        </label>
        {slider("restitution", "restitution", 0.8, 1, 0.005)}
        {slider("hysteresis", "hysteresis (1/s)", 0, 0.3, 0.005)}
        {slider("stringLength", "string length (m)", 0.15, 0.9, 0.01)}
        {slider("gapMm", "gap (mm)", 0, 1, 0.01)}
        {slider("radiusMm", "radius (mm)", 15, 45, 0.5)}
        {slider("substeps", "substeps / step", 1, 60, 1)}
        {slider("airDensity", "air density", 0, 5, 0.1)}
        <button
          onClick={() => setParams(initial)}
          className="self-start border border-rule px-3 py-1 text-[14px]"
        >
          reset to calibrated defaults
        </button>
      </aside>
    </main>
  );
}
