import type { CaseStudy } from "./types";

/** NDA status unknown (PLAN 6.4): no invented content, an invitation instead. */
export const warframe: CaseStudy = {
  slug: "warframe",
  claim:
    "I design for Warframe at Digital Extremes. The work is not public yet, so this room is closed for now.",
  meta: {
    role: "Product designer, Digital Extremes",
    timeline: "September 2026 to present",
    scope: "Under wraps",
  },
  sections: [
    {
      id: "under-wraps",
      label: "Under wraps",
      headline: "I would rather show you this in person.",
      body: [
        "What I work on at Digital Extremes is not mine to publish yet. If you want to hear about it, how the team works, what I am learning about designing for millions of players, I am happy to talk.",
      ],
    },
  ],
  next: "shufflr",
  draft: ["NDA status", "whether any work can be shown"],
};
