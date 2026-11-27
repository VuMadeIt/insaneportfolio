"use client";

import { useLayoutEffect, useRef, useState } from "react";

type Option = { key: string; label: string; lang?: string };

/** Pill tabs whose dark fill slides to the chosen option instead of jumping. */
export function Segmented({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label: string;
  options: Option[];
  value: string;
  onChange: (key: string) => void;
  className?: string;
}) {
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const [box, setBox] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const at = options.findIndex((o) => o.key === value);

  useLayoutEffect(() => {
    const measure = () => {
      const b = refs.current[at];
      if (b) setBox({ x: b.offsetLeft, y: b.offsetTop, w: b.offsetWidth, h: b.offsetHeight });
    };
    measure();
    const ro = new ResizeObserver(measure);
    refs.current.forEach((b) => b && ro.observe(b));
    return () => ro.disconnect();
  }, [at]);

  return (
    <div
      role="group"
      aria-label={label}
      className={`relative mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-[26px] bg-wall p-1 ${className}`}
    >
      {box && (
        <span
          aria-hidden
          className="absolute top-0 left-0 rounded-full bg-ink transition-[transform,width,height] duration-300 ease-[var(--ease-out)] motion-reduce:transition-none"
          style={{ width: box.w, height: box.h, transform: `translate(${box.x}px, ${box.y}px)` }}
        />
      )}
      {options.map((o, i) => (
        <button
          key={o.key}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="button"
          lang={o.lang}
          aria-pressed={i === at}
          onClick={() => onChange(o.key)}
          className={`relative rounded-full px-5 py-2.5 text-[15px] transition-colors duration-300 ease-[var(--ease-out)] ${i === at ? `text-wall ${box ? "" : "bg-ink"}` : "hover:bg-white"}`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
