"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Media } from "@/content/projects";

/**
 * A project's picture: a muted loop that only loads and plays while on screen (and never under
 * reduced motion, where the poster stays), or a still image. Square corners, always.
 */
export function ExhibitMedia({
  media,
  sizes,
  priority = false,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
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

  const box = "block h-auto w-full bg-[#e9e6df]";
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
      width={media.width}
      height={media.height}
      sizes={sizes}
      priority={priority}
    />
  );
}
