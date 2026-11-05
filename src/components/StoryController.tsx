"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { identities, identityIndex } from "@/content/identities";
import { close, enter, intro, open, reframe } from "@/scene/choreography";
import { taps } from "@/scene/world";
import { useUi } from "@/state/ui";

/** Set once the app has hydrated; components mounted after that came from a navigation. */
export const app = { hydrated: false };

/**
 * Keeps the route, the selected identity and the choreography in step. `/people` etc. are the
 * source of truth: taps and keys navigate, the route change runs the choreography. A direct load
 * of an identity route enters the selected state without the intro; any other arrival (a load, a
 * reload, coming back from another page) drops the balls in from above.
 */
export function StoryController() {
  const router = useRouter();
  const pathname = usePathname();
  const index = identityIndex(pathname.slice(1));
  const selected = index >= 0 ? index : null;
  const first = useRef(true);

  useEffect(() => {
    useUi.getState().setSelected(selected);
    if (first.current) {
      first.current = false;
      app.hydrated = true;
      if (selected !== null) enter(selected);
      else intro();
      return;
    }
    if (selected === null) close();
    else open(selected);
  }, [selected]);

  useEffect(() => {
    const home = () => router.push("/", { scroll: false });
    taps.ball = (i, pointerType) => {
      const ui = useUi.getState();
      if (ui.selected !== null) return;
      // Touch: the first tap reveals and names the ball, the second opens its story.
      if (pointerType !== "mouse" && ui.hovered !== i) return ui.setHovered(i);
      router.push(`/${identities[i]!.slug}`, { scroll: false });
    };
    taps.wall = () => {
      const ui = useUi.getState();
      if (ui.selected !== null) home();
      else if (ui.hovered !== null) ui.setHovered(null);
    };
    const key = (e: KeyboardEvent) => e.key === "Escape" && useUi.getState().selected !== null && home();
    const resize = () => reframe(useUi.getState().selected);
    window.addEventListener("keydown", key);
    window.addEventListener("resize", resize);
    return () => {
      window.removeEventListener("keydown", key);
      window.removeEventListener("resize", resize);
    };
  }, [router]);

  return null;
}
