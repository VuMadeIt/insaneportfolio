import type { CaseStudy, Shot } from "./types";

/**
 * Hack Canada, the design system and the hacker dashboard. Sources: the original Figma file
 * ("hacker dashboard !!"), the live dashboard before the redesign, VuMadeIt/daedalus (the new
 * dashboard), VuMadeIt/hackcanada-design-system (the library) and VuMadeIt/hackcanada-minigame
 * (Timber Tycoon). Every "after" screen is a real build on test data.
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
    "Hack Canada is a national hackathon. I rebuilt its hacker dashboard on a design system I made for it, with 35 components in light and dark, and added Beaver Games: challenges, a points store, Bet Points and two mini games for the time between prompts.",
  claim:
    "I turned a one-off Figma file into a 35-component library, then rebuilt Hack Canada's hacker dashboard and its games on it.",
  meta: {
    role: "Design lead and design engineer",
    team: "Hack Canada design and software teams",
    timeline: "2026",
    scope: "Design system, dashboard redesign, Beaver Games, front end",
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
      headline: "I wrote the library for Claude as much as for people.",
      body: [
        "An AGENTS.md holds the rule of 8, what each colour is for, type, contrast and motion. Claude, Codex and Gemini read it before they touch a screen, so generated pages still follow the system.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-m-home-light.webp`,
            alt: "The library home on a phone, light",
            width: 780,
            height: 1688,
          },
          {
            image: `${M}/ds-m-button-night.webp`,
            alt: "The Button page on a phone, dark",
            width: 780,
            height: 1688,
          },
        ],
      },
      caption: "Every page works on a phone, in both themes.",
    },
    {
      id: "challenges",
      label: "Dashboard",
      headline: "I made challenges read as a list of things to do, not a wall of colour.",
      body: [
        "Each category had its own loud colour. Now points sit in gold, and the action is always the same blue button.",
      ],
      visual: pair("challenges", "Challenges"),
    },
    {
      id: "store",
      label: "Dashboard",
      headline: "The store shows what's left, so we never sell out by surprise.",
      body: [
        "Stock is limited to about 30 of each prize and 50 candy bags. I rebalanced prices against what a hacker can earn in a weekend, and photos sit on white so every product reads at the same size.",
      ],
      visual: pair("store", "The store"),
    },
    {
      id: "bets",
      label: "Beaver Games",
      headline: "With Bet Points, we turned the weekend into something to watch.",
      body: [
        "Hackers bet points on yes or no questions about the event. Payouts shift as others bet, and winners split the pool.",
      ],
      visual: pair("bets", "Bet Points"),
    },
    {
      id: "games",
      label: "Beaver Games",
      headline: "We made two mini games for the minutes between prompts.",
      body: [
        "Hackers wait on AI tools all weekend. Timber Tycoon is an idle game you can leave and come back to. Cup Shuffle is a quick bet with a daily limit, so it never takes over the weekend.",
      ],
      visual: pair("games", "Mini games"),
    },
    {
      id: "timber",
      label: "Beaver Games",
      headline: "Timber Tycoon rewards coming back, and we keep it fair on the server.",
      body: [
        "Chop trees, sell wood, upgrade the axe. Saves and rewards live on the server with cheat checks, because points here buy real prizes.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/timber-title.webp`,
            alt: "Timber Tycoon's papercut title card: a beaver with an axe",
            width: 960,
            height: 640,
          },
          {
            image: `${M}/timber-play.webp`,
            alt: "Timber Tycoon in the dashboard: the tree, stats and shop",
            width: 1440,
            height: 900,
          },
        ],
      },
      caption: "I picked the papercut title card from six directions.",
    },
    {
      id: "flow",
      label: "User flow",
      headline: "We tied every game to the same loop.",
      body: ["Earn points from challenges, grow them in games and bets, spend them in the store."],
      visual: {
        kind: "diagram",
        cols: 4,
        nodes: [
          { id: "c", text: "Challenges", sub: "earn points", col: 0, row: 0, tone: "white" },
          { id: "g", text: "Mini games", sub: "grow them", col: 1, row: 0, tone: "white" },
          { id: "b", text: "Bet Points", sub: "risk them", col: 2, row: 0, tone: "white" },
          { id: "s", text: "Store", sub: "spend them", col: 3, row: 0, tone: "accent" },
        ],
        edges: [
          { from: "c", to: "g" },
          { from: "g", to: "b" },
          { from: "b", to: "s" },
        ],
      },
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
  next: "passion-nails",
  draft: ["role, team and timeline", "outcome line", "store and game numbers from the live config"],
};
