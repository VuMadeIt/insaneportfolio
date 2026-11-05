"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { ObjectItem } from "@/content/about";

/**
 * Selected objects as an editorial spread (PLAN 15.13, after `reference/inspo/editorial-tibetan-
 * culture-layouts.png`): one object open at a time, its photo at a modest size beside its wall
 * text, and every object as a small print in a strip underneath. Choosing a print turns the page:
 * the photo wipes up into place, the text rises in, and a hairline draws in under the chosen
 * print. A tab list for assistive tech and the keyboard (arrows, Home, End).
 * `/about#<id>` opens that object.
 */
export function SelectedObjects({ objects }: { objects: ObjectItem[] }) {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const object = objects[active]!;

  useEffect(() => {
    const open = () => {
      const i = objects.findIndex((o) => `#${o.id}` === location.hash);
      if (i >= 0) setActive(i);
    };
    open();
    addEventListener("hashchange", open);
    return () => removeEventListener("hashchange", open);
  }, [objects]);

  const choose = (i: number, focus = false) => {
    const n = (i + objects.length) % objects.length;
    setActive(n);
    if (focus) tabs.current[n]?.focus();
  };
  const onKey = (e: React.KeyboardEvent) => {
    const move = { ArrowRight: active + 1, ArrowLeft: active - 1, Home: 0, End: objects.length - 1 }[e.key];
    if (move === undefined) return;
    e.preventDefault();
    choose(move, true);
  };
  const number = (i: number) => String(i + 1).padStart(2, "0");

  return (
    <section aria-labelledby="objects-title" className="px-[var(--gutter)] pb-[clamp(96px,14vh,180px)]">
      <div className="flex items-baseline justify-between gap-6">
        <h2 id="objects-title" className="reveal text-[clamp(36px,4.5vw,64px)] leading-[1]">
          Selected objects
        </h2>
        <p className="reveal font-display text-[15px] text-muted" aria-hidden>
          {number(active)} / {number(objects.length - 1)}
        </p>
      </div>

      <div
        id="object-panel"
        role="tabpanel"
        aria-labelledby={`object-tab-${object.id}`}
        className="mt-10 grid gap-8 md:grid-cols-12 md:gap-10"
      >
        <p key={`ctx-${object.id}`} className="obj-rise font-display text-[15px] text-muted md:col-span-2">
          {object.context}
        </p>
        <div key={`text-${object.id}`} className="md:col-span-4 lg:col-span-4 md:col-start-3">
          <h3 className="obj-rise text-[clamp(24px,2.2vw,32px)] leading-[1.15]">{object.title}</h3>
          <p
            className="obj-rise mt-5 max-w-[30em] text-[17px] leading-[1.6]"
            style={{ animationDelay: "90ms" }}
          >
            {object.text}
          </p>
        </div>
        <figure className="md:col-span-6 md:col-start-7 md:justify-self-end">
          <div key={`img-${object.id}`} className="obj-wipe overflow-hidden rounded-md">
            <Image
              src={object.image.src}
              alt={object.image.alt}
              width={object.image.width}
              height={object.image.height}
              sizes="(min-width: 768px) 38vw, 100vw"
              className="obj-photo h-auto max-h-[min(62vh,560px)] w-auto max-w-full"
            />
          </div>
        </figure>
      </div>

      <div className="relative mt-14">
        <div
          role="tablist"
          aria-label="Objects"
          className="obj-strip grid snap-x grid-flow-col gap-3 overflow-x-auto pb-4 md:grid-flow-row md:grid-cols-5 md:gap-4 md:overflow-visible"
          onKeyDown={onKey}
        >
          {objects.map((o, i) => (
            <button
              key={o.id}
              id={`object-tab-${o.id}`}
              ref={(b) => void (tabs.current[i] = b)}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls="object-panel"
              tabIndex={i === active ? 0 : -1}
              className="obj-tab group flex w-[38vw] snap-start flex-col justify-start text-left md:w-auto"
              data-on={i === active ? "" : undefined}
              onClick={() => choose(i)}
            >
              <span className="block aspect-[4/5] overflow-hidden rounded-sm bg-panel">
                <Image
                  src={o.image.src}
                  alt=""
                  width={o.image.width}
                  height={o.image.height}
                  sizes="(min-width: 768px) 18vw, 38vw"
                  className="h-full w-full object-cover transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.04]"
                />
              </span>
              <span className="mt-2 flex justify-between gap-3 font-display text-[14px]">
                <span>{o.context}</span>
                <span className="text-muted">{number(i)}</span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
