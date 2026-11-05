"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { isMuted, setMuted, subscribeMuted, unlockAudio } from "@/audio/clack";
import { CONTACT } from "@/content/contact";
import { identityIndex } from "@/content/identities";
import { HavenMenu } from "./HavenMenu";

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

/** Mutes every sound on the site (the cradle, slow motion). `labelled` writes the state beside the icon. */
export function SoundButton({ labelled = false, className }: { labelled?: boolean; className?: string }) {
  const on = !useSyncExternalStore(subscribeMuted, isMuted, () => false);
  const label = on ? "Sound on" : "Sound off";
  return (
    <button
      type="button"
      aria-pressed={on}
      aria-label={labelled ? undefined : label}
      title={labelled ? undefined : label}
      className={className ?? "-m-2 rounded-full p-2 transition-opacity duration-200 hover:opacity-60"}
      onClick={() => {
        unlockAudio();
        setMuted(on);
      }}
    >
      <SpeakerIcon on={on} />
      {labelled && label.toLowerCase()}
    </button>
  );
}

/**
 * The nav on every page (PLAN 14.3, 15.3, 15.11). From 768 px: a slim bar with one ball home at
 * the left edge; about, work, contact (an email) and the sound button on the right, set like the
 * headings. It hides while you scroll down and comes back on any scroll up; at the top of the page
 * it is always there. Phones get the Haven menu instead. Both step aside while a story is open
 * (clicking anywhere or Escape closes it).
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

  // The labs bring their own, except the ones that compare the home page as it really is.
  if (pathname.startsWith("/lab") && !["/lab/type", "/lab/tagline"].includes(pathname)) return null;
  return (
    <>
      <header
        ref={bar}
        className="site-nav fixed inset-x-0 top-0 z-40 max-md:hidden"
        style={story ? { transform: "translateY(calc(-100% - 2px))" } : undefined}
        inert={story}
      >
        <nav
          aria-label="Site"
          className="font-display flex h-[var(--nav-h)] items-center justify-between px-[clamp(20px,2.5vw,36px)]"
        >
          <Link
            href="/"
            aria-label="Lucas Vu, home"
            className="-m-2 p-2 transition-opacity duration-200 hover:opacity-75"
          >
            <Image src="/media/objects/ball.webp" alt="" width={24} height={24} priority className="size-6" />
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/about" className="u-grow">
              about
            </Link>
            <Link href="/work" className="u-grow">
              work
            </Link>
            <a href={`mailto:${CONTACT.email}`} className="u-grow">
              contact
            </a>
            <SoundButton />
          </div>
        </nav>
      </header>
      <HavenMenu hidden={story} />
    </>
  );
}
