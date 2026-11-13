"use client";

import { useSyncExternalStore } from "react";

/** The language the staff screens are shown in, shared by every figure on the page. */
export type Lang = "vi" | "en";
let current: Lang = "vi";
const subs = new Set<() => void>();
const set = (l: Lang) => {
  current = l;
  subs.forEach((f) => f());
};
const subscribe = (f: () => void) => (subs.add(f), () => void subs.delete(f));

export const useScreenLang = () =>
  useSyncExternalStore(
    subscribe,
    () => current,
    () => "vi" as Lang,
  );

/** The English twin of a screen when English is on and it has one. */
export function usePick<T extends { en?: Omit<T, "en"> }>(m: T): Omit<T, "en"> {
  const lang = useScreenLang();
  return lang === "en" && m.en ? m.en : m;
}

const OPTIONS: [Lang, string][] = [
  ["vi", "Tiếng Việt"],
  ["en", "English"],
];

/** Tiếng Việt / English tabs over a figure of staff screens; one tap switches every figure. */
export function ScreenLangTabs() {
  const lang = useScreenLang();
  return (
    <div
      role="group"
      aria-label="Screen language"
      className="mx-auto mb-6 flex w-fit justify-center gap-1 rounded-[26px] bg-wall p-1"
    >
      {OPTIONS.map(([l, label]) => (
        <button
          key={l}
          type="button"
          lang={l}
          aria-pressed={lang === l}
          onClick={() => set(l)}
          className={`rounded-full px-5 py-2.5 text-[15px] transition-colors duration-300 ${lang === l ? "bg-ink text-wall" : "hover:bg-white"}`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
