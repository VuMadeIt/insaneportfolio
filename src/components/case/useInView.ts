"use client";

import { useEffect, useRef, useState } from "react";

export const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * Whether a drawn visual should show its finished state. `null` until mounted (server render, no
 * JavaScript, or already on screen at mount): the finished drawing. Below the fold it turns
 * `false`, then `true` once the visual comes well into view, which plays the drawing.
 */
export function useInView<T extends Element>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState<boolean | null>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || reducedMotion() || el.getBoundingClientRect().top < innerHeight) return;
    setInView(false);
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e?.isIntersecting) return;
        setInView(true);
        io.disconnect();
      },
      { rootMargin: "0px 0px -20% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView] as const;
}
