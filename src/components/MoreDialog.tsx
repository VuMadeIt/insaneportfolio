"use client";

import Link from "next/link";
import { useRef } from "react";

/** Sam-style `[more]` after the corner line: a small dialog with a two-sentence intro. */
export function MoreDialog() {
  const dialog = useRef<HTMLDialogElement>(null);
  return (
    <>
      <button
        type="button"
        className="bracket"
        onClick={() => dialog.current?.showModal()}
        aria-haspopup="dialog"
      >
        [more]
      </button>
      <dialog
        ref={dialog}
        aria-labelledby="more-title"
        className="more-dialog m-0 max-w-[26em] bg-wall p-8 text-[16px] leading-[1.55] text-ink"
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
      >
        <h2 id="more-title" className="text-[22px] italic">
          Lucas Vu
        </h2>
        <p className="mt-3">
          I&apos;m a product designer studying Systems Design Engineering at Waterloo, now designing at
          Digital Extremes. Six hackathon and designathon wins in, I still like the first push best: getting
          an idea out of a group chat and into people&apos;s hands.
        </p>
        <div className="mt-6 flex gap-6">
          <Link href="/about" className="link-arrow">
            About me <span aria-hidden>&rarr;</span>
          </Link>
          <button type="button" className="bracket" onClick={() => dialog.current?.close()}>
            [close]
          </button>
        </div>
      </dialog>
    </>
  );
}
