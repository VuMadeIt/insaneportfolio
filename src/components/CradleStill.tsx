import { getImageProps } from "next/image";

/**
 * The pre-rendered still of the real scene (scripts/still.mjs). It is the LCP image, stays until
 * the canvas has drawn, and is the whole cradle when WebGL is unavailable. Positioned by
 * `.cradle-still` in globals.css with the same framing maths as the camera.
 */
export function CradleStill() {
  const common = { alt: "", sizes: "100vw", quality: 85 };
  const landscape = getImageProps({
    ...common,
    src: "/fallback/cradle-landscape.webp",
    width: 2000,
    height: 2000,
    priority: true,
  }).props;
  const portrait = getImageProps({
    ...common,
    src: "/fallback/cradle-portrait.webp",
    width: 900,
    height: 1950,
  }).props;
  return (
    <picture>
      <source media="(max-aspect-ratio: 9/10)" srcSet={portrait.srcSet} sizes="100vw" />
      {/* eslint-disable-next-line jsx-a11y/alt-text -- alt="" comes from getImageProps */}
      <img {...landscape} className="cradle-still" aria-hidden />
    </picture>
  );
}
