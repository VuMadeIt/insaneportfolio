"use client";

import { useEffect } from "react";
import { unlockAudio } from "@/audio/clack";
import { useUi } from "@/state/ui";

/** Sam-style bracketed corner toggle. Sound is on by default and starts with the first interaction. */
export function SoundToggle({ className = "" }: { className?: string }) {
  const sound = useUi((s) => s.sound);
  useEffect(() => {
    if (localStorage.getItem("sound") === "off") useUi.setState({ sound: false });
  }, []);
  return (
    <button
      type="button"
      aria-pressed={sound}
      className={`bracket text-[15px] ${className}`}
      onClick={() => {
        unlockAudio();
        useUi.getState().setSound(!sound);
      }}
    >
      [sound {sound ? "on" : "off"}]
    </button>
  );
}
