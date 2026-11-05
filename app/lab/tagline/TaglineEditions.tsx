"use client";

import { useState } from "react";
import { Hero } from "@/components/Hero";
import { HOME_PLACEMENT, PLACEMENTS, type Placement, TaglineLine } from "@/components/Tagline";

/** The hero with the tagline in each spot, over the home page; `?at=<key>` picks one. */
export function TaglineEditions({ initial, children }: { initial?: string; children: React.ReactNode }) {
  const [at, setAt] = useState<Placement>(
    initial && initial in PLACEMENTS ? (initial as Placement) : HOME_PLACEMENT,
  );
  return (
    <>
      <Hero key={at} tagline={at} />
      {at === "below" && (
        <TaglineLine className="tagline-rise px-[var(--gutter)] pt-[clamp(40px,7vh,72px)] text-[clamp(19px,1.8vw,26px)]" />
      )}
      {children}
      <fieldset className="fixed bottom-6 left-6 z-50 flex flex-col gap-1 rounded-md bg-ink p-4 text-[14px] text-wall">
        <legend className="sr-only">Tagline placement</legend>
        {(Object.keys(PLACEMENTS) as Placement[]).map((key) => (
          <label key={key} className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="at" checked={at === key} onChange={() => setAt(key)} />
            {PLACEMENTS[key]}
            {key === HOME_PLACEMENT && " (live)"}
          </label>
        ))}
      </fieldset>
    </>
  );
}
