"use client";

import { useSyncExternalStore } from "react";
import { Segmented } from "./Segmented";

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
    <Segmented
      label="Screen language"
      className="mb-6"
      options={OPTIONS.map(([l, label]) => ({ key: l, label, lang: l }))}
      value={lang}
      onChange={(l) => set(l as Lang)}
    />
  );
}
