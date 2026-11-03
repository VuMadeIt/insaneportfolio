"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import type { Media } from "@/content/projects";

/**
 * A project's picture: a muted loop that only loads and plays while on screen (and never under
 * reduced motion, where the poster stays), or a still image, with the site's media radius.
 * `hoverPlay`: on desktop the loop plays only while its `.catalogue-row` is hovered or focused.
 */
export function ExhibitMedia({
  media,
  sizes,
  priority = false,
  cover = false,
  hoverPlay = false,
}: {
  media: Media;
  sizes: string;
  priority?: boolean;
  /** Fill the positioned parent, cropped, instead of keeping its own ratio. */
  cover?: boolean;
  hoverPlay?: boolean;
}) {
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = video.current;
    if (!v || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const row =
      hoverPlay &&
      matchMedia("(min-width: 1024px) and (hover: hover)").matches &&
      v.closest(".catalogue-row");
    if (row) {
      const on = () => void v.play().catch(() => {});
      const off = () => v.pause();
      const events = [
        ["pointerenter", on],
        ["focusin", on],
        ["pointerleave", off],
        ["focusout", off],
      ] as const;
      events.forEach(([e, f]) => row.addEventListener(e, f));
      return () => events.forEach(([e, f]) => row.removeEventListener(e, f));
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e?.isIntersecting) void v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, [hoverPlay]);

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
