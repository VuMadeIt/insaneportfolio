/** The line that goes with the name (PLAN 15.12). */
export const TAGLINE = "[a product design engineer who gets things moving]";

/**
 * Where it can sit, compared in /lab/tagline: above "VU" (left, centred or right), above "LUCAS",
 * in the hero's top-left corner, or under the name before the projects.
 */
export const PLACEMENTS = {
  "vu-left": "Above VU, from its left edge",
  "vu-center": "Above VU, centred",
  "vu-right": "Above VU, to its right edge",
  "lucas-left": "Above LUCAS, from its left edge",
  corner: "Top-left corner of the hero",
  below: "Under the name, before the projects",
} as const;
export type Placement = keyof typeof PLACEMENTS;

/** The home page's pick. */
export const HOME_PLACEMENT: Placement = "vu-right";

/** The tagline as a small line of its own (corner and below), outside the giant name. */
export function TaglineLine({ className = "" }: { className?: string }) {
  return <p className={`tagline font-display ${className}`}>{TAGLINE}</p>;
}
