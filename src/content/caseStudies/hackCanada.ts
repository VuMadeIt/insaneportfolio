import type { CaseStudy, Shot } from "./types";

/**
 * Hack Canada, the design system and the hacker dashboard. Sources: the original Figma file
 * ("hacker dashboard !!"), the live dashboard before the redesign, VuMadeIt/daedalus (the new
 * dashboard) and VuMadeIt/hackcanada-design-system (the library). Kept short on purpose: the
 * key decisions, then the dashboard that runs on it. Every "after" screen is a real build on test data.
 */
const M = "/media/hack-canada";
const desk = (name: string, alt: string): Shot => ({
  src: `${M}/${name}.webp`,
  alt,
  width: 1440,
  height: 900,
});
const pair = (name: string, what: string) => ({
  kind: "switch" as const,
  label: what,
  options: [
    {
      label: "Before",
      note: "The original Figma file.",
      images: [desk(`before-${name}`, `${what} in the original Figma file`)],
    },
    {
      label: "After",
      note: "The live dashboard, built on the library.",
      images: [desk(`after-${name}`, `${what} on the new dashboard`)],
    },
  ],
});

export const hackCanada: CaseStudy = {
  slug: "hack-canada",
  accent: "#1a6dbd",
  accentSoft: "#e3eefa",
  summary:
    "Hack Canada is a national hackathon. I turned its one-off Figma file into a design system: 35 components in light and dark, with rules a script checks. The hacker dashboard now runs on it.",
  claim: "I turned a one-off Figma file into a 35-component library that the Hack Canada dashboard runs on.",
  meta: {
    role: "Design lead and design engineer",
    team: "Hack Canada design and software teams",
    timeline: "2026",
    scope: "Design system, docs site, dashboard rollout",
    outcome: "Live library and dashboard",
  },
  link: { label: "Try the library", href: "https://hackcanada-design-system.vercel.app" },
  tabs: [
    { label: "Design system", slug: "hack-canada" },
    { label: "Landing page", slug: "hack-canada-landing" },
  ],
  hero: {
    image: `${M}/ds-home-light.webp`,
    alt: "Hack Canada's Library: the home page, with live component previews",
    width: 1440,
    height: 900,
  },
  blocks: [
    {
      id: "problem",
      label: "The problem",
      headline: "We started from one Figma file with no rules behind it.",
      body: [
        "Every screen had its own spacing, the buttons were coral on cream, and the copy was still lorem ipsum. Engineers had to guess every value, so each page drifted a little further from the next.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/before-challenges.webp`,
            alt: "Challenges in the original Figma file",
            width: 1440,
            height: 900,
          },
          {
            image: `${M}/before-bets.webp`,
            alt: "A bet in the original Figma file, with placeholder copy",
            width: 1440,
            height: 900,
          },
        ],
      },
      caption: "Two screens from the original file.",
    },
    {
      id: "result",
      label: "The result",
      headline: "Now one library I built feeds every screen, in light and dark.",
      body: [
        "35 components, tokens and motion, documented on one site. Each component page has a live preview, a Light & dark tab, the code, and the rules for using it.",
      ],
      visual: {
        kind: "switch",
        label: "Theme",
        options: [
          {
            label: "Light",
            note: "The Button page.",
            images: [desk("ds-button-light", "The Button page in light mode")],
          },
          {
            label: "Dark",
            note: "The same page in dark mode.",
            images: [desk("ds-button-night", "The Button page in dark mode")],
          },
        ],
      },
    },
    {
      id: "spacing",
      label: "Design decision",
      headline: "I put everything on a rule of 8, and a script enforces it.",
      body: [
        "The Figma styles used line heights like 75.6 and 18.9, which can't sit on any grid. I moved every size to a multiple of 8, with 4 as the only half step. The check script fails the build if anything drifts.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-spacing-light.webp`,
            alt: "The spacing page: the rule of 8 with measured examples",
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    {
      id: "colour",
      label: "Design decision",
      headline: "I gave blue the work and saved gold for rewards.",
      body: [
        "Blue is for actions and links. Gold only appears where hackers earn something: points, prizes, wins. I darkened the brand blue from #1c74c9 to #1a6dbd so small labels pass 4.5:1.",
      ],
      visual: {
        kind: "switch",
        label: "Colour",
        options: [
          {
            label: "Before",
            note: "The original colour styles.",
            images: [
              {
                src: `${M}/ds-before-colors.webp`,
                alt: "The original Figma colour styles, generic defaults",
                width: 1088,
                height: 1360,
              },
            ],
          },
          {
            label: "After",
            note: "Colour roles in the library.",
            images: [desk("ds-color-light", "The library's colour page with roles and contrast")],
          },
        ],
      },
    },
    {
      id: "cta",
      label: "Design decision",
      headline: "I put the main button first, on the left, every time.",
      body: [
        "We read left to right, so the action you came for is the first thing you hit, then the safe way out. On phones, dialog buttons stack with the main one at the bottom, under the thumb.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-cta-dialog.webp`,
            alt: "A Redeem dialog with the blue Redeem button before Cancel",
            width: 579,
            height: 327,
          },
        ],
      },
      caption: "The rule, as the library shows it.",
    },
    {
      id: "build",
      label: "Design decision",
      headline: "I built on an open source system instead of drawing my own primitives.",
      body: [
        "The base is Meta's Astryx (MIT), themed with Hack Canada's blue, gold, Satoshi and the beaver. That bought tested focus states and keyboard support, so my time went into the parts only Hack Canada has.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-catalog-light.webp`,
            alt: "The component catalogue with live previews",
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    {
      id: "claude",
      label: "Design decision",
      headline: "I wrote the library for AI agents as much as for people.",
      body: [
        "Hackers build with Claude, Codex and Gemini. An AGENTS.md gives them the rule of 8, the colour roles and the button order, so a generated screen still looks like Hack Canada.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-claude-light.webp`,
            alt: "The library's page for AI agents",
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    {
      id: "applied",
      label: "In use",
      headline: "Then I moved the hacker dashboard onto it.",
      body: [
        "Challenges, the points store, Bet Points and the mini games now share one set of parts. Each category used to have its own loud colour; now points are gold and the action is always the same blue button.",
      ],
      visual: pair("challenges", "Challenges"),
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "I learned a design system is only real when something checks it.",
      body: [
        "Rules in a doc drifted within a day. The spacing script and the contrast checks held. Next time I'd write the checks first and design inside them.",
      ],
    },
  ],
  next: "ripple",
  draft: ["role, team and timeline", "outcome line"],
};
