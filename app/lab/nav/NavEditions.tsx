"use client";

import { useState } from "react";
import { SiteNav } from "@/components/SiteNav";
import { HavenMenu } from "./HavenMenu";

const EDITIONS = {
  four: "Nav bar, four balls (live)",
  one: "Nav bar, one ball, close to the edges",
  menu: "Haven menu",
} as const;
type Edition = keyof typeof EDITIONS;

/** Switches between the nav editions over the home page; `?v=<key>` picks one for screenshots. */
export function NavEditions({ initial }: { initial?: string }) {
  const [edition, setEdition] = useState<Edition>(
    initial && initial in EDITIONS ? (initial as Edition) : "four",
  );
  return (
    <>
      {edition === "menu" ? <HavenMenu /> : <SiteNav key={edition} edition={edition} />}
      <fieldset className="fixed bottom-6 left-6 z-50 flex flex-col gap-1 rounded-md bg-ink p-4 text-[14px] text-wall">
        <legend className="sr-only">Nav edition</legend>
        {(Object.keys(EDITIONS) as Edition[]).map((key) => (
          <label key={key} className="flex cursor-pointer items-center gap-2">
            <input type="radio" name="edition" checked={edition === key} onChange={() => setEdition(key)} />
            {EDITIONS[key]}
          </label>
        ))}
      </fieldset>
    </>
  );
}
