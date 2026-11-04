"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted, unlockAudio } from "@/audio/clack";
import { identityIndex } from "@/content/identities";

/** Speaker with sound waves, or with a cross when muted. */
function SpeakerIcon({ on }: { on: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" aria-hidden>
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

/** Mutes every sound on the site (the cradle, slow motion, the ball in "moving"). */
export function SoundButton() {
  const on = !useSyncExternalStore(subscribeMuted, isMuted, () => false);
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={on ? "Sound on" : "Sound off"}
      title={on ? "Sound on" : "Sound off"}
      className="-m-2 rounded-full p-2 text-muted transition-colors duration-200 hover:text-ink"
      onClick={() => {
        unlockAudio();
        setMuted(on);
      }}
    >
      <SpeakerIcon on={on} />
    </button>
  );
}

const LINKS = [
  ["About", "/about"],
  ["Work", "/work"],
  ["Contact", "#contact"],
] as const;

/**
 * The same slim bar on every page (PLAN 14.3): the four balls home on the left; About, Work,
 * Contact and the sound button on the right. It hides while you scroll down and comes back on any
 * scroll up; at the top of the page it is always there. An open story hands the corner to its
 * back arrow.
 */
export function SiteNav() {
  const pathname = usePathname();
  const bar = useRef<HTMLElement>(null);
  const story = identityIndex(pathname.slice(1)) >= 0;

  useEffect(() => {
    const el = bar.current;
    if (!el) return;
    let last = scrollY;
    const onScroll = () => {
      const y = scrollY;
      el.toggleAttribute("data-scrolled", y > 8);
      if (y < 80 || y < last - 4) el.removeAttribute("data-hidden");
      else if (y > last + 4) el.setAttribute("data-hidden", "");
      if (Math.abs(y - last) > 4) last = y;
    };
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (pathname.startsWith("/lab")) return null;
  return (
    <header
      ref={bar}
      className="site-nav fixed inset-x-0 top-0 z-40"
      style={story ? { transform: "translateY(calc(-100% - 2px))" } : undefined}
      inert={story}
    >
      <nav
        aria-label="Site"
        className="flex h-[var(--nav-h)] items-center justify-between px-[var(--gutter)] text-[16px]"
      >
        <Link
          href="/"
          aria-label="Lucas Vu, home"
          className="-m-2 p-2 transition-opacity duration-200 hover:opacity-75"
        >
          <Image
            src="/media/objects/balls.webp"
            alt=""
            width={88}
            height={22}
            priority
            className="h-[22px] w-auto"
          />
        </Link>
        <div className="flex items-center gap-6 sm:gap-8">
          {LINKS.map(([name, href]) => (
            <Link
              key={name}
              href={href}
              className="u-grow text-muted transition-colors duration-200 hover:text-ink"
            >
              {name}
            </Link>
          ))}
          <SoundButton />
        </div>
      </nav>
    </header>
  );
}
