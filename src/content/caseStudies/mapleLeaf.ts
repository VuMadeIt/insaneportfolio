import type { CaseStudy } from "./types";

/** Ported from the previous portfolio (mapleLeafContent.ts); headlines rewritten as claims. */
export const mapleLeaf: CaseStudy = {
  slug: "maple-leaf-foods",
  claim:
    "I digitised decades-old workflows that process millions of dollars and touch thousands of employees.",
  meta: {
    role: "Digital product manager (intern), design engineer",
    timeline: "Internship, 2026",
    scope: "Three internal products: requirements, user stories, testing, Figma, Power Apps",
  },
  hero: {
    video: "/media/maple-leaf/hero.mp4",
    poster: "/media/maple-leaf/hero.webp",
    alt: "Maple Leaf Foods internal apps",
    width: 1280,
    height: 694,
  },
  sections: [
    {
      id: "context",
      label: "Context",
      headline:
        "I worked on three fast-paced projects with one goal: get internal work out of emails and DMs.",
      body: [
        "Over the internship I moved between associate product manager and design engineer, depending on what each project needed.",
      ],
    },
    {
      id: "penalty-app",
      label: "Service penalty app",
      headline: "I led the Power App that now processes $14M+ in customer penalties a year.",
      body: [
        "Customer penalties were handled through email chains that took too long to process. Our app simplifies and speeds up the workflow so teams process more penalties in less time.",
        "As product manager I led requirements gathering, user stories and user testing across 4 agile sprints and 10+ product demos to 70+ users, including managers and directors.",
      ],
      media: [
        {
          image: "/media/maple-leaf/service-penalty-app.png",
          alt: "Service Penalty App dashboard on a desktop monitor",
          width: 1024,
          height: 683,
        },
      ],
    },
    {
      id: "market",
      label: "Maple Leaf Market",
      headline: "I helped launch the employee store and wrote the 50+ tests that kept checkout smooth.",
      body: [
        "An internal e-commerce site where employees buy products at a discount. I worked across WordPress and WooCommerce, designed user flows, documented SOPs and swimlane diagrams, and created 50+ UAT and SIT test cases.",
      ],
      media: [
        {
          image: "/media/maple-leaf/maple-leaf-market.png",
          alt: "Maple Leaf Market on mobile and desktop",
          width: 1024,
          height: 562,
        },
      ],
    },
    {
      id: "tracker",
      label: "Project tracker",
      headline: "I spotted a visibility gap, pitched a tracker, then designed and built it myself.",
      body: [
        "Projects were started and tracked informally in team DMs, so managers could not see the team's workload. I developed the concept, pitched it, designed it in Figma and built it in Power Apps, including automated weekly summaries for managers.",
      ],
      media: [
        {
          image: "/media/maple-leaf/project-tracking-app.png",
          alt: "Project Tracking and Reporting App on a desktop monitor",
          width: 954,
          height: 576,
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      headline:
        "I learned that internal tools are products too, and their users notice the last five percent.",
      body: [
        "DRAFT: Lucas to write. A short reflection on what shipping inside a large company taught you: demos to 70+ people, sprints, and owning a tool from pitch to build.",
      ],
    },
  ],
  next: "shufflr",
  draft: ["reflection section is a placeholder", "headlines rewritten as first-person claims"],
};
