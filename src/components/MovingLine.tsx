"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { playClack } from "@/audio/clack";
import { defaultConfig } from "@/physics/config";

const LINE = "Let's get things moving.";
const G = 9.81;
/** A steel ball landing on a hard floor keeps about this much of its speed. */
const RESTITUTION = 0.55;
/** Below this impact speed (m/s) the ball has settled. */
const REST = 0.12;

/** Each word rises out of its own mask; the "o" of "moving" is left for the ball. */
const WORDS = ["Let's", "get", "things"];

/**
 * "Let's get things moving." (PLAN 14.5): the words rise in from below, then one of the cradle's
 * balls drops from the top of the screen into the "o" of "moving" and bounces to rest with a clack
 * on every landing. Real gravity at the ball's real size (a 65 mm ball, scaled to the type). It
 * shines on hover and cannot be dragged. Reduced motion: everything is already in place.
 */
export function MovingLine({ id, className = "" }: { id?: string; className?: string }) {
  const root = useRef<HTMLHeadingElement>(null);
  const ball = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = root.current!;
    const b = ball.current!;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    // Already on screen when the page opens: leave it in place.
    if (el.getBoundingClientRect().top < innerHeight * 0.75) return;
    el.dataset.armed = "";
    let raf = 0;
    let wait = 0;
    const drop = () => {
      el.dataset.in = "";
      const rect = b.getBoundingClientRect();
      const pxPerM = rect.width / (defaultConfig.ball.radius * 2);
      const pan = ((rect.left + rect.width / 2) / innerWidth) * 2 - 1;
      // Start just above the top of the screen, so it falls in from outside.
      let y = -(rect.bottom + 8);
      let v = 0;
      let last = 0;
      b.style.transform = `translateY(${y}px)`;
      const step = (t: number) => {
        const dt = last ? Math.min(0.034, (t - last) / 1000) : 0;
        last = t;
        for (let k = 0; k < 8; k++) {
          const h = dt / 8;
          v += G * pxPerM * h;
          y += v * h;
          if (y < 0) continue;
          y = 0;
          const speed = v / pxPerM;
          if (speed < REST) {
            b.style.transform = "";
            return;
          }
          playClack(speed, pan, 0.8);
          v = -RESTITUTION * v;
        }
        b.style.transform = `translateY(${y}px)`;
        raf = requestAnimationFrame(step);
      };
      // The words rise first; the ball comes once they are nearly up.
      wait = window.setTimeout(() => (raf = requestAnimationFrame(step)), 650);
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        io.disconnect();
        drop();
      },
      { rootMargin: "0px 0px -30% 0px" },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      clearTimeout(wait);
      cancelAnimationFrame(raf);
    };
  }, []);

  const mask = (text: string, i: number) => (
    <span className="moving-mask" style={{ "--i": i } as React.CSSProperties}>
      <span>{text}</span>
    </span>
  );
  return (
    <h2 ref={root} id={id} className={`moving-line ${className}`}>
      <span className="sr-only">{LINE}</span>
      <span aria-hidden>
        {WORDS.map((w, i) => (
          <span key={w}>{mask(w, i)} </span>
        ))}
        <span className="whitespace-nowrap">
          {mask("m", 3)}
          <span className="moving-o">
            <span ref={ball} className="moving-ball">
              <Image src="/media/objects/ball.webp" alt="" width={480} height={480} draggable={false} />
            </span>
          </span>
          {mask("ving.", 4)}
        </span>
      </span>
    </h2>
  );
}
