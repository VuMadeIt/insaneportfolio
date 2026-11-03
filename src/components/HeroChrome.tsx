"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

/**
 * The hero is only the balls and the name. In the story state a back arrow appears top left; the
 * 404 passes its own link instead.
 */
export function HeroCorners({ children }: { children?: React.ReactNode }) {
  const story = useStoryOpen();
  if (!story && !children) return null;
  return (
    <div className="pointer-events-none absolute left-[var(--gutter)] top-[var(--corner-top)] z-10">
      {story ? (
        <Link
          href="/"
          scroll={false}
          aria-label="Back to the cradle"
          className="u-grow pointer-events-auto text-[16px]"
        >
          <span aria-hidden>&larr;</span> back
        </Link>
      ) : (
        children
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
