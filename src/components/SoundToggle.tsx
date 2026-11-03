"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { identityIndex } from "@/content/identities";
import { unlockAudio } from "@/audio/clack";
import { useUi } from "@/state/ui";

/** Sam-style bracketed corner toggle with a metal underline on hover. Sound is on by default and starts with the first interaction. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const sound = useUi((s) => s.sound);
  // In a story the name has gone: the toggle drops to the corner, and on portrait screens the story
  // text takes the bottom of the screen.
  const story = identityIndex(usePathname().slice(1)) >= 0;
  useEffect(() => {
    if (localStorage.getItem("sound") === "off") useUi.setState({ sound: false });
  }, []);
  return (
    <button
      type="button"
      aria-pressed={sound}
      className={`group z-10 text-[15px] text-muted transition-colors hover:text-ink ${className} ${story ? "story-hide-portrait !bottom-[var(--corner-top)]" : ""}`}
      onClick={() => {
        unlockAudio();
        useUi.getState().setSound(!sound);
      }}
    >
      <span className="u-grow group-hover:bg-[length:100%_0.1em] group-focus-visible:bg-[length:100%_0.1em]">
        [sound {sound ? "on" : "off"}]
      </span>
    </button>
  );
}
