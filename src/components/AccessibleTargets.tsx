"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { unlockAudio } from "@/audio/clack";
import { identities } from "@/content/identities";
import { afterFrame, cradle, frame, requestRender } from "@/scene/world";
import { useUi } from "@/state/ui";

/** A gentle keyboard push (m/s): about a 9 degree swing. */
const PUSH = 0.32;

/**
 * One real <button> per ball, kept over the ball every frame. Invisible, but focusable and with a
 * visible square focus ring around the sphere; Tab goes People to Products, focus reveals like
 * hover, Enter or Space opens the story, arrow keys give the ball a push. Pointer input goes
 * straight through to the canvas.
 */
export function AccessibleTargets() {
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const captions = useRef<(HTMLParagraphElement | null)[]>([]);
  const hovered = useUi((s) => s.hovered);
  const selected = useUi((s) => s.selected);
  const router = useRouter();

  useEffect(() => {
    const place = () => {
      frame.screen.forEach((s, i) => {
        const b = buttons.current[i];
        if (!b) return;
        const d = Math.max(2 * s.r, 24);
        b.style.transform = `translate(${s.x - d / 2}px, ${s.y - d / 2}px)`;
        b.style.width = b.style.height = `${d}px`;
        const c = captions.current[i];
        if (c) c.style.transform = `translate(${s.x}px, ${s.y + s.r + 14}px) translateX(-50%)`;
      });
    };
    afterFrame.add(place);
    return () => void afterFrame.delete(place);
  }, []);

  useEffect(() => {
    requestRender();
  }, [hovered]);

  const onKey = (i: number) => (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowLeft" && e.key !== "ArrowRight") return;
    e.preventDefault();
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    unlockAudio();
    cradle.push(i, e.key === "ArrowRight" ? PUSH : -PUSH);
    requestRender();
  };

  return (
    <div className="pointer-events-none absolute inset-0">
      {identities.map((id, i) => (
        <button
          key={id.slug}
          ref={(b) => void (buttons.current[i] = b)}
          type="button"
          className="cradle-target absolute left-0 top-0"
          aria-label={`${id.title}: ${id.line.toLowerCase().replace(/\.$/, "")}. Open story.`}
          onFocus={() => useUi.getState().setHovered(i)}
          onBlur={() => useUi.getState().setHovered(null)}
          onKeyDown={onKey(i)}
          hidden={selected !== null && selected !== i}
          aria-disabled={selected === i}
          onClick={() => {
            unlockAudio();
            if (selected === null) router.push(`/${id.slug}`, { scroll: false });
          }}
        />
      ))}
      {identities.map((id, i) => (
        <p
          key={id.slug}
          ref={(c) => void (captions.current[i] = c)}
          aria-hidden
          className="absolute left-0 top-0 whitespace-nowrap text-[15px] transition-opacity duration-300 ease-[var(--ease-out)]"
          style={{ opacity: hovered === i && selected === null ? 1 : 0 }}
        >
          {id.title}
        </p>
      ))}
    </div>
  );
}
