import type { CaseStudy } from "./types";

/**
 * Hack Canada's landing page, from the team's FigJam (research boards, the competitor grid, Week 1
 * homework, sketches and the final flow with owners) and Fay Wu's animation of the built page.
 */
const M = "/media/hack-canada";

export const hackCanadaLanding: CaseStudy = {
  slug: "hack-canada-landing",
  accent: "#1a6dbd",
  accentSoft: "#e3eefa",
  summary:
    "The landing page is the first thing hackers and sponsors see of Hack Canada. I led a team of six designers from a blank FigJam to one Nova Scotia story, from a lighthouse at the top to a treasure chest on the sea floor, with every section owned by someone.",
  claim:
    "I led six designers from research to one scrolling Nova Scotia story that works for hackers and sponsors.",
  meta: {
    role: "Design lead",
    team: "Arvin, Ariana, Ishan, Enya, Kaley, Emma, with the visual design and software teams. Animation by Fay Wu.",
    timeline: "2026",
    scope: "Research, competitor analysis, direction, section ownership",
  },
  tabs: [
    { label: "Design system", slug: "hack-canada" },
    { label: "Landing page", slug: "hack-canada-landing" },
  ],
  hero: {
    video: `${M}/landing.mp4`,
    poster: `${M}/landing.webp`,
    alt: "The Hack Canada landing page scrolling from the beach to the sea floor, animated by Fay Wu",
    width: 918,
    height: 640,
  },
  blocks: [
    {
      id: "audiences",
      label: "The problem",
      headline: "One page had to convince two very different people.",
      body: [
        "A hacker deciding whether to come, and a sponsor deciding whether to pay for it. They scan for different things.",
      ],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "New hacker",
            tone: "plain",
            items: ["What does the weekend actually look like?", "Photos, stories, last year's projects."],
          },
          {
            title: "Experienced hacker",
            tone: "plain",
            items: ["Date, location, prizes and sponsors, fast.", "Register without scrolling."],
          },
          {
            title: "Sponsor",
            tone: "accent",
            items: ["Who shows up, and how many.", "Who else sponsors, and where their logo lands."],
          },
        ],
      },
    },
    {
      id: "competitors",
      label: "Research",
      headline: "We pulled apart three hackathon sites before drawing anything.",
      body: [
        "Each of us filled the same grid for JAMHacks 10, Hack the North 2025 and HackHERS 2026. Most go hand-drawn and colourful. The weak spots were clutter, squished sponsor logos and backgrounds that stand alone.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/competitors.webp`,
            alt: "The FigJam competitor grid: one row per teammate, columns for each site and overall themes",
            width: 1600,
            height: 1151,
          },
        ],
      },
    },
    {
      id: "theme",
      label: "Research",
      headline: "Nova Scotia gave us the theme: coast, lighthouses, docks, the sea.",
      body: [
        "We pinned painted references and wrote what the province means to us. The VPs settled on a hand-painted, mostly static background, with SVG for the parts that move.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/research.webp`,
            alt: "FigJam boards: the beaver character sheet, Nova Scotia references and inspiration sites",
            width: 1600,
            height: 849,
          },
        ],
      },
    },
    {
      id: "homework",
      label: "Leadership",
      headline: "I set the first week's homework: sketch how the site feels, not how it looks.",
      body: [
        "Everyone brought rough concepts for two or three sections. No polish. We presented, voted, combined the strongest ideas, and ownership went by interest and strength.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/sketches.webp`,
            alt: "Hand sketches: the lighthouse idea, footprints in the sand and a paper flow from hero to sponsors",
            width: 1600,
            height: 1046,
          },
        ],
      },
    },
    {
      id: "decision",
      label: "Design decision",
      headline: "The lighthouse idea lost its trick and kept its place.",
      body: [
        "A beam that lights up text in the dark looked great and failed on phones, where there's no hover and the text hid. The lighthouse stayed as the hero, and the beam became decoration.",
      ],
      visual: {
        kind: "options",
        options: [
          {
            title: "Beam reveals the text",
            pros: ["Memorable"],
            cons: ["Text hidden by default", "No hover on phones"],
          },
          {
            title: "Footprints in the sand",
            pros: ["Playful, on theme"],
            cons: ["Waves wash the words away"],
          },
          {
            title: "Lighthouse hero, one scroll down the coast",
            pros: ["Key info visible at once", "Works on phones"],
            cons: ["Less of a trick"],
            chosen: true,
          },
        ],
      },
    },
    {
      id: "flow",
      label: "The flow",
      headline: "The scroll is a trip from the sky to the sea floor.",
      body: ["Each section is a place, and each place has an owner."],
      visual: {
        kind: "diagram",
        cols: 7,
        nodes: [
          { id: "h", text: "Hero", sub: "Lighthouse, Ishan", col: 1, row: 1, tone: "accent" },
          { id: "a", text: "About", sub: "Beach, Arvin", col: 2, row: 1, tone: "white" },
          { id: "l", text: "Last year", sub: "Fishing dock, Ariana", col: 3, row: 1, tone: "white" },
          { id: "s", text: "Sponsors", sub: "Underwater, Arvin", col: 4, row: 1, tone: "white" },
          { id: "f", text: "FAQ", sub: "Sea floor, Ishan", col: 5, row: 1, tone: "white" },
          { id: "t", text: "Team", sub: "Treasure chest, Enya", col: 6, row: 1, tone: "white" },
          { id: "o", text: "Footer", sub: "Sand and crabs, Enya", col: 7, row: 1, tone: "white" },
        ],
        edges: [
          { from: "h", to: "a" },
          { from: "a", to: "l" },
          { from: "l", to: "s" },
          { from: "s", to: "f" },
          { from: "f", to: "t" },
          { from: "t", to: "o" },
        ],
        minWidth: 960,
      },
      caption: "Sponsors sit underwater, at the surface, where they're seen right after last year's numbers.",
    },
    {
      id: "map",
      label: "The flow",
      headline: "Then we mapped real content onto it.",
      body: [
        "Last year's stats, sponsors, judges and stories, placed where each audience would look for them.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/flow.webp`,
            alt: "The FigJam flow: sections in order, with last year's sponsor wall, judges and stats placed on it",
            width: 1400,
            height: 1040,
          },
        ],
      },
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "Ownership made six designers move like one.",
      body: [
        "Voting on concepts got everyone's best idea into the page. Giving each person a section of the coast kept it one story. Next time I'd bring developers into the first critique, not the second, so interactions are scoped before they're loved.",
      ],
    },
  ],
  next: "hack-canada",
  draft: ["team list and whether Kaley and Emma owned sections", "timeline", "Fay Wu credit wording"],
};
