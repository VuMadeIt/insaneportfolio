"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Media } from "@/content/projects";

/**
 * A project's picture: a muted loop that only loads and plays while on screen (and never under
 * reduced motion, where the poster stays), or a still image, with the site's media radius.
 */
export function ExhibitMedia({
  media,
  sizes,
  priority = false,
  cover = false,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
  /** Fill the positioned parent, cropped (the home cards), instead of keeping its own ratio. */
  cover?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

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
