"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;
/** Parts already on screen when the page first paints stay put (no flash of hidden text). */
let firstPaint = true;

/**
 * Site-wide scroll motion (PLAN 12.4): Lenis smooth scrolling driven from GSAP's ticker, so
 * ScrollTrigger stays in step, and the old site's text rise: every `.reveal` starts 40px low and
 * transparent and rises in once as it scrolls into view, staggered 0.2 s within a batch.
 */
export function ScrollMotion() {
  const pathname = usePathname();

  useEffect(() => {
    if (reducedMotion()) return;
    // Touch keeps native scrolling (syncTouch off), so the canvas's pan-y and ball capture still work.
    const lenis = new Lenis({ autoRaf: false });
    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
    };
  }, []);

  useLayoutEffect(() => {
    if (reducedMotion()) return;
    const start = innerHeight * 0.85;
    const parts = gsap.utils
      .toArray<HTMLElement>(".reveal")
      .filter((el) => !firstPaint || el.getBoundingClientRect().top > start);
    firstPaint = false;
    gsap.set(parts, { y: 40, opacity: 0 });
    const triggers = ScrollTrigger.batch(parts, {
      start: "top 85%",
      once: true,
      onEnter: (batch) => {
        // A jump (anchor, End key) passes parts that are already above the screen: show those at once.
        const passed = batch.filter((el) => el.getBoundingClientRect().bottom < 0);
        gsap.set(passed, { y: 0, opacity: 1 });
        const entering = batch.filter((el) => !passed.includes(el));
        // 0.2 s apart, but a big batch (a grid of cards) never takes more than 0.8 s to start entering.
        const stagger = Math.min(0.2, 0.8 / entering.length);
        gsap.to(entering, { y: 0, opacity: 1, duration: 1.25, ease: "power4.out", stagger, overwrite: true });
      },
    });
    return () => {
      triggers.forEach((t) => t.kill());
      gsap.set(parts, { clearProps: "transform,opacity" });
    };
  }, [pathname]);

  return null;
}
