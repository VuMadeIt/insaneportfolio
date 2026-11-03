import Link from "next/link";
import { featured } from "@/content/projects";
import { ExhibitMedia } from "./ExhibitMedia";
import { WallLabel } from "./WallLabel";

/**
 * The featured work as full-screen exhibits that stack: each is sticky and the next one slides up
 * over it (the cathyyin.ca mechanic, nothing else from it). The covered exhibit dims slightly,
 * driven by the next one's scroll position (CSS scroll-driven animation; static where unsupported).
 */
export function WorkStack() {
  return (
    <section
      aria-labelledby="work-title"
      className="relative"
      style={{ timelineScope: featured.map((_, i) => `--exhibit-${i}`).join(", ") } as React.CSSProperties}
    >
      <div className="px-[var(--gutter)] pb-[clamp(48px,8vh,96px)] pt-[clamp(120px,18vh,200px)]">
        <h2 id="work-title" className="reveal text-[clamp(48px,7vw,112px)] leading-[0.95]">
          Selected work
        </h2>
        <p className="reveal mt-6 max-w-[30em] text-[17px]">
          Four exhibits: two concepts, an internship that shipped, and the job I cannot show you yet.
        </p>
      </div>
      {featured.map((p, i) => (
        <article
          key={p.slug}
          aria-labelledby={`exhibit-${p.slug}`}
          className="exhibit sticky top-0 flex min-h-dvh flex-col justify-center bg-wall px-[var(--gutter)] py-[clamp(72px,10vh,120px)]"
          style={
            { viewTimelineName: `--exhibit-${i}`, "--next": `--exhibit-${i + 1}` } as React.CSSProperties
          }
        >
          <div className="grid items-end gap-8 md:grid-cols-[minmax(0,1fr)_minmax(220px,300px)] md:gap-12">
            <Link href={`/work/${p.slug}`} className="group block" tabIndex={-1} aria-hidden>
              {p.media ? (
                <div className="overflow-hidden rounded-md">
                  <div className="transition-transform duration-700 ease-[var(--ease-out)] group-hover:scale-[1.015]">
                    <ExhibitMedia media={p.media} sizes="(min-width: 768px) 65vw, 100vw" />
                  </div>
                </div>
              ) : (
                <div className="flex aspect-[16/9] w-full items-center justify-center rounded-md bg-[#e9e6df]">
                  <p className="font-display text-[clamp(20px,2vw,28px)] text-muted">
                    Currently under wraps.
                  </p>
                </div>
              )}
            </Link>
            <div>
              <WallLabel project={p} />
              <p className="mt-5 max-w-[24em] text-[16px] leading-[1.5]">{p.description}</p>
              <Link
                href={`/work/${p.slug}`}
                className="link-arrow mt-6 inline-block text-[16px]"
                id={`exhibit-${p.slug}`}
              >
                {p.slug === "warframe" ? "Ask me about it" : "View case study"}{" "}
                <span aria-hidden>&rarr;</span>
              </Link>
            </div>
          </div>
        </article>
      ))}
      <div className="relative z-10 bg-wall px-[var(--gutter)] py-[clamp(96px,14vh,160px)]">
        <Link href="/work" className="link-arrow text-[clamp(24px,2.4vw,34px)]">
          View all work <span aria-hidden>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}
