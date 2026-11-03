"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { identityIndex } from "@/content/identities";
import { unlockAudio } from "@/audio/clack";
import { useUi } from "@/state/ui";

/** Sam-style bracketed corner toggle. Sound is on by default and starts with the first interaction. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const sound = useUi((s) => s.sound);
  // On portrait screens the story text takes the bottom of the screen.
  const story = identityIndex(usePathname().slice(1)) >= 0;
  useEffect(() => {
    if (localStorage.getItem("sound") === "off") useUi.setState({ sound: false });
  }, []);
  return (
    <button
      type="button"
      aria-pressed={sound}
      className={`bracket z-10 text-[15px] ${className} ${story ? "story-hide-portrait" : ""}`}
      onClick={() => {
        unlockAudio();
        useUi.getState().setSound(!sound);
      }}
    >
      [sound {sound ? "on" : "off"}]
    </button>
  );
}
