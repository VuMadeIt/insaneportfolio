import type { Media } from "../projects";

export interface Stat {
  value: string;
  text: string;
  /** Third-party numbers carry their source; Lucas's own results do not need one. */
  source?: string;
  href?: string;
}

/** The picture under a block: real media first, coded visuals where no honest picture exists. */
export type Visual =
  | { kind: "media"; media: Media[] }
  | { kind: "stats"; stats: Stat[] }
  | { kind: "quotes"; quotes: { text: string; who: string }[] }
  /** One sentence set large, its words rising in. */
  | { kind: "statement"; text: string }
  /** `lit` of `total` dots light up: a ratio from a quote, drawn. */
  | { kind: "dots"; total: number; lit: number }
  /** Columns of boxes joined left to right; a column of two is a branch. */
  | { kind: "flow"; columns: string[][] }
  | { kind: "cards"; cards: { title: string; body: string }[] }
  | { kind: "options"; options: { title: string; pros: string[]; cons: string[]; chosen?: boolean }[] }
  /** A video played by the scroll position instead of the clock. */
  | { kind: "scrub"; video: string; poster: string; width: number; height: number; alt: string }
  | { kind: "embed"; src: string; title: string; poster: Media }
  | { kind: "list"; items: string[] };

export interface Block {
  id: string;
  /** The small label (Caleb Wu's rhythm): "The problem", "Insight #1", "Research"... */
  label: string;
  /** A first-person claim. Reading only these headlines tells the whole story. */
  headline: string;
  /** Two lines or so. */
  body: string[];
  visual?: Visual;
  /** One small line under the visual. */
  caption?: string;
  /** Consecutive blocks marked `pair` sit side by side (the two insights). */
  pair?: boolean;
}

export interface CaseStudy {
  slug: string;
  year: string;
  /** The one-paragraph summary under the title. */
  summary: string;
  /** One-sentence claim, for metadata and the skim test. */
  claim: string;
  meta: { role: string; team?: string; timeline: string; scope: string };
  link?: { label: string; href: string };
  hero?: Media;
  blocks: Block[];
  next: string;
  /** Parts drafted or rewritten for Lucas to confirm. */
  draft: string[];
}
