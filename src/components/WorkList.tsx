"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Project, hrefOf, monthOf } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";

const previewMedia = (p: Project) =>
  p.media.hover ? { ...p.media, video: p.media.hover, poster: p.media.image } : p.media;

/**
 * The project list (PLAN 13.3): title and accolades, the description, the month, nothing else.
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
  /** Home shows two projects, so they are set at poster size. */
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
          const title = (
            <H
              className={`${large ? "text-[clamp(48px,7.6vw,128px)] leading-[0.92]" : "text-[clamp(30px,3.6vw,52px)] leading-[1]"}`}
            >
              {p.title}
            </H>
          );
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
              className={`catalogue-row reveal group relative ${large ? "py-[clamp(40px,7vh,80px)]" : "py-8 md:py-10"}`}
              onPointerEnter={(e) => {
                if (e.pointerType !== "mouse") return;
                to.current = { x: e.clientX, y: e.clientY };
                setActive(i);
              }}
              onPointerMove={follow}
              onPointerLeave={() => setActive(null)}
            >
              <div className="grid gap-3 md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_7em] md:gap-10">
                <div>
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
                  {p.accolades && (
                    <ul
                      className={`mt-4 flex flex-col gap-1.5 leading-[1.35] ${large ? "text-[17px]" : "text-[15px]"}`}
                    >
                      {p.accolades.map((a) => (
                        <li key={a} className="flex items-baseline gap-2.5">
                          <span aria-hidden className="award-dot" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                <p
                  className={`max-w-[34em] leading-[1.5] ${large ? "self-end text-[clamp(18px,1.5vw,22px)]" : "text-[17px]"}`}
                >
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
