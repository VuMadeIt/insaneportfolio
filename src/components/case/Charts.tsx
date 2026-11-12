"use client";

import Image from "next/image";
import { useState } from "react";
import type { Visual } from "@/content/caseStudies/types";
import { useInView } from "./useInView";

type Of<K extends Visual["kind"]> = Extract<Visual, { kind: K }>;

const fill = { accent: "bg-[var(--accent)]", ink: "bg-ink", soft: "bg-[var(--accent-soft)]" } as const;

/**
 * Horizontal bars, drawn in once on screen. A log scale for numbers that span orders of magnitude
 * (water per prompt estimates differ by 100x), linear otherwise. A range is drawn low to high.
 */
export function Bars({ v }: { v: Of<"bars"> }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const pos = (n: number) =>
    v.scale === "log"
      ? (Math.log10(n) - Math.log10(v.min)) / (Math.log10(v.max) - Math.log10(v.min))
      : (n - v.min) / (v.max - v.min);
  const pct = (n: number) => `${Math.min(100, Math.max(0, pos(n) * 100))}%`;
  return (
    <div ref={ref} data-in={inView} className="bars">
      <ul className="flex flex-col gap-6">
        {v.bars.map((b, i) => {
          const [lo, hi] = Array.isArray(b.value) ? b.value : [v.min, b.value];
          return (
            <li
              key={b.label}
              className="grid gap-2 @xl:grid-cols-[minmax(0,15em)_minmax(0,1fr)] @xl:items-center @xl:gap-8"
            >
              <div>
                <p className="text-[16px] leading-[1.3]">{b.label}</p>
                {(b.sub || b.source) && (
                  <p className="mt-0.5 text-[14px] leading-[1.35] text-muted">
                    {b.sub}
                    {b.sub && b.source ? ". " : ""}
                    {b.href ? (
                      <a href={b.href} className="u-metal">
                        {b.source}
                      </a>
                    ) : (
                      b.source
                    )}
                  </p>
                )}
              </div>
              <div className="relative flex h-9 items-center">
                <span className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 rounded-full bg-rule" />
                <span
                  className={`bar-fill absolute top-0 h-full rounded-full ${fill[b.tone ?? "accent"]}`}
                  style={
                    { left: pct(lo), width: `calc(${pct(hi)} - ${pct(lo)})`, "--i": i } as React.CSSProperties
                  }
                />
                <span
                  className={`bar-value absolute whitespace-nowrap font-display text-[18px] font-[350] tracking-[-0.02em] tabular-nums ${
                    pos(hi) > 0.7
                      ? `-translate-x-full pr-4 ${b.tone === "soft" ? "text-ink" : "text-white"}`
                      : "pl-3"
                  }`}
                  style={{ left: pct(hi), "--i": i } as React.CSSProperties}
                >
                  {b.display}
                </span>
              </div>
            </li>
          );
        })}
      </ul>
      <div className="relative mt-4 h-5 @xl:ml-[calc(15em+2rem)]">
        {v.ticks.map((t) => (
          <span
            key={t}
            className="absolute -translate-x-1/2 whitespace-nowrap text-[13px] text-muted tabular-nums"
            style={{ left: pct(t) }}
          >
            {t}
            {t === v.ticks.at(-1) ? ` ${v.unit}` : ""}
          </span>
        ))}
      </div>
    </div>
  );
}

