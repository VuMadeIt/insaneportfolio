/** Vertical field of view: a long product-photography lens. */
export const FOV = 18;
/** Camera height above the ball centre line (m): just enough that the string V reads as depth. */
export const CAMERA_HEIGHT = 0.035;

/**
 * Framing constants, mirrored in `.cradle-still` in globals.css so the pre-rendered still lines up
 * with the live canvas. Landscape shows at least 0.8 m of width and 0.48 m of height; portrait at
 * least 0.36 m of width, never more than 0.95 m of height (so the anchors, 0.5 m above the balls,
 * always stay above the top edge).
 */
export const FRAMING = {
  landscape: { minWidth: 0.8, minHeight: 0.48, maxHeight: Infinity, ballFromTop: 0.5 },
  portrait: { minWidth: 0.36, minHeight: 0.48, maxHeight: 0.95, ballFromTop: 0.48 },
} as const;
export const PORTRAIT_BELOW = 0.9;

export interface Framing {
  /** Camera distance from the ball plane (m). */
  distance: number;
  /** World height visible at the ball plane (m). */
  visibleHeight: number;
  /** Lens shift in pixels (positive moves the image up), applied with setViewOffset. */
  shiftPx: number;
  /** Fraction of the viewport height, from the top, at which the ball centres sit. */
  ballFromTop: number;
}

/** Where the camera stands for a viewport. */
export function frameFor(width: number, height: number): Framing {
  const aspect = width / height;
  const f = aspect < PORTRAIT_BELOW ? FRAMING.portrait : FRAMING.landscape;
  const visibleHeight = Math.min(f.maxHeight, Math.max(f.minHeight, f.minWidth / aspect));
  const distance = visibleHeight / 2 / Math.tan((FOV * Math.PI) / 360);
  // Without shift the ball line projects CAMERA_HEIGHT below the centre of the frame.
  const naturalFromTop = 0.5 + CAMERA_HEIGHT / visibleHeight;
  return {
    distance,
    visibleHeight,
    shiftPx: (naturalFromTop - f.ballFromTop) * height,
    ballFromTop: f.ballFromTop,
  };
}
