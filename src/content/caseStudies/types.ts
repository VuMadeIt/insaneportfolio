import type { Frame, Media } from "../projects";

/** A phone screen, framed as an iPhone when `frame` is set. */
export interface Shot {
  src: string;
  alt: string;
  width: number;
  height: number;
  frame?: Frame;
  label?: string;
}

export interface Stat {
  value: string;
  text: string;
  /** Third-party numbers carry their source; Lucas's own results do not need one. */
  source?: string;
  href?: string;
}

export interface DiagramNode {
  id: string;
  text: string;
  sub?: string;
  col: number;
  row: number;
  rowSpan?: number;
  tone?: "plain" | "white" | "accent" | "ink" | "chip" | "ghost";
}

/** Nodes in a grid and the arrows between them; arrows are computed from the boxes (PLAN 13.6). */
export interface DiagramData {
  kind: "diagram";
  cols: number;
  nodes: DiagramNode[];
  edges: { from: string; to: string; label?: string; tone?: "accent" | "ink" | "muted"; dashed?: boolean }[];
  /** CSS grid-template-columns, when the columns are not equal. */
  widths?: string;
  minWidth?: number;
  rowGap?: number;
  /** Column gap; wider when wires carry labels. */
  gap?: string;
}

export interface Bar {
  label: string;
  sub?: string;
  /** One value, or a range drawn from low to high. */
  value: number | [number, number];
  display: string;
  tone?: "accent" | "ink" | "soft";
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
  /** Short cards; with `image`, each opens on an illustration (my Framer case-study art). */
  | {
      kind: "cards";
      /** With `width` and `height`, an image keeps its whole frame instead of a cropped 8:5. */
      cards: {
        title: string;
        body: string;
        image?: { src: string; alt: string; width?: number; height?: number };
      }[];
    }
  /** Sticky notes in columns, one column per site under its screenshot; the notes pin in one by one. */
  | {
      kind: "notes";
      columns: { title: string; colour: string; image: { src: string; alt: string }; notes: string[] }[];
      /** What the team concluded, as its own row under the columns. */
      takeaways?: { title: string; colour: string; notes: string[] };
    }
  /** Images of any shape packed into columns, each whole: a wall of sketches. */
  | { kind: "mosaic"; media: Media[] }
  /** Live products to open, each with what to do there. */
  | {
      kind: "links";
      links: {
        title: string;
        body: string;
        href: string;
        cta: string;
        image?: { src: string; alt: string };
        /** Test logins shown with a copy button each. */
        logins?: { label: string; value: string }[];
      }[];
    }
  | { kind: "options"; options: { title: string; pros: string[]; cons: string[]; chosen?: boolean }[] }
  | { kind: "embed"; src: string; title: string; poster: Media }
  | { kind: "list"; items: string[] }
  | DiagramData
  /** Horizontal bars on a linear or log scale; ticks are labelled with `unit`. */
  | {
      kind: "bars";
      scale: "linear" | "log";
      min: number;
      max: number;
      ticks: number[];
      unit: string;
      bars: Bar[];
    }
  /** The placement, drawn as a podium; extra awards as tags. */
  | { kind: "podium"; place: 1 | 2 | 3; name: string; extra?: string[] }
  /** A real comparison table: true is a check, false a dash, a string is written out. */
  | {
      kind: "table";
      columns: string[];
      rows: { label: string; cells: (boolean | string)[]; ours?: boolean }[];
    }
  /** The event's prompt, quoted, with the facts of the event under it. */
  | { kind: "brief"; prompt: string; source?: string; facts: { label: string; value: string }[] }
  /** A screen with numbered callouts at x/y percent, explained in a legend beside it. */
  | {
      kind: "anatomy";
      image: Shot;
      points: { x: number; y: number; title: string; text: string }[];
    }
  /** Two to three columns, each a heading and a short paragraph or a list. */
  | { kind: "compare"; columns: { title: string; tone?: "accent" | "ink" | "plain"; items: string[] }[] }
  /**
   * A design system as a small docs site in a window: a side nav of foundations (colour, type, shape,
   * spacing) and components, each page a title, its one rule, then the specimen.
   */
  | {
      kind: "system";
      /** `against` names the colour its contrast is checked on (an edge); otherwise text on it. */
      colours: { name: string; hex: string; role: string; against?: string }[];
      rules: { colour: string; type: string; shape: string; components: string; spacing: string };
      faces: { name: string; use: string; family: "display" | "text"; sample: string }[];
      /** One Vietnamese phrase, set in the Latin cut alone and then with the Vietnamese cut. */
      proof: { text: string; before: string; after: string };
      shapes: { shape: "square" | "pill" | "field"; label: string; note: string }[];
    }
  /** The same screens in two or three states (before and after, two languages), cross-faded by a switch. */
  | {
      kind: "switch";
      label: string;
      options: {
        label: string;
        note: string;
        images: Shot[];
      }[];
    };

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
  /** The one-paragraph summary under the title. */
  summary: string;
  /** One-sentence claim, for metadata and the skim test. */
  claim: string;
  meta: { role: string; team?: string; timeline: string; scope: string; outcome?: string };
  /** The product's own colour, for its graphics (PLAN 13.6), and a pale tint of it. */
  accent: string;
  accentSoft: string;
  link?: { label: string; href: string };
  /** More links beside `link`, e.g. a second live product. */
  links?: { label: string; href: string }[];
  /** Sibling case studies of one project (Hack Canada: design system, landing page), as tabs. */
  tabs?: { label: string; slug: string }[];
  hero?: Media;
  blocks: Block[];
  next: string;
  /** Parts drafted or rewritten for Lucas to confirm. */
  draft: string[];
}
