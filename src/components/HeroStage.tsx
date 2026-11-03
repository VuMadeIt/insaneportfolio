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

/** The live cradle, with the still shown until the canvas has drawn (and kept if WebGL is missing). */
export function HeroStage() {
  const [live, setLive] = useState(false);
  const canRender = useSyncExternalStore(noop, hasWebGL2, () => false);
  // A deep link opens the story state directly; the still shows all four balls at rest, so with
  // WebGL it is skipped there rather than flashing the wrong state.
  const story = identityIndex(usePathname().slice(1)) >= 0;
  return (
    <>
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)]"
        style={{ opacity: live || (story && canRender) ? 0 : 1 }}
      >
        <CradleStill />
      </div>
      {canRender && <Stage onFirstFrame={() => setLive(true)} />}
      {canRender && <AccessibleTargets />}
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
    </>
  );
}
