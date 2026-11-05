"use client";

import { useEffect, useRef } from "react";
import { useUi } from "@/state/ui";
import { CLICKABLE, nearSolid } from "./near";

type State = "default" | "link" | "grab" | "hide" | "drop";

function stateAt(x: number, y: number, target: Element | null): State {
  if (!target) return "default";
  if (target.closest("[data-cursor='hide']")) return "hide";
  if (target.closest(CLICKABLE)) return "link";
  const zone = target.closest("[data-cursor='drop']");
  if (zone) return nearSolid(zone, x, y) ? "default" : "drop";
  if (useUi.getState().hovered !== null && target.tagName === "CANVAS") return "grab";
  return "default";
}

/**
 * The site's cursor (PLAN 13.1): the old site's small ball, in the cradle's dark grey, trailing the
 * pointer a touch. Over links it swells and fades, over a work row it hides (the row's video
 * follows the pointer instead), over a ball it swells to say "grab", and in the home footer it
 * grows to hold "drop me". Only on devices with a fine pointer that can hover.
 */
export function Cursor() {
  const outer = useRef<HTMLDivElement>(null);
  const ball = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const root = document.documentElement;
    root.classList.add("custom-cursor");
    const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pos = { x: -100, y: -100 };
    const to = { x: -100, y: -100 };
    let visible = false;
    let raf = 0;

    const set = (state: State) => {
      if (ball.current && ball.current.dataset.state !== state) ball.current.dataset.state = state;
    };
    const tick = () => {
      const k = reduced ? 1 : 0.35;
      pos.x += (to.x - pos.x) * k;
      pos.y += (to.y - pos.y) * k;
      if (outer.current) outer.current.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
      raf = requestAnimationFrame(tick);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      to.x = e.clientX;
      to.y = e.clientY;
      if (!visible) {
        pos.x = to.x;
        pos.y = to.y;
        visible = true;
        outer.current?.removeAttribute("data-away");
      }
      set(stateAt(e.clientX, e.clientY, e.target as Element));
    };
    const away = (e: MouseEvent) => {
      if (e.relatedTarget) return;
      visible = false;
      outer.current?.setAttribute("data-away", "");
    };
    const press = () => ball.current?.setAttribute("data-pressed", "");
    const release = () => ball.current?.removeAttribute("data-pressed");
    // A ball under the pointer changes without the pointer moving (the cradle swings into it).
    const unsub = useUi.subscribe((s, prev) => {
      if (s.hovered !== prev.hovered && ball.current?.dataset.state !== "hide")
        set(s.hovered !== null ? "grab" : "default");
    });

    raf = requestAnimationFrame(tick);
    addEventListener("pointermove", move, { passive: true });
    document.addEventListener("mouseout", away);
    addEventListener("pointerdown", press);
    addEventListener("pointerup", release);
    return () => {
      cancelAnimationFrame(raf);
      unsub();
      root.classList.remove("custom-cursor");
      removeEventListener("pointermove", move);
      document.removeEventListener("mouseout", away);
      removeEventListener("pointerdown", press);
      removeEventListener("pointerup", release);
    };
  }, []);

  return (
    <div ref={outer} aria-hidden className="cursor-outer" data-away="">
      <div ref={ball} className="cursor-ball" data-state="default">
        <span className="cursor-label">drop me</span>
      </div>
    </div>
  );
}
