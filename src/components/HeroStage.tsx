"use client";

import dynamic from "next/dynamic";
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
  return (
    <>
      <div
        className="absolute inset-0 transition-opacity duration-700 ease-[var(--ease-out)]"
        style={{ opacity: live ? 0 : 1 }}
      >
        <CradleStill />
      </div>
      {canRender && <Stage onFirstFrame={() => setLive(true)} />}
      {canRender && <AccessibleTargets />}
    </>
  );
}
