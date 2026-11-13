import type { CaseStudy } from "./types";

/**
 * The updated portfolio's format (MapleLeafCaseStudy.tsx + mapleLeafContent.ts): an overview,
 * then one block per app with its image and text. Copy from that file; headlines are claims.
 */
export const mapleLeaf: CaseStudy = {
  slug: "maple-leaf-foods",
  accent: "#c8102e",
  accentSoft: "#f6d9dd",
  summary:
    "Over my internship at Maple Leaf Foods I worked on three separate, fast-paced design projects. The goal across all three was digitising workflows for internal staff, as either an associate product manager or a design engineer.",
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
  blocks: [
    {
      id: "overview",
      label: "Overview",
      headline:
        "I digitised decades-old workflows that process millions of dollars and touch thousands of employees.",
      body: [
        "Three projects, one aim: get internal work out of email chains and DMs and into tools people use.",
      ],
      visual: {
        kind: "stats",
        stats: [
          { value: "$14M+", text: "in customer penalties a year, processed by the Service Penalty App." },
          { value: "70+", text: "users, managers and directors at 10+ product demos across 4 sprints." },
          { value: "50+", text: "UAT and SIT test cases written for the Maple Leaf Market launch." },
        ],
      },
    },
    {
      id: "market",
      label: "Maple Leaf Market",
      headline: "I helped launch the employee store and wrote the 50+ tests that kept checkout smooth.",
      body: [
        "An internal e-commerce platform where employees buy products at discounted prices. I worked across WordPress and WooCommerce, designed user flows, documented SOPs and swimlane diagrams, and created 50+ UAT and SIT test cases.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/maple-leaf/maple-leaf-market.png",
            alt: "Maple Leaf Market on mobile and desktop",
            width: 1024,
            height: 562,
          },
        ],
      },
      caption: "Maple Leaf Market on mobile and desktop.",
    },
    {
      id: "tracker",
      label: "Project Tracking and Reporting App",
      headline: "I spotted a visibility gap, pitched a tracker, then designed and built it myself.",
      body: [
        "Projects were started and tracked informally in team DMs, so managers could not see the team's workload. I developed the concept, pitched it to Craig, and owned it end to end.",
        "I designed it in Figma and built it in Power Apps, including automated weekly summaries for managers.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/maple-leaf/project-tracking-app.png",
            alt: "Project Tracking and Reporting App on a desktop monitor",
            width: 954,
            height: 576,
          },
        ],
      },
      caption: "The tracker, built in Power Apps.",
    },
    {
      id: "penalty-app",
      label: "Service Penalty App",
      headline: "I led the Power App that now processes $14M+ in customer penalties a year.",
      body: [
        "Customer penalties were handled with email chains that took too long to process. Our app simplifies and speeds up the workflow, so teams process more penalties in less time.",
        "As product manager I led requirements gathering, user stories and user testing across 4 agile sprints and 10+ product demos to 70+ users, including managers and directors.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/maple-leaf/service-penalty-app.png",
            alt: "Service Penalty App dashboard on a desktop monitor",
            width: 1024,
            height: 683,
          },
        ],
      },
      caption: "The Service Penalty App dashboard.",
    },
  ],
  next: "passion-nails",
  draft: ["headlines rewritten as first-person claims", "a reflection, if Lucas wants one (none ships)"],
};
