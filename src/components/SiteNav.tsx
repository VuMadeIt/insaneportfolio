"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted, unlockAudio } from "@/audio/clack";
import { CONTACT } from "@/content/contact";

/** Speaker with sound waves, or with a cross when muted. */
function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path d="M3 7.5h3l4-3.5v12l-4-3.5H3z" fill="currentColor" />
      {on ? (
        <path
          d="M13 7.2a3.6 3.6 0 0 1 0 5.6M15.2 5a6.6 6.6 0 0 1 0 10"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      ) : (
        <path d="m13 7.5 5 5m0-5-5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      )}
    </svg>
  );
}

/** Mutes every sound on the site (the cradle, slow motion, the footer's balls). */
export function SoundButton() {
  const on = !useSyncExternalStore(subscribeMuted, isMuted, () => false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Sound on" : "Sound off"}
      title={on ? "Sound on" : "Sound off"}
      className="-m-2 rounded-full p-2 text-ink transition-opacity duration-200 hover:opacity-60"
      onClick={() => {
        unlockAudio();
        setMuted(on);
      }}
    >
      <SpeakerIcon on={on} />
    </button>
  );
}

/**
 * The same bar on every page (PLAN 13.1): the name home on the left; work, about, the say hi
 * action and the sound button on the right. Underlines only appear on hover.
 */
export function SiteNav({ className = "" }: { className?: string }) {
  return (
    <nav
      aria-label="Site"
      className={`flex items-center justify-between px-[var(--gutter)] pt-[var(--corner-top)] text-[16px] sm:text-[17px] ${className}`}
    >
      <Link href="/" className="u-grow font-display font-medium tracking-[-0.02em]">
        lucas vu
      </Link>
      <div className="flex items-center gap-5 sm:gap-7">
        <Link href="/work" className="u-grow">
          work
        </Link>
        <Link href="/about" className="u-grow">
          about
        </Link>
        <a
          href={`mailto:${CONTACT.email}`}
          className="rounded-full bg-ink px-4 py-1.5 text-wall transition-colors duration-300 hover:bg-[#3a3936] sm:px-5 sm:py-2"
        >
          say hi
        </a>
        <SoundButton />
      </div>
    </nav>
  );
}
