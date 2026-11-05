"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Project, hrefOf, monthOf } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";

const previewMedia = (p: Project) =>
  p.media.hover ? { ...p.media, video: p.media.hover, poster: p.media.image } : p.media;

/**
 * The project list (PLAN 13.3, 14.6): the prize object and title, the description (opened by the
 * prize on /work), the month and year, nothing else.
 * Every row opens something: the case study, else its Devpost, live site or an email. On desktop
 * the row's video follows the pointer and is the cursor while over the row; it shows on pointer
 * hover only (never on focus after a click, which left it stuck). Keyboard focus shows it beside
 * the row. Phones and tablets get the video inline.
 */
export function WorkList({
  projects,
  level = "h2",
  large = false,
}: {
  projects: Project[];
  level?: "h2" | "h3";
  /** Home shows three projects at poster size, without the prize objects (PLAN 15.5). */
  large?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);
  const layer = useRef<HTMLDivElement>(null);
  const to = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (active === null) return;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { ...to.current };
    let raf = 0;
    const tick = () => {
      const k = reduced ? 1 : 0.18;
      pos.x += (to.current.x - pos.x) * k;
      pos.y += (to.current.y - pos.y) * k;
      if (layer.current) layer.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    // Leaving for another tab (an external link opened) must never leave the preview behind.
    const clear = () => setActive(null);
    addEventListener("blur", clear);
    return () => {
      cancelAnimationFrame(raf);
      removeEventListener("blur", clear);
    };
  }, [active]);

  const follow = (e: React.PointerEvent) => {
    to.current = { x: e.clientX, y: e.clientY };
  };

  return (
    <>
      <ul className="catalogue">
        {projects.map((p, i) => {
          const href = hrefOf(p)!;
          const external = href.startsWith("http");
          const H = level;
          const title = <H>{p.title}</H>;
          const linkProps = {
            className: "after:absolute after:inset-0",
            onFocus: (e: React.FocusEvent<HTMLAnchorElement>) => {
              if (!e.currentTarget.matches(":focus-visible")) return;
              const r = e.currentTarget.closest("li")!.getBoundingClientRect();
              to.current = { x: r.right - 260, y: r.top + r.height / 2 };
              setActive(i);
            },
            onBlur: () => setActive(null),
          };
          return (
            <li
              key={p.slug}
              data-cursor="hide"
              className={`catalogue-row reveal group relative ${large ? "py-[clamp(28px,4.5vh,48px)]" : "py-7 md:py-8"}`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                to.current = { x: e.clientX, y: e.clientY };
                setActive(i);
              }}
              onPointerMove={follow}
              onPointerLeave={() => setActive(null)}
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_9em] md:gap-10">
                <div
                  className={`flex items-start gap-[0.2em] ${large ? "text-[clamp(44px,6.4vw,104px)] leading-[0.95]" : "text-[clamp(30px,3.6vw,52px)] leading-[1]"}`}
                >
                  {p.prize && !large && (
                    <Image
                      src={`/media/objects/${p.prize.object}.webp`}
                      alt=""
                      width={480}
                      height={480}
                      sizes="104px"
                      className="size-[1em] shrink-0 object-contain"
                    />
                  )}
                  {p.caseStudy ? (
                    <Link href={href} {...linkProps}>
                      {title}
                    </Link>
                  ) : (
                    <a
                      href={href}
                      {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
                      {...linkProps}
                    >
                      {title}
                    </a>
                  )}
                </div>
                <p
                  className={`max-w-[34em] leading-[1.5] ${large ? "self-end text-[clamp(18px,1.5vw,22px)]" : "text-[17px]"}`}
                >
                  {!large && p.prize && `${p.prize.text} `}
                  {p.description}
                </p>
                <p className={`text-[15px] text-muted md:text-right ${large ? "md:self-end" : ""}`}>
                  {monthOf(p.date)}
                </p>
              </div>
              <div className="mt-6 lg:hidden">
                <ExhibitMedia media={previewMedia(p)} sizes="100vw" />
              </div>
            </li>
          );
        })}
      </ul>
      <div ref={layer} aria-hidden className="pointer-events-none fixed left-0 top-0 z-50 hidden lg:block">
        {projects.map((p, i) => (
          <div
            key={p.slug}
            className="work-preview absolute w-[clamp(300px,24vw,380px)]"
            data-on={active === i ? "" : undefined}
          >
            <ExhibitMedia media={previewMedia(p)} sizes="380px" play={active === i} />
          </div>
        ))}
      </div>
    </>
  );
}
