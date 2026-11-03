"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";
import { NavLinks } from "./SiteNav";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

/**
 * The hero's corners (Lucas's mock): three status lines top left, the links-only nav top right,
 * and the vertical tagline with its scroll line down the right edge. In the story state the status
 * lines give way to a back arrow and the tagline steps aside for the wall text.
 */
export function HeroCorners() {
  const story = useStoryOpen();
  return (
    <>
      <div className="pointer-events-none absolute inset-x-[var(--gutter)] top-[var(--corner-top)] z-10 flex flex-col-reverse gap-6 sm:flex-row sm:items-start sm:justify-between">
        {story ? (
          <Link
            href="/"
            scroll={false}
            aria-label="Back to the cradle"
            className="u-grow pointer-events-auto self-start text-[16px]"
          >
            <span aria-hidden>&larr;</span> back
          </Link>
        ) : (
          <p className="pointer-events-auto text-[15px] font-semibold leading-[1.35] sm:text-[16px]">
            systems design eng @ uwaterloo
            <br />
            product designer @ warframe
            <br />
            current product design lead of hack canada
          </p>
        )}
        <nav aria-label="Site" className="nav-in pointer-events-auto self-end sm:self-auto">
          <NavLinks />
        </nav>
      </div>
      <div
        className={`hero-tagline pointer-events-none absolute right-[calc(var(--gutter)-0.4em)] z-10 flex flex-col items-center gap-6 transition-opacity duration-500 ${story ? "opacity-0" : ""}`}
      >
        <p className="font-display text-[16px] font-medium tracking-[-0.01em] [writing-mode:vertical-rl] sm:text-[18px]">
          the person who gets things <em>moving</em>
        </p>
        <span aria-hidden className="relative block h-10 w-[1.5px] overflow-hidden">
          <span className="scroll-line absolute inset-0" style={{ background: "var(--metal-v)" }} />
        </span>
      </div>
    </>
  );
}

/** The giant name slides down out of view while a story is open, to open up white space. */
export function HeroName() {
  const story = useStoryOpen();
  return (
    <div
      className="absolute inset-x-0 bottom-0 transition-transform duration-[900ms] ease-[var(--ease-drawer)]"
      style={{ transform: story ? "translateY(115%)" : "none" }}
    >
      <GiantName as="h1" rise />
    </div>
  );
}
