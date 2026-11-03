/** Anything in a drop zone that a click should reach instead of dropping a ball. */
export const CLICKABLE = "a, button, [role='button'], summary, label, input, select, textarea";
/** The "drop me" label gives way, and no ball drops, this close (px) to text or a link. */
export const NEAR = 28;

/** Distance from a point to a rectangle (0 inside). */
export function distance(x: number, y: number, r: DOMRect) {
  return Math.hypot(Math.max(r.left - x, 0, x - r.right), Math.max(r.top - y, 0, y - r.bottom));
}

/** The boxes that count as "something there" in a drop zone: each letter of the name, each solid text box, each link. */
export function solidRects(zone: Element): DOMRect[] {
  return [
    ...zone.querySelectorAll(`[data-letter], [data-solid]:not([data-solid='letters']), ${CLICKABLE}`),
  ].map((el) => el.getBoundingClientRect());
}

export const nearSolid = (zone: Element, x: number, y: number) =>
  solidRects(zone).some((r) => distance(x, y, r) < NEAR);
