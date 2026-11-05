"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { identities, identityIndex } from "@/content/identities";
import { useState, useSyncExternalStore } from "react";
import { AccessibleTargets } from "./AccessibleTargets";
import { CradleStill } from "./CradleStill";

const Stage = dynamic(() => import("@/scene/Stage"), { ssr: false });

let webgl: boolean | undefined;
function hasWebGL2(): boolean {
  webgl ??= !!document.createElement("canvas").getContext("webgl2");
  return webgl;
}
const noop = () => () => {};
const yes = () => true;
const no = () => false;

/**
 * The live cradle. The balls drop in from above on every arrival (PLAN 15.6), so the pre-rendered
 * still is only a fallback: without WebGL, and (by a CSS timer, `.hero-still` in globals.css)
 * whenever the live scene has not drawn within a few seconds, so the hero is never left empty.
 */
export function HeroStage() {
  const [live, setLive] = useState(false);
  const hydrated = useSyncExternalStore(noop, yes, no);
  const canRender = useSyncExternalStore(noop, hasWebGL2, no);
  const story = identityIndex(usePathname().slice(1)) >= 0;
  const state = hydrated && !canRender ? "fallback" : live ? "live" : undefined;
  return (
    <>
      <div className="hero-still absolute inset-0" data-state={state}>
        <CradleStill />
        {!canRender && !story && (
          <nav aria-label="Identities" className="absolute inset-0">
            {identities.map((id, i) => (
              <Link
                key={id.slug}
                href={`/${id.slug}`}
                className="fallback-target text-[15px]"
                style={{ "--i": i - 1.5 } as React.CSSProperties}
                aria-label={`${id.title}: ${id.line.toLowerCase().replace(/\.$/, "")}. Open story.`}
              >
                {id.title}
              </Link>
            ))}
          </nav>
        )}
      </div>
      {canRender && <Stage onFirstFrame={() => setLive(true)} />}
      {canRender && <AccessibleTargets />}
    </>
  );
}
