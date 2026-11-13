"use client";

import { Fragment, useState } from "react";

/** A Vietnamese word whose English rises in above it on hover, focus or tap (styles: .gloss). */
export function Gloss({ vi, en }: { vi: string; en: string }) {
  const [open, setOpen] = useState(false);
  return (
    <span
      tabIndex={0}
      lang="vi"
      className="gloss"
      data-en={en}
      data-open={open || undefined}
      onClick={() => setOpen((o) => !o)}
      onBlur={() => setOpen(false)}
    >
      {vi}
      <span className="sr-only"> ({en})</span>
    </span>
  );
}

const MARK = /\[\[([^|\]]+)\|([^\]]+)\]\]/g;

/** Copy with `[[Vietnamese|English]]` marks, each shown as a Gloss. */
export function Rich({ text }: { text: string }) {
  const parts = text.split(MARK);
  if (parts.length === 1) return text;
  return parts.map((p, i) =>
    i % 3 === 1 ? (
      <Gloss key={i} vi={p} en={parts[i + 1]!} />
    ) : i % 3 === 0 ? (
      <Fragment key={i}>{p}</Fragment>
    ) : null,
  );
}
