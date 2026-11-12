"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import type { Stat, Visual as VisualData } from "@/content/caseStudies/types";
import { ExhibitMedia } from "../ExhibitMedia";
import { Anatomy, Bars, Brief, Compare, Podium, Switch, Table } from "./Charts";
import { Diagram } from "./Diagram";
import { useInView } from "./useInView";

/** A number that counts up from zero once on screen; the prefix and suffix ($, %, mL) stay put. */
function Counter({ value }: { value: string }) {
  const [ref, inView] = useInView<HTMLSpanElement>();
  const [, before, num = "0", after] = value.match(/^([^\d]*)([\d.]+)(.*)$/) ?? [];
  const target = Number(num);
  const decimals = num.split(".")[1]?.length ?? 0;
  const [shown, setShown] = useState(target);
  useEffect(() => {
    if (inView === false) setShown(0);
    if (!inView) return;
    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now) {
      const t = Math.min(1, (now - start) / 1400);
      setShown(target * (1 - (1 - t) ** 4));
      if (t < 1) frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [inView, target]);
  if (before === undefined) return <span>{value}</span>;
  return (
    <span ref={ref} aria-label={value} className="tabular-nums">
      <span aria-hidden>
        {before}
        {shown.toFixed(decimals)}
        {after}
      </span>
    </span>
  );
}

function Stats({ stats }: { stats: Stat[] }) {
  return (
    <dl className="grid gap-10 @xl:grid-cols-3">
      {stats.map((s) => (
        <div key={s.value + s.text} className="reveal">
          <dt className="font-display text-[clamp(56px,6vw,88px)] font-[350] leading-none tracking-[-0.03em]">
            <Counter value={s.value} />
          </dt>
          <dd className="mt-3 leading-[1.5]">
            {s.text}{" "}
            {s.href && (
              <a href={s.href} className="u-metal text-muted">
                {s.source}
              </a>
            )}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/** A large sentence whose words rise in one after another. */
function Statement({ text }: { text: string }) {
  const [ref, inView] = useInView<HTMLParagraphElement>();
  return (
    <p
      ref={ref}
      data-in={inView}
      className="statement max-w-[24em] font-display text-[clamp(22px,2.6vw,36px)] font-[350] leading-[1.2] tracking-[-0.02em]"
    >
      {text.split(" ").map((w, i) => (
        <span key={i} style={{ "--i": i } as React.CSSProperties}>
          {w}{" "}
        </span>
      ))}
    </p>
  );
}

function Dots({ total, lit }: { total: number; lit: number }) {
  const [ref, inView] = useInView<HTMLDivElement>();
  return (
    <div ref={ref} data-in={inView} className="dots flex flex-wrap justify-center gap-3" aria-hidden>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={i < lit ? "dot dot-lit" : "dot"}
          style={{ "--i": i < lit ? i : 0 } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/** A third-party embed that loads only on request (the Figma prototype is heavy). */
function Embed({ v }: { v: Extract<VisualData, { kind: "embed" }> }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-ink">
      {open ? (
        <iframe src={v.src} title={v.title} className="absolute inset-0 h-full w-full" allowFullScreen />
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="group absolute inset-0 flex items-center justify-center"
        >
          <Image
            src={v.poster.image!}
            alt=""
            fill
            sizes="(min-width: 1400px) 1400px, 100vw"
            className="object-cover opacity-60"
          />
          <span className="relative rounded-full bg-wall px-6 py-3 text-ink transition-transform duration-300 group-hover:scale-105">
            Open the prototype
          </span>
        </button>
      )}
    </div>
  );
}

export function Visual({ visual }: { visual: VisualData }) {
  switch (visual.kind) {
    case "media":
      return (
        <div className={`grid gap-4 ${visual.media.length > 1 ? "grid-cols-2" : ""}`}>
          {visual.media.map((m) => (
            // Never wider than the file (no upscaling) nor taller than 75% of the screen, centred.
            <div
              key={m.alt}
              className="mx-auto w-full"
              style={{ maxWidth: `min(${m.width}px, calc(75vh * ${m.width / m.height}))` }}
            >
              <ExhibitMedia
                media={m}
                sizes={
                  visual.media.length > 1
                    ? "(min-width: 1400px) 680px, 50vw"
                    : "(min-width: 1400px) 1400px, 100vw"
                }
              />
            </div>
          ))}
        </div>
      );
    case "stats":
      return <Stats stats={visual.stats} />;
    case "quotes":
      return (
        <div
          className={`gap-4 ${visual.quotes.length > 2 ? "columns-1 @lg:columns-2 @4xl:columns-3" : "grid"}`}
        >
          {visual.quotes.map((q) => (
            <figure key={q.text} className="reveal mb-4 break-inside-avoid rounded-md bg-wall p-6">
              <span aria-hidden className="block font-display text-[44px] leading-[0.6] text-[var(--accent)]">
                &ldquo;
              </span>
              <blockquote className="mt-2 font-display text-[clamp(19px,1.6vw,23px)] font-[350] leading-[1.3] tracking-[-0.01em]">
                {q.text}
              </blockquote>
              <figcaption className="mt-3 text-[15px] text-muted">{q.who}</figcaption>
            </figure>
          ))}
        </div>
      );
    case "statement":
      return <Statement text={visual.text} />;
    case "dots":
      return <Dots total={visual.total} lit={visual.lit} />;
    case "diagram":
      return <Diagram data={visual} />;
    case "bars":
      return <Bars v={visual} />;
    case "podium":
      return <Podium v={visual} />;
    case "table":
      return <Table v={visual} />;
    case "brief":
      return <Brief v={visual} />;
    case "anatomy":
      return <Anatomy v={visual} />;
    case "compare":
      return <Compare v={visual} />;
    case "switch":
      return <Switch v={visual} />;
    case "cards":
      return (
        <dl className="grid gap-4 @xl:grid-cols-3">
          {visual.cards.map((c) => (
            <div key={c.title} className="reveal overflow-hidden rounded-md bg-wall">
              {c.image && (
                <Image
                  src={c.image.src}
                  alt={c.image.alt}
                  width={269}
                  height={269}
                  unoptimized
                  className="aspect-[8/5] w-full object-cover object-top"
                />
              )}
              <div className="p-6">
                <dt className="font-display text-[22px] font-[350] tracking-[-0.02em]">{c.title}</dt>
                <dd className="mt-2 text-[16px] leading-[1.5]">{c.body}</dd>
              </div>
            </div>
          ))}
        </dl>
      );
    case "options":
      return (
        <ul className="grid gap-4 @sm:grid-cols-2 @4xl:grid-cols-4">
          {visual.options.map((o) => (
            <li
              key={o.title}
              className={`reveal rounded-md p-6 ${o.chosen ? "bg-ink text-wall" : "bg-wall"}`}
            >
              <h3 className="text-[20px] leading-[1.2]">{o.title}</h3>
              <ul className="mt-4 flex flex-col gap-2 text-[15px] leading-[1.4]">
                {o.pros.map((p) => (
                  <li key={p}>
                    <span aria-label="Pro">+</span> {p}
                  </li>
                ))}
                {o.cons.map((p) => (
                  <li key={p} className="opacity-70">
                    <span aria-label="Con">&minus;</span> {p}
                  </li>
                ))}
              </ul>
              {o.chosen && <p className="mt-4 text-[15px]">The one we built</p>}
            </li>
          ))}
        </ul>
      );
    case "embed":
      return <Embed v={visual} />;
    case "list":
      return (
        <ul className="flex max-w-[44em] flex-col gap-5">
          {visual.items.map((item) => (
            <li key={item} className="reveal flex gap-4 leading-[1.55]">
              <span
                aria-hidden
                className="mt-[0.7em] h-[2px] w-5 shrink-0"
                style={{ background: "var(--metal)" }}
              />
              {item}
            </li>
          ))}
        </ul>
      );
  }
}
