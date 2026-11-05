"use client";

import { usePathname } from "next/navigation";
import { identityIndex } from "@/content/identities";
import { GiantName } from "./GiantName";

const useStoryOpen = () => identityIndex(usePathname().slice(1)) >= 0;

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
