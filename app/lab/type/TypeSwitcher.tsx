"use client";

import { useEffect, useState } from "react";

/** Every typeface the site has used, and the one it uses now (PLAN 15.8). */
const FACES = {
  current: {
    label: "General Sans + Cabinet Grotesk (now)",
    display: "--font-general",
    sans: "--font-cabinet",
  },
  fraunces: { label: "Fraunces (revision 1)", display: "--font-fraunces", sans: "--font-fraunces" },
  general: { label: "General Sans only", display: "--font-general", sans: "--font-general" },
  cabinet: { label: "Cabinet Grotesk only", display: "--font-cabinet", sans: "--font-cabinet" },
  flex: { label: "Roboto Flex (the moving line)", display: "--font-flex-lab", sans: "--font-flex-lab" },
} as const;
type Face = keyof typeof FACES;

/**
 * A floating switcher over the home page. It sets the two font tokens on <html>, so the nav, the
 * headings, the body and the footer all follow; `?font=<key>` picks one for screenshots.
 */
export function TypeSwitcher({ variables, initial }: { variables: string; initial?: string }) {
  const [face, setFace] = useState<Face>(initial && initial in FACES ? (initial as Face) : "current");

  useEffect(() => {
    const root = document.documentElement;
    const classes = variables.split(" ");
    root.classList.add(...classes);
    return () => root.classList.remove(...classes);
  }, [variables]);

  useEffect(() => {
    const root = document.documentElement.style;
    const f = FACES[face];
    root.setProperty("--font-display", `var(${f.display}), "Helvetica Neue", Arial, sans-serif`);
    root.setProperty("--font-sans", `var(${f.sans}), "Helvetica Neue", Arial, sans-serif`);
    return () => {
      root.removeProperty("--font-display");
      root.removeProperty("--font-sans");
    };
  }, [face]);

  return (
    <fieldset className="fixed bottom-6 left-6 z-50 flex flex-col gap-1 rounded-md bg-ink p-4 text-[14px] text-wall">
      <legend className="sr-only">Typeface</legend>
      {(Object.keys(FACES) as Face[]).map((key) => (
        <label key={key} className="flex cursor-pointer items-center gap-2">
          <input type="radio" name="face" checked={face === key} onChange={() => setFace(key)} />
          {FACES[key].label}
        </label>
      ))}
    </fieldset>
  );
}
