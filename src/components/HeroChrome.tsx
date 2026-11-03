"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";
import { SiteNav } from "./SiteNav";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

/**
 * The hero's top edge: the site nav, which gives way to a back arrow while a story is open. The
 * 404 adds its own link under the nav.
 */
export function HeroCorners({ children }: { children?: React.ReactNode }) {
  const story = useStoryOpen();
  return (
    <div className="pointer-events-none absolute inset-x-0 top-0 z-10">
      {story ? (
        <Link
          href="/"
          scroll={false}
          aria-label="Back to the cradle"
          className="u-grow pointer-events-auto absolute left-[var(--gutter)] top-[var(--corner-top)] text-[16px]"
        >
          <span aria-hidden>&larr;</span> back
        </Link>
      ) : (
        <>
          <SiteNav className="pointer-events-auto" />
          {children && <div className="pointer-events-auto mt-6 px-[var(--gutter)]">{children}</div>}
        </>
      )}
    </div>
  );
}

/** The giant name slides down out of view while a story is open, to open up white space. */
export function HeroName({ text, label }: { text?: string; label?: string }) {
  const story = useStoryOpen();
  return (
    <div
      className="absolute inset-x-0 bottom-0 transition-transform duration-[900ms] ease-[var(--ease-drawer)]"
      style={{ transform: story ? "translateY(115%)" : "none" }}
    >
      <GiantName as="h1" rise text={text} label={label} />
    </div>
  );
}
