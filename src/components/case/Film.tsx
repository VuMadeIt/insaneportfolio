"use client";

import { type ReactNode, useEffect, useRef, useState } from "react";
import type { Media } from "@/content/projects";

const clock = (s: number) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, "0")}`;

/**
 * A screen film with its own controls: it plays muted while on screen (never under reduced motion),
 * and a reader can pause it or drag to any moment to read a screen. A pause sticks until play.
 * `children` wraps the video (a phone frame); the controls sit under the wrapper.
 */
export function Film({
  media,
  bare = false,
  children,
}: {
  media: Media;
  bare?: boolean;
  children?: (video: ReactNode) => ReactNode;
}) {
  const ref = useRef<HTMLVideoElement>(null);
  const held = useRef(false);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [length, setLength] = useState(0);

  useEffect(() => {
    const v = ref.current;
    // Metadata can arrive before hydration, when onLoadedMetadata isn't listening yet.
    if (v && v.readyState >= 1) setLength(v.duration);
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting && !held.current) void v.play().catch(() => {});
        else if (!e?.isIntersecting) v.pause();
      },
      { threshold: 0.4 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  // The bar follows every frame while playing, not timeupdate's four times a second.
  useEffect(() => {
    if (!playing) return;
    let frame = requestAnimationFrame(function tick() {
      setTime(ref.current?.currentTime ?? 0);
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [playing]);

  const toggle = () => {
    const v = ref.current!;
    held.current = !v.paused;
    if (v.paused) void v.play().catch(() => {});
    else v.pause();
  };

  const video = (
    <video
      ref={ref}
      className={bare ? "block h-auto w-full" : "block h-auto w-full rounded-md bg-panel"}
      src={media.video}
      poster={media.poster}
      width={media.width}
      height={media.height}
      muted
      loop
      playsInline
      preload="metadata"
      aria-label={media.alt}
      onPlay={() => setPlaying(true)}
      onPause={() => setPlaying(false)}
      onLoadedMetadata={(e) => setLength(e.currentTarget.duration)}
      onSeeked={(e) => setTime(e.currentTarget.currentTime)}
    />
  );

  return (
    <div className="flex w-full flex-col items-center gap-4">
      {children ? children(video) : video}
      <div className="flex w-full max-w-[420px] items-center gap-3 text-[13px] tabular-nums text-muted">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause" : "Play"}
          className="grid size-9 shrink-0 place-items-center rounded-full bg-ink text-wall transition-transform duration-200 active:scale-95"
        >
          <svg aria-hidden viewBox="0 0 12 12" className="size-3" fill="currentColor">
            {playing ? <path d="M2 1h3v10H2zM7 1h3v10H7z" /> : <path d="M3 1.2v9.6L10.6 6z" />}
          </svg>
        </button>
        <input
          type="range"
          aria-label="Seek"
          min={0}
          max={length || 1}
          step={0.05}
          value={time}
          onChange={(e) => {
            const v = ref.current!;
            v.currentTime = Number(e.target.value);
            setTime(v.currentTime);
          }}
          className="film-seek h-1 min-w-0 flex-1 cursor-pointer"
          style={{ "--p": `${(time / (length || 1)) * 100}%` } as React.CSSProperties}
        />
        <span className="w-[5.5em] shrink-0 text-right">
          {clock(time)} / {clock(length)}
        </span>
      </div>
    </div>
  );
}
