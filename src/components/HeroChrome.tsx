"use client";

import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";
import { type Placement, TAGLINE, TaglineLine } from "./Tagline";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

const ON_NAME: Partial<Record<Placement, { word: number; align: "left" | "center" | "right" }>> = {
  "vu-left": { word: 1, align: "left" },
  "vu-center": { word: 1, align: "center" },
  "vu-right": { word: 1, align: "right" },
  "lucas-left": { word: 0, align: "left" },
};

/**
 * The giant name, with the tagline wherever `tagline` puts it (PLAN 15.12). Both slide down out
 * of view while a story is open, to open up white space.
 */
export function HeroName({ text, label, tagline }: { text?: string; label?: string; tagline?: Placement }) {
  const story = useStoryOpen();
  const onName = tagline && ON_NAME[tagline];
  return (
    <>
      {tagline === "corner" && (
        <TaglineLine
          className={`tagline-rise absolute left-[clamp(20px,2.5vw,36px)] top-[calc(var(--nav-h)+16px)] z-10 transition-opacity duration-500 ${story ? "opacity-0" : ""}`}
        />
      )}
      <div
        className="absolute inset-x-0 bottom-0 transition-transform duration-[900ms] ease-[var(--ease-drawer)]"
        // The tagline hangs above the name (up to two lines on phones): take it out of view too.
        style={{ transform: story ? "translateY(calc(115% + 4.5rem))" : "none" }}
      >
        <GiantName
          as="h1"
          rise
          text={text}
          label={label}
          caption={onName ? TAGLINE : undefined}
          captionWord={onName?.word}
          captionAlign={onName?.align}
        />
      </div>
    </>
  );
}
