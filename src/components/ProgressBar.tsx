"use client";

import { useEffect, useState } from "react";

/**
 * The floating reading-progress bar of a case study: a rounded bar with a metal fill, the current
 * section's label and how far through the story you are. Sections are found by `data-section`.
 */
export function ProgressBar({ sections }: { sections: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const update = () => {
      const els = sections.map((s) => document.getElementById(s.id));
      const mid = innerHeight * 0.4;
      let k = 0;
      els.forEach((el, i) => {
        if (el && el.getBoundingClientRect().top < mid) k = i;
      });
      const first = els[0]?.getBoundingClientRect().top ?? 0;
      const last = els.at(-1);
      const end = last ? last.getBoundingClientRect().bottom : 0;
      setCurrent(k);
      setShown(first < mid && end > innerHeight * 0.5);
      setProgress(Math.min(1, Math.max(0, (mid - first) / Math.max(1, end - first))));
    };
    update();
    addEventListener("scroll", update, { passive: true });
    addEventListener("resize", update);
    return () => {
      removeEventListener("scroll", update);
      removeEventListener("resize", update);
    };
  }, [sections]);

  return (
    <div
      aria-hidden
      className="fixed bottom-6 left-1/2 z-20 w-[min(360px,calc(100vw-48px))] -translate-x-1/2 rounded-md bg-ink px-4 py-3 text-[14px] text-wall transition-[opacity,transform] duration-500 ease-[var(--ease-out)]"
      style={{ opacity: shown ? 1 : 0, transform: `translate(-50%, ${shown ? 0 : 12}px)` }}
    >
      <div className="flex justify-between gap-4">
        <span>{sections[current]?.label}</span>
        <span className="tabular-nums opacity-70">
          {current + 1} / {sections.length}
        </span>
      </div>
      <div className="mt-2 h-[3px] overflow-hidden rounded-full bg-wall/20">
        <div
          className="h-full origin-left"
          style={{ transform: `scaleX(${progress})`, background: "var(--metal)" }}
        />
      </div>
    </div>
  );
}
