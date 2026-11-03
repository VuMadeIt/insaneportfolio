"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

/** Top corner lines. In the story state the tagline gives way to a back arrow (Sam-style). */
export function HeroCorners() {
  const story = useStoryOpen();
  return (
    <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[var(--corner-top)] z-10 flex flex-col gap-3 text-[15px] leading-[1.45] sm:flex-row sm:justify-between sm:text-[16px]">
      {story ? (
        <Link
          href="/"
          scroll={false}
          className="pointer-events-auto self-start"
          aria-label="Back to the cradle"
        >
          <span aria-hidden>&larr;</span> <span className="bracket">Back</span>
        </Link>
      ) : (
        <p className="pointer-events-auto max-w-[15em]">I like getting things moving.</p>
      )}
      <p
        className={`pointer-events-auto text-muted sm:text-right sm:text-ink ${story ? "max-sm:hidden" : ""}`}
      >
        Product Designer @ Digital Extremes
        <br />
        Systems Design Engineering @ Waterloo
      </p>
    </div>
  );
}

/** The giant name slides down out of view while a story is open, to open up white space. */
export function HeroName() {
  const story = useStoryOpen();
  return (
    <div
      className="absolute inset-x-0 bottom-[0.02em] transition-transform duration-[900ms] ease-[var(--ease-drawer)]"
      style={{ transform: story ? "translateY(115%)" : "none" }}
    >
      <GiantName />
    </div>
  );
}
