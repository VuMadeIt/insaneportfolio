"use client";

import { useState } from "react";
import type { Identity } from "@/content/identities";

import { app } from "./StoryController";

/**
 * The wall text beside the chosen sphere: title, one line, three sentences. Server-rendered, so
 * the story reads without JavaScript or WebGL. It rises in, staggered, after the glide starts;
 * a direct load shows it at once.
 */
export function StoryPanel({ identity }: { identity: Identity }) {
  // Mounted during hydration (a direct load) it shows at once; mounted by a navigation it animates.
  const [animate] = useState(() => app.hydrated);
  const rise = (delay: number) => (animate ? { animationDelay: `${delay}ms` } : undefined);
  const cls = animate ? "story-rise" : "";
  return (
    <article
      aria-labelledby="story-title"
      className="story-panel pointer-events-none absolute inset-x-0 top-0 z-10 flex h-dvh min-h-[560px] px-[var(--gutter)]"
    >
      <div className="pointer-events-auto max-w-[34em]">
        <h2
          id="story-title"
          className={`${cls} text-[clamp(48px,7vw,112px)] leading-[0.95]`}
          style={rise(650)}
        >
          {identity.title}
        </h2>
        <p className={`${cls} mt-4 text-[clamp(19px,1.6vw,24px)] font-light`} style={rise(760)}>
          {identity.line}
        </p>
        <div className="mt-8 flex flex-col gap-3 text-[17px] leading-[1.55]">
          {identity.sentences.map((s, k) => (
            <p key={k} className={cls} style={rise(880 + k * 90)}>
              {s}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}
