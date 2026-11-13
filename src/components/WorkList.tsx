"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { type Project, hrefOf, monthOf } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";

/** The home rows' padding (py below) less 14 px: how far their video reaches past the text. */
const INTO_PADDING = "calc(14px - clamp(28px, 4.5vh, 48px))";

const previewMedia = (p: Project) =>
  p.media.hover ? { ...p.media, video: p.media.hover, poster: p.media.image } : p.media;

/**
 * The project list (PLAN 13.3, 14.6, 15.18): the prize object and title with the month and year
 * under it, the description (opened by the prize on /work), nothing else.
 * Every row opens something: the case study, else its Devpost, live site or an email. On /work's
 * desktop the row's video follows the pointer and is the cursor while over the row; it shows on
 * pointer hover only (never on focus after a click, which left it stuck). Keyboard focus shows it
 * beside the row. The home rows instead play their video in the row itself, as high as the row's
 * text, while on screen. Phones and tablets get the video inline under the row.
 */
export function WorkList({
  projects,
  level = "h2",
  large = false,
}: {
  projects: Project[];
  level?: "h2" | "h3";
  /** Home shows three projects at poster size, without the prize objects, videos in the row (PLAN 15.5, 15.18). */
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
              if (large || !e.currentTarget.matches(":focus-visible")) return;
              const r = e.currentTarget.closest("li")!.getBoundingClientRect();
              to.current = { x: r.right - 260, y: r.top + r.height / 2 };
              setActive(i);
            },
            onBlur: () => setActive(null),
          };
          return (
            <li
              key={p.slug}
              className={`catalogue-row reveal group relative ${large ? "py-[clamp(28px,4.5vh,48px)]" : "py-7 md:py-8"}`}
              {...(large
                ? {}
                : {
                    "data-cursor": "hide",
                    onPointerEnter: (e: React.PointerEvent) => {
                      if (e.pointerType !== "mouse") return;
                      to.current = { x: e.clientX, y: e.clientY };
                      setActive(i);
                    },
                    onPointerMove: follow,
                    onPointerLeave: () => setActive(null),
                  })}
            >
              <div
                className={`grid gap-3 md:gap-10 ${large ? "md:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)_clamp(200px,22vw,340px)]" : "md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]"}`}
              >
                <div
                  className={`flex items-start gap-[0.2em] ${large ? "@container" : "text-[clamp(30px,3.6vw,52px)] leading-[1]"}`}
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
                  {/* Home titles size to their column: "Passion Nails", the longest, fills 93% of it on one line. */}
                  <div
                    className={
                      large
                        ? "w-full whitespace-nowrap text-[clamp(36px,17cqi,92px)] leading-[0.95]"
                        : undefined
                    }
                  >
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
                    <p className="mt-3 text-[15px] leading-[1.4] text-muted">{monthOf(p.date)}</p>
                  </div>
                </div>
                <p
                  className={`max-w-[34em] leading-[1.5] ${large ? "self-end text-[clamp(18px,1.5vw,22px)]" : "text-[17px]"}`}
                >
                  {!large && p.prize && `${p.prize.text} `}
                  {p.description}
                </p>
                {large && (
                  // The row's height, into its padding but 14 px short of the rules: the row never
                  // grows for it, and the video keeps its own proportions.
                  <div className="relative max-md:hidden">
                    <div
                      className="absolute right-0 max-w-full overflow-hidden rounded-md"
                      style={{
                        aspectRatio: `${p.media.width} / ${p.media.height}`,
                        inset: `${INTO_PADDING} 0 ${INTO_PADDING} auto`,
                      }}
                    >
                      <ExhibitMedia media={previewMedia(p)} sizes="340px" cover />
                    </div>
                  </div>
                )}
              </div>
              <div className={`mt-6 ${large ? "md:hidden" : "lg:hidden"}`}>
                <ExhibitMedia media={previewMedia(p)} sizes="100vw" />
              </div>
            </li>
          );
        })}
      </ul>
      {!large && (
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
      )}
    </>
  );
}
