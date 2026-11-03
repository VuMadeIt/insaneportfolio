"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";
import { useLayoutEffect, useRef } from "react";
import { chronology } from "@/content/about";

gsap.registerPlugin(ScrollTrigger);

/**
 * The chronology as a horizontal track. On desktop the section pins and scrolling down slides the
 * track left while a metal line fills along it and each stop rises in as it arrives. On phones,
 * and under reduced motion, it is a plain sideways-scrolling row that snaps to each stop.
 */
export function Timeline() {
  const pin = useRef<HTMLDivElement>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLOListElement>(null);

  useLayoutEffect(() => {
    const mm = gsap.matchMedia(pin.current!);
    mm.add("(min-width: 768px) and (prefers-reduced-motion: no-preference)", () => {
      const t = track.current!;
      // The page scroll drives the track now, so the row stops scrolling sideways on its own.
      scroller.current!.style.overflowX = "visible";
      const distance = () => Math.max(0, t.scrollWidth - innerWidth);
      const scroll = { trigger: pin.current, start: "top top", end: () => `+=${distance()}`, scrub: 0.6 };
      const slide = gsap.to(t, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: { ...scroll, pin: true, invalidateOnRefresh: true },
      });
      gsap.fromTo(".timeline-fill", { scaleX: 0 }, { scaleX: 1, ease: "none", scrollTrigger: scroll });
      gsap.utils.toArray<HTMLElement>(".timeline-stop").forEach((stop) =>
        gsap.from(stop, {
          y: 36,
          opacity: 0.25,
          duration: 0.9,
          ease: "power4.out",
          scrollTrigger: {
            trigger: stop,
            containerAnimation: slide,
            start: "left 88%",
            toggleActions: "play none none reverse",
          },
        }),
      );
    });
    return () => mm.revert();
  }, []);

  return (
    <section aria-labelledby="chronology-title" className="pb-[clamp(96px,14vh,180px)]">
      <div ref={pin} className="overflow-hidden md:flex md:h-[100svh] md:flex-col md:justify-center">
        <div className="flex items-baseline justify-between px-[var(--gutter)]">
          <h2 id="chronology-title" className="text-[clamp(36px,4.5vw,64px)] leading-[1]">
            Chronology
          </h2>
          <p aria-hidden className="text-[15px] text-muted">
            scroll <span className="inline-block">&rarr;</span>
          </p>
        </div>
        <div ref={scroller} className="mt-[clamp(40px,8vh,96px)] overflow-x-auto pb-4">
          <ol
            ref={track}
            className="relative flex w-max snap-x snap-mandatory px-[var(--gutter)]"
            style={{ "--logo": "clamp(72px, 6.5vw, 104px)" } as React.CSSProperties}
          >
            <span aria-hidden className="absolute inset-x-0 top-[calc(var(--logo)+28px)] h-[2px] bg-rule" />
            <span
              aria-hidden
              className="timeline-fill absolute inset-x-0 top-[calc(var(--logo)+28px)] h-[2px] origin-left"
              style={{ background: "var(--metal)" }}
            />
            {chronology.map((c) => (
              <li
                key={c.role + c.place}
                className="timeline-stop relative w-[clamp(260px,26vw,380px)] shrink-0 snap-start pr-[clamp(24px,3vw,48px)]"
              >
                <span
                  className={`flex size-[var(--logo)] items-center justify-center overflow-hidden rounded-lg border border-rule ${c.dark ? "bg-night p-2" : "bg-white p-3"}`}
                >
                  <Image
                    src={`/media/logos/${c.logo}.png`}
                    alt=""
                    width={128}
                    height={128}
                    className="h-full w-full object-contain"
                  />
                </span>
                <span
                  aria-hidden
                  className="timeline-knob metal-ball absolute top-[calc(var(--logo)+29px)] left-0 -translate-y-1/2"
                />
                <p className="mt-[56px] text-[15px] text-muted tabular-nums">{c.when}</p>
                <h3 className="mt-2 text-[clamp(22px,2vw,30px)] leading-[1.15]">{c.role}</h3>
                <p className="mt-1 text-[16px]">{c.place}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
