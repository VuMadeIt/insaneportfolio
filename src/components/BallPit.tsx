"use client";

import { useEffect, useRef } from "react";
import { playClack, unlockAudio } from "@/audio/clack";
import { type Box, Pit } from "@/footer-physics/pit";
import { CLICKABLE, nearSolid } from "./near";

/** Footer px/s to the clack's m/s scale (a ball dropped from the top of the footer hits at ~1 m/s). */
const PX_PER_MS = 1400;
const QUIET_BELOW = 160;

/** Tight boxes of the footer's text: each letter of the name from its glyph metrics, every other solid box as its lines. */
function measure(footer: HTMLElement): Box[] {
  const origin = footer.getBoundingClientRect();
  const ctx = document.createElement("canvas").getContext("2d")!;
  const boxes: Box[] = [];
  const add = (left: number, top: number, right: number, bottom: number) =>
    boxes.push({ x: left - origin.left, y: top - origin.top, w: right - left, h: bottom - top });

  for (const el of footer.querySelectorAll<HTMLElement>("[data-solid]")) {
    const style = getComputedStyle(el);
    ctx.font = `${style.fontStyle} ${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
    if (el.dataset.solid === "letters") {
      for (const span of el.querySelectorAll<HTMLElement>("[data-letter]")) {
        const c = span.textContent ?? "";
        if (!c.trim()) continue;
        const r = span.getBoundingClientRect();
        const m = ctx.measureText(c);
        const baseline = r.top + m.fontBoundingBoxAscent;
        // Glyph ink, not the line box: a ball sits on the letter, not on the air above it.
        add(r.left, baseline - m.actualBoundingBoxAscent, r.right, baseline + m.actualBoundingBoxDescent);
      }
      continue;
    }
    const cap = ctx.measureText("H");
    const range = document.createRange();
    range.selectNodeContents(el);
    for (const r of range.getClientRects()) {
      if (r.width < 1) continue;
      const baseline = r.top + cap.fontBoundingBoxAscent;
      add(
        r.left,
        baseline - cap.actualBoundingBoxAscent,
        r.right,
        baseline + cap.actualBoundingBoxAscent * 0.25,
      );
    }
  }
  return boxes;
}

/** A dark-metal ball, lit from the upper left like the cradle's. */
function sprite(r: number, dpr: number): HTMLCanvasElement {
  const c = document.createElement("canvas");
  const size = Math.ceil(r * 2 * dpr);
  c.width = c.height = size;
  const g = c.getContext("2d")!;
  g.scale(dpr, dpr);
  const grad = g.createRadialGradient(r * 0.68, r * 0.56, r * 0.05, r, r, r);
  grad.addColorStop(0, "#a6a5a1");
  grad.addColorStop(0.28, "#57564f");
  grad.addColorStop(0.7, "#2c2b29");
  grad.addColorStop(1, "#161615");
  g.fillStyle = grad;
  g.beginPath();
  g.arc(r, r, r, 0, Math.PI * 2);
  g.fill();
  return c;
}

/**
 * The home footer's live thing (PLAN 13.4): it starts empty; clicking empty space drops a ball
 * that falls, bounces and rolls over the words. Links and text stay clickable and never drop a
 * ball (the same nearness rule hides the cursor's "drop me"). The canvas draws over the text but
 * takes no pointer events; it only runs while the footer is on screen and a ball is moving.
 */
export function BallPit() {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = canvas.current!;
    const footer = cv.parentElement!;
    const ctx = cv.getContext("2d")!;
    const pit = new Pit();
    let dpr = 1;
    let r = 20;
    let image = sprite(r, dpr);
    let raf = 0;
    let last = 0;
    let visible = false;
    let lastSound = 0;

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, pit.width, pit.height);
      for (const b of pit.balls) ctx.drawImage(image, b.x - b.r, b.y - b.r, b.r * 2, b.r * 2);
    };
    const frame = (t: number) => {
      const dt = last ? (t - last) / 1000 : 1 / 60;
      last = t;
      const impacts = pit.step(dt);
      const loudest = impacts.reduce((m, i) => (i.speed > m.speed ? i : m), { speed: 0, x: 0 });
      if (loudest.speed > QUIET_BELOW && t - lastSound > 35) {
        lastSound = t;
        playClack(loudest.speed / PX_PER_MS, (loudest.x / pit.width) * 2 - 1, 0.55);
      }
      draw();
      raf = pit.awake && visible ? requestAnimationFrame(frame) : 0;
      if (!raf) last = 0;
    };
    const run = () => {
      if (!raf && visible) raf = requestAnimationFrame(frame);
    };
    const layout = () => {
      const rect = footer.getBoundingClientRect();
      dpr = Math.min(2, devicePixelRatio || 1);
      cv.width = Math.round(rect.width * dpr);
      cv.height = Math.round(rect.height * dpr);
      r = Math.round(Math.min(26, Math.max(14, rect.width * 0.016)));
      for (const b of pit.balls) b.r = r;
      image = sprite(r, dpr);
      pit.setBounds(rect.width, rect.height);
      pit.setBoxes(measure(footer));
      draw();
      run();
    };

    const down = (e: PointerEvent) => {
      if (
        e.button !== 0 ||
        (e.target as Element).closest(CLICKABLE) ||
        nearSolid(footer, e.clientX, e.clientY)
      )
        return;
      unlockAudio();
      const rect = footer.getBoundingClientRect();
      pit.drop(e.clientX - rect.left, e.clientY - rect.top, r, (Math.random() - 0.5) * 40);
      run();
    };

    // Re-measure on arrival too: anything above that changed height has moved the words.
    const io = new IntersectionObserver(([entry]) => {
      visible = !!entry?.isIntersecting;
      if (visible) layout();
    });
    const ro = new ResizeObserver(layout);
    io.observe(footer);
    ro.observe(footer);
    void document.fonts.ready.then(layout);
    footer.addEventListener("pointerdown", down);
    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      footer.removeEventListener("pointerdown", down);
    };
  }, []);

  return (
    <canvas ref={canvas} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full" />
  );
}
