"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Media } from "@/content/projects";

/**
 * A project's picture: a muted loop that only loads and plays while on screen (and never under
 * reduced motion, where the poster stays), or a still image, with the site's media radius.
 * `play`, when given, decides playback instead of visibility (the work list's floating preview).
 */
export function ExhibitMedia({
  media,
  sizes,
  priority = false,
  cover = false,
  play,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
  /** Fill the positioned parent, cropped, instead of keeping its own ratio. */
  cover?: boolean;
  play?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);
  const controlled = play !== undefined;

  useEffect(() => {
    const v = video.current;
    if (!v || controlled || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [controlled]);

  useEffect(() => {
    const v = video.current;
    if (!v || !controlled) return;
    if (play && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) void v.play().catch(() => {});
    else v.pause();
  }, [controlled, play]);

  const box = cover
    ? "absolute inset-0 h-full w-full object-cover"
    : "block h-auto w-full rounded-md bg-[#e9e6df]";
  if (media.video) {
    return (
      <video
        ref={video}
        className={box}
        src={media.video}
        poster={media.poster}
        width={media.width}
        height={media.height}
        muted
        loop
        playsInline
        preload="none"
        aria-label={media.alt}
      />
    );
  }
  return (
    <Image
      className={box}
      src={media.image!}
      alt={media.alt}
      {...(cover ? { fill: true } : { width: media.width, height: media.height })}
      sizes={sizes}
      priority={priority}
    />
  );
}
