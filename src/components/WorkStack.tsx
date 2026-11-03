"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { type Project, featured } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";

/** How far each pinned card sits below the one before, so the earlier cards peek out as a pile. */
const PEEK = 14;
/** Each card covering this one shrinks it by this much and dims it by DIM. */
const SHRINK = 0.04;
const DIM = 0.28;

const pad = (n: number) => String(n).padStart(2, "0");

function Card({ p, i }: { p: Project; i: number }) {
  const hover = useRef<HTMLVideoElement>(null);
  const play = (on: boolean) => {
    const v = hover.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (on) void v.play().catch(() => {});
    else v.pause();
    v.style.opacity = on ? "1" : "0";
  };
  const body = (
    <>
      {p.media && <ExhibitMedia media={p.media} sizes="100vw" cover />}
      {p.media?.hover && (
        <video
          ref={hover}
          src={p.media.hover}
          poster={p.media.image}
          muted
          loop
          playsInline
          preload="none"
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-200"
        />
      )}
      {/* A neutral shade under the words, and the dimming as the next card covers this one. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 via-30% to-transparent to-60%"
      />
      <div aria-hidden className="absolute inset-0 bg-linear-to-b from-black/35 to-transparent to-25%" />
      <div aria-hidden className="absolute inset-0 bg-ink" style={{ opacity: "var(--dim, 0)" }} />
      <div className="absolute inset-x-0 top-0 flex justify-between p-[clamp(16px,2vw,28px)] text-[15px] text-white">
        <span className="tabular-nums">
          {pad(i + 1)} / {pad(featured.length)}
        </span>
        <span>{p.caseStudy ? p.medium.toLowerCase() : "coming soon"}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-[clamp(16px,2.4vw,40px)] text-white">
        <h3
          id={`card-${p.slug}`}
          className="text-[clamp(44px,7vw,112px)] leading-[0.95] transition-transform duration-700 ease-[var(--ease-out)] group-hover:-translate-y-1"
        >
          {p.title}
        </h3>
        <p className="mt-3 max-w-[36em] leading-[1.4] text-white/85">{p.caption}</p>
      </div>
    </>
  );
  const cls =
    "group relative block h-full origin-top overflow-hidden rounded-lg bg-[#1d1d1b] will-change-transform";
  return (
    <li
      className="sticky h-[var(--card-h)] [&:not(:last-child)]:mb-[var(--card-hold)]"
      style={{ top: `calc(var(--card-inset) + ${i * PEEK}px)` }}
    >
      {p.caseStudy ? (
        <Link href={`/work/${p.slug}`} aria-labelledby={`card-${p.slug}`} className={cls}>
          {body}
        </Link>
      ) : (
        <div
          className={cls}
          onMouseEnter={() => play(true)}
          onMouseLeave={() => play(false)}
          aria-labelledby={`card-${p.slug}`}
          role="group"
        >
          {body}
        </div>
      )}
    </li>
  );
}

/**
 * The featured work as a Folio Stack: full-bleed rounded cards that pin near the top; as the next
 * one slides over, the earlier ones step back (shrink a little and dim) with a sliver of their top
 * edge left showing, so the stack reads as a pile. Sticky CSS does the pinning; one scroll handler
 * sets the scale and dimming. Reduced motion keeps the stack without either.
 */
export function WorkStack() {
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const items = [...list.current!.children] as HTMLElement[];
    let frame = 0;
    const update = () => {
      frame = 0;
      const H = innerHeight;
      // How far each card has slid over the one before it (0 entering at the bottom, 1 pinned).
      // The hold (a margin under each card) is scrolled before the next one appears, so it is not
      // part of the covering.
      const cover = items.map((li) => {
        const pin = parseFloat(getComputedStyle(li).top);
        return Math.min(1, Math.max(0, (H - li.getBoundingClientRect().top) / (H - pin)));
      });
      items.forEach((li, i) => {
        const depth = cover.slice(i + 1).reduce((a, b) => a + b, 0);
        const card = li.firstElementChild as HTMLElement;
        card.style.transform = depth ? `scale(${1 - SHRINK * depth})` : "";
        card.style.setProperty("--dim", String(Math.min(0.6, DIM * depth)));
      });
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
  }, []);

  return (
    <section id="work" aria-labelledby="work-title" className="relative pt-[var(--card-inset)]">
      <h2 id="work-title" className="sr-only">
        Selected work
      </h2>
      <ol
        ref={list}
        className="px-[var(--card-inset)] after:block after:h-[var(--card-hold)] after:content-['']"
      >
        {featured.map((p, i) => (
          <Card key={p.slug} p={p} i={i} />
        ))}
      </ol>
      <div className="relative z-10 bg-wall px-[var(--gutter)] py-[clamp(96px,14vh,160px)]">
        <Link href="/work" className="link-arrow text-[clamp(24px,2.4vw,34px)]">
          View all work <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
