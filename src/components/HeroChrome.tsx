"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

/** While a story is open the fixed nav steps aside for this back arrow in the hero's corner. */
export function HeroBack() {
  if (!useStoryOpen()) return null;
  return (
    <Link
      href="/"
      scroll={false}
      aria-label="Back to the cradle"
      className="u-grow absolute left-[var(--gutter)] top-[calc((var(--nav-h)_-_1.5em)_/_2)] z-10 text-[16px]"
    >
      <span aria-hidden>&larr;</span> back
    </Link>
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
