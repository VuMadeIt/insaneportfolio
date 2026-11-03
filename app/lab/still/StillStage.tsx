"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const Stage = dynamic(() => import("@/scene/Stage"), { ssr: false });

export function StillStage() {
  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
  }, []);
  return (
    <div className="fixed inset-0">
      <Stage onFirstFrame={() => document.body.setAttribute("data-ready", "1")} />
    </div>
  );
}
