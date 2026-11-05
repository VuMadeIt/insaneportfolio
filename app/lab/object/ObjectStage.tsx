"use client";

import dynamic from "next/dynamic";
import { useEffect } from "react";

const Scene = dynamic(() => import("./Scene"), { ssr: false });

export function ObjectStage() {
  useEffect(() => {
    document.documentElement.style.background = "transparent";
    document.body.style.background = "transparent";
  }, []);
  return (
    <div className="fixed inset-0">
      <Scene />
    </div>
  );
}
