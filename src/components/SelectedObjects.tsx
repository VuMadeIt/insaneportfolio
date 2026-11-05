"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import type { ObjectItem } from "@/content/about";
import { scrollToY } from "./ScrollMotion";

/** Scroll that each object holds the stage for, in viewport heights. */
const STEP = 0.75;

/**
 * Selected objects (PLAN 15.13, 15.15): an editorial spread (after `reference/inspo/editorial-
 * tibetan-culture-layouts.png`) that pins while you scroll through it, one object per stretch of
 * scroll, like a scrollytelling chapter. On the left, a section index in the manner of Caleb Wu's
 * case studies (and Stripe's or Linear's docs): every object by name, the one on stage set a little
 * heavier and in ink, each a link that glides to its object. Changing object wipes the photo up and
 * raises the text. `/about#<id>` lands on that object.
 */
export function SelectedObjects({ objects }: { objects: ObjectItem[] }) {
  const [active, setActive] = useState(0);
  const runway = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const object = objects[active]!;
  const n = objects.length;

  // Scroll per object, measured, so it agrees with the CSS whatever the browser's toolbars do.
  const step = useCallback(() => (runway.current!.offsetHeight - stage.current!.offsetHeight) / n, [n]);
  // Where on the page object `i`'s stretch begins (a little into it, so it is surely on stage).
  const yOf = useCallback(
    (i: number) => runway.current!.getBoundingClientRect().top + scrollY + (i + 0.25) * step(),
    [step],
  );

  useEffect(() => {
    const el = runway.current!;
    const onScroll = () => {
      const travelled = -el.getBoundingClientRect().top;
      const i = Math.min(n - 1, Math.max(0, Math.floor(travelled / step())));
      setActive((a) => (a === i ? a : i));
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", onScroll);
    // A deep link to one object.
    const hash = objects.findIndex((o) => `#${o.id}` === location.hash);
    if (hash >= 0) requestAnimationFrame(() => window.scrollTo({ top: yOf(hash) }));
    return () => {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onScroll);
    };
  }, [n, objects, step, yOf]);

  const number = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section
      ref={runway}
      aria-labelledby="objects-title"
      className="relative px-[var(--gutter)]"
      style={{ height: `calc(100svh + ${n * STEP * 100}svh)` }}
    >
      <div
        ref={stage}
        className="sticky top-0 flex h-svh flex-col pb-[clamp(24px,5vh,56px)] pt-[calc(var(--nav-h)+clamp(16px,4vh,48px))]"
      >
        <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)] gap-6 md:grid-cols-12 md:gap-10">
          <div className="md:col-span-3">
            <h2 id="objects-title" className="text-[clamp(32px,3.6vw,56px)] leading-[1]">
              Selected objects
            </h2>
            <nav aria-label="Objects" className="mt-5 md:mt-10">
              <ol className="obj-index flex flex-wrap gap-x-5 gap-y-2 font-display text-[15px] md:flex-col md:text-[17px]">
                {objects.map((o, i) => (
                  <li key={o.id} className="shrink-0">
                    <a
                      href={`#${o.id}`}
                      aria-current={i === active ? "true" : undefined}
                      data-on={i === active ? "" : undefined}
                      className="obj-link flex items-baseline gap-3"
                      onClick={(e) => {
                        e.preventDefault();
                        history.replaceState(null, "", `#${o.id}`);
                        scrollToY(yOf(i));
                      }}
                    >
                      <span className="hidden text-[13px] md:inline">{number(i)}</span>
                      {o.section}
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          </div>

          <div
            aria-live="polite"
            className="grid min-h-0 grid-cols-[minmax(0,1fr)] gap-6 md:col-span-9 md:grid-cols-9 md:items-start md:gap-10"
          >
            <div key={`text-${object.id}`} className="md:col-span-4 md:pt-2">
              <p className="obj-rise font-display text-[15px] text-muted">
                {object.context}{" "}
                <span aria-hidden>
                  &middot; {number(active)}/{number(n - 1)}
                </span>
              </p>
              <h3 className="obj-rise mt-3 text-[clamp(24px,2.2vw,34px)] leading-[1.15]">{object.title}</h3>
              <p
                className="obj-rise mt-4 max-w-[30em] text-[17px] leading-[1.6]"
                style={{ animationDelay: "90ms" }}
              >
                {object.text}
              </p>
            </div>
            <figure className="min-h-0 md:col-span-5 md:justify-self-end">
              <div key={`img-${object.id}`} className="obj-wipe overflow-hidden rounded-md">
                <Image
                  src={object.image.src}
                  alt={object.image.alt}
                  width={object.image.width}
                  height={object.image.height}
                  sizes="(min-width: 768px) 36vw, 100vw"
                  className="obj-photo h-auto max-h-[38svh] w-auto max-w-full md:max-h-[min(66svh,600px)]"
                />
              </div>
            </figure>
          </div>
        </div>
      </div>
      {/* Anchors for `/about#<id>` without JavaScript. */}
      {objects.map((o, i) => (
        <span
          key={o.id}
          id={o.id}
          aria-hidden
          className="absolute left-0"
          style={{ top: `${(i + 0.25) * STEP * 100}svh` }}
        />
      ))}
    </section>
  );
}