/** The placement on a podium (second, first, third), ours in the product's colour. */
export function Podium({ v }: { v: Of<"podium"> }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  const steps = [
    { place: 2, h: 62 },
    { place: 1, h: 100 },
    { place: 3, h: 40 },
  ];
  const ord = ["", "1st", "2nd", "3rd"];
  return (
    <div ref={ref} data-in={inView} className="podium mx-auto flex max-w-[640px] flex-col items-center">
      <div className="flex w-full items-end justify-center gap-3">
        {steps.map((s, i) => (
          <div key={s.place} className="flex flex-1 flex-col items-center gap-3">
            {s.place === v.place && (
              <p className="font-display text-[clamp(20px,2vw,28px)] font-[350] tracking-[-0.02em]">
                {v.name}
              </p>
            )}
            <div
              className={`podium-step flex w-full items-start justify-center rounded-t-md pt-4 font-display text-[clamp(22px,2.4vw,34px)] font-[350] ${s.place === v.place ? "bg-[var(--accent)] text-white" : "bg-white text-muted"}`}
              style={{ height: `${s.h * 2}px`, "--i": i } as React.CSSProperties}
            >
              {ord[s.place]}
            </div>
          </div>
        ))}
      </div>
      {v.extra && (
        <ul className="mt-6 flex flex-wrap justify-center gap-2">
          {v.extra.map((x) => (
            <li key={x} className="rounded-full bg-ink px-4 py-1.5 text-[15px] text-wall">
              {x}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const Check = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-label="Yes" role="img">
    <circle cx="9" cy="9" r="9" fill="var(--accent)" />
    <path
      d="m5 9.2 2.6 2.6L13 6.4"
      fill="none"
      stroke="white"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Dash = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-label="No" role="img">
    <path d="M5 9h8" stroke="#a8a49b" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

/**
 * A real table (allowed its lines): products down the side, what they do across the top. Narrow
 * screens get the same facts as one short list per product, so nothing scrolls sideways.
 */
export function Table({ v }: { v: Of<"table"> }) {
  const cell = (c: boolean | string) => (c === true ? <Check /> : c === false ? <Dash /> : c);
  return (
    <>
      <ul className="flex flex-col gap-3 text-[15px] @3xl:hidden">
        {v.rows.map((r) => (
          <li key={r.label} className={`rounded-sm p-4 ${r.ours ? "bg-white" : "bg-wall"}`}>
            <p className="font-display text-[17px]">{r.label}</p>
            <dl className="mt-2 grid grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1.5">
              {v.columns.map((c, i) => (
                <div key={c} className="contents">
                  <dt className="text-muted">{c}</dt>
                  <dd className="justify-self-end">{cell(r.cells[i]!)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
      <table className="hidden w-full border-collapse text-left text-[15px] @3xl:table">
        <thead>
          <tr>
            <th className="w-[22%] pb-4" />
            {v.columns.map((c) => (
              <th key={c} scope="col" className="pb-4 pr-4 align-bottom font-normal leading-[1.3] text-muted">
                {c}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {v.rows.map((r) => (
            <tr key={r.label} className={r.ours ? "bg-white" : ""}>
              <th scope="row" className={`rounded-l-sm py-3.5 pl-4 pr-4 ${r.ours ? "" : "table-rule"}`}>
                {r.label}
              </th>
              {r.cells.map((c, i) => (
                <td
                  key={i}
                  className={`py-3.5 pr-4 ${i === r.cells.length - 1 ? "rounded-r-sm" : ""} ${r.ours ? "" : "table-rule"}`}
                >
                  {cell(c)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

/** The event's own question, quoted large, and the facts of the event beneath it. */
export function Brief({ v }: { v: Of<"brief"> }) {
  return (
    <figure>
      <blockquote className="max-w-[26em] font-display text-[clamp(22px,2.4vw,34px)] font-[350] leading-[1.22] tracking-[-0.02em]">
        &ldquo;{v.prompt}&rdquo;
      </blockquote>
      {v.source && <figcaption className="mt-3 text-[15px] text-muted">{v.source}</figcaption>}
      <dl className="mt-10 grid gap-x-8 gap-y-5 @sm:grid-cols-2 @3xl:grid-cols-4">
        {v.facts.map((f) => (
          <div key={f.label} className="rounded-sm bg-wall px-5 py-4">
            <dt className="text-[14px] text-muted">{f.label}</dt>
            <dd className="mt-1 text-[17px] leading-[1.35]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}

/** A screen with numbered callouts; hovering a line of the legend lights its marker. */
export function Anatomy({ v }: { v: Of<"anatomy"> }) {
  const [on, setOn] = useState<number | null>(null);
  return (
    <div className="grid items-center gap-10 @xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1fr)]">
      <div
        className="relative mx-auto w-full"
        style={{ maxWidth: `min(${v.image.width}px, calc(70vh * ${v.image.width / v.image.height}))` }}
      >
        <Image
          src={v.image.src}
          alt={v.image.alt}
          width={v.image.width}
          height={v.image.height}
          sizes="(min-width: 768px) 40vw, 100vw"
          className="h-auto w-full"
        />
        {v.points.map((p, i) => (
          <span
            key={p.title}
            aria-hidden
            className={`absolute flex size-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-[var(--accent)] text-[14px] text-white ring-4 transition-transform duration-300 ${on === i ? "scale-125 ring-[var(--accent-soft)]" : "ring-white/70"}`}
            style={{ left: `${p.x}%`, top: `${p.y}%` }}
          >
            {i + 1}
          </span>
        ))}
      </div>
      <ol className="flex flex-col gap-6">
        {v.points.map((p, i) => (
          <li
            key={p.title}
            className="flex gap-4"
            onPointerEnter={() => setOn(i)}
            onPointerLeave={() => setOn(null)}
          >
            <span
              aria-hidden
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-[14px] text-white"
            >
              {i + 1}
            </span>
            <div>
              <h3 className="text-[19px] leading-[1.25]">{p.title}</h3>
              <p className="mt-1 text-[16px] leading-[1.5]">{p.text}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

/** Phone screens in two or three states; the switch cross-fades them in place, so nothing jumps. */
export function Switch({ v }: { v: Of<"switch"> }) {
  const [on, setOn] = useState(0);
  return (
    <div>
      <div
        role="group"
        aria-label={v.label}
        className="mx-auto flex w-fit flex-wrap justify-center gap-1 rounded-[26px] bg-wall p-1"
      >
        {v.options.map((o, i) => (
          <button
            key={o.label}
            type="button"
            aria-pressed={on === i}
            onClick={() => setOn(i)}
            className={`rounded-full px-5 py-2.5 text-[15px] transition-colors duration-300 ${on === i ? "bg-ink text-wall" : "hover:bg-white"}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      <div className="mt-8 grid">
        {v.options.map((o, i) => (
          <div
            key={o.label}
            aria-hidden={on !== i}
            className={`flex justify-center gap-[clamp(12px,3cqi,40px)] transition-[opacity,transform] duration-500 ease-[var(--ease-out)] [grid-area:1/1] ${on === i ? "" : "pointer-events-none translate-y-2 opacity-0"}`}
          >
            {o.images.map((m) => (
              <Image
                key={m.src}
                src={m.src}
                alt={m.alt}
                width={m.width}
                height={m.height}
                sizes="(min-width: 768px) 340px, 45vw"
                className="h-auto min-w-0 rounded-[clamp(12px,2.4cqi,28px)]"
                style={{
                  width: `min(340px, calc((100cqi - ${o.images.length - 1} * clamp(12px, 3cqi, 40px)) / ${o.images.length}))`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <p
        aria-live="polite"
        className="mx-auto mt-6 max-w-[34em] text-center text-[15px] leading-[1.5] text-muted"
      >
        {v.options[on]!.note}
      </p>
    </div>
  );
}

/** Two or three columns side by side: before and after, or one approach against another. */
export function Compare({ v }: { v: Of<"compare"> }) {
  const tone = { accent: "bg-[var(--accent)] text-white", ink: "bg-ink text-wall", plain: "bg-wall" };
  return (
    <div className={`grid gap-4 ${v.columns.length === 3 ? "@3xl:grid-cols-3" : "@lg:grid-cols-2"}`}>
      {v.columns.map((c) => (
        <div key={c.title} className={`reveal rounded-sm p-6 ${tone[c.tone ?? "plain"]}`}>
          <h3 className="text-[20px] leading-[1.2]">{c.title}</h3>
          <ul className="mt-4 flex flex-col gap-2.5 text-[16px] leading-[1.45]">
            {c.items.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
