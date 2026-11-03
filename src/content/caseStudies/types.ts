import type { Media } from "../projects";

export interface Section {
  id: string;
  /** Short label for the progress bar: Context, Problem, Research... */
  label: string;
  /** A first-person claim. Reading only these headlines tells the whole story. */
  headline: string;
  body: string[];
  media?: Media[];
  quotes?: { text: string; who: string }[];
  stats?: { value: string; text: string; source: string; href: string }[];
  /** Small titled points (features, decisions, learnings). */
  points?: { title: string; body: string }[];
}

export interface CaseStudy {
  slug: string;
  /** One-sentence claim under the title. */
  claim: string;
  meta: { role: string; team?: string; timeline: string; scope: string };
  link?: { label: string; href: string };
  hero?: Media;
  sections: Section[];
  next: string;
  /** Parts drafted or rewritten for Lucas to confirm. */
  draft: string[];
}
