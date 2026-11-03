"use client";

import { useEffect, useState } from "react";

/**
 * Where you are in a case study. On screens wide enough to hold it beside the content (1760px+),
 * Caleb Wu's rail: the story's chapters down the
 * left edge, the current one in ink with a metal marker, each a link. Below that, a floating
 * rounded bar with the chapter's name and a metal progress fill. Blocks are the `.case-block`
 * sections; their `data-group` names the chapter.
 */
export function ProgressBar({ sections }: { sections: { id: string; label: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const blocks = [...document.querySelectorAll<HTMLElement>(".case-block")];
    let frame = 0;
    const update = () => {
      frame = 0;
      const mid = innerHeight * 0.4;
      let active = blocks[0];
      for (const b of blocks) if (b.getBoundingClientRect().top < mid) active = b;
      const first = blocks[0]?.getBoundingClientRect().top ?? 0;
      const end = blocks.at(-1)?.getBoundingClientRect().bottom ?? 0;
      setCurrent(
        Math.max(
          0,
          sections.findIndex((s) => s.label === active?.dataset.group),
        ),
      );
      setShown(first < mid && end > innerHeight * 0.5);
      setProgress(Math.min(1, Math.max(0, (mid - first) / Math.max(1, end - first))));
    };
    const schedule = () => (frame ||= requestAnimationFrame(update));
    update();
    addEventListener("scroll", schedule, { passive: true });
    addEventListener("resize", schedule);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener("scroll", schedule);
      removeEventListener("resize", schedule);
    };
  }, [sections]);

  const motion = "transition-[opacity,transform] duration-500 ease-[var(--ease-out)]";
  return (
    <>
      <nav
        aria-label="Chapters"
        className={`fixed left-[clamp(20px,2.4vw,40px)] top-1/2 z-20 hidden -translate-y-1/2 min-[1760px]:block ${motion}`}
        style={{ opacity: shown ? 1 : 0, pointerEvents: shown ? "auto" : "none" }}
      >
        <ol className="flex flex-col gap-2 text-[15px]">
          {sections.map((s, i) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                aria-current={i === current ? "location" : undefined}
                className={`flex items-center gap-3 transition-colors duration-300 ${i === current ? "text-ink" : "text-muted hover:text-ink"}`}
              >
                <span
                  aria-hidden
                  className="h-[2px] origin-left transition-[width] duration-300"
                  style={{ width: i === current ? 16 : 0, background: "var(--metal)" }}
                />
                {s.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div
        aria-hidden
        className={`fixed bottom-6 left-1/2 z-20 w-[min(360px,calc(100vw-48px))] rounded-md bg-ink px-4 py-3 text-[14px] text-wall min-[1760px]:hidden ${motion}`}
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
    </>
  );
}
