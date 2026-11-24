import type { CaseStudy, Shot } from "./types";

/**
 * Hack Canada, end to end: the landing page (the team's FigJam research, sketches and flow, and the
 * live hackcanada.org) and the design system the hacker dashboard runs on (the original Figma file,
 * VuMadeIt/hackcanada-design-system and VuMadeIt/daedalus). The card animation is Fay Wu's, made for
 * the organization. Every "after" dashboard screen is a real build on test data.
 */
const M = "/media/hack-canada";
const desk = (name: string, alt: string): Shot => ({
  src: `${M}/${name}.webp`,
  alt,
  width: 1440,
  height: 900,
});
const phone = (name: string, alt: string): Shot => ({
  src: `${M}/${name}.webp`,
  alt,
  width: 780,
  height: 1688,
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
    "Hack Canada is a national hackathon. I led the landing page that sells the weekend to hackers and sponsors, then built the design system the hacker dashboard runs on, so both feel like one product.",
  claim: "I led Hack Canada's landing page and built the design system its dashboard runs on.",
  meta: {
    role: "Design lead and design engineer",
    team: "Six designers, the visual design and software teams. Animation by Fay Wu.",
    timeline: "2026",
    scope: "Research, landing page, design system, dashboard",
    outcome: "Live site, library and dashboard",
  },
  link: { label: "Visit hackcanada.org", href: "https://hackcanada.org" },
  links: [{ label: "Try the library", href: "https://hackcanada-design-system.vercel.app" }],
  hero: {
    video: `${M}/landing.mp4`,
    poster: `${M}/landing.webp`,
    alt: "The Hack Canada landing page scrolling from the beach to the sea floor, animated by Fay Wu",
    width: 918,
    height: 640,
  },
  blocks: [
    {
      id: "brief",
      label: "The brief",
      headline: "We needed a front door and a home base that look like one product.",
      body: [
        "The landing page convinces people to come. The dashboard runs their weekend: applying, checking in, earning and spending points. I led design on the first and built the system under the second.",
      ],
      visual: {
        kind: "brief",
        prompt:
          "How might one hackathon look and work the same from the first visit to the last prize, for hackers, sponsors and organizers?",
        facts: [
          { label: "Users", value: "Hackers, sponsors, organizers" },
          { label: "Team", value: "6 designers I led" },
          { label: "Surfaces", value: "Landing page, dashboard" },
          { label: "Shipped", value: "Live site and 35-component library" },
        ],
      },
    },
    {
      id: "users",
      label: "Users",
      headline: "We had one page to convince two very different people.",
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
        "Each of us filled the same grid for JAMHacks 10, Hack the North 2025 and HackHERS 2026. The weak spots were clutter, squished sponsor logos and backgrounds that stand alone.",
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
      id: "sketches",
      label: "Leadership",
      headline: "I set week one's homework: sketch how the site feels, not how it looks.",
      body: [
        "We took the theme from Nova Scotia: coast, lighthouses, docks, the sea. Everyone sketched two or three sections, we voted, combined the strongest ideas, and each designer took the sections they were best at.",
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
      id: "lighthouse",
      label: "Design decision",
      headline: "We kept the lighthouse and dropped its trick.",
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
      id: "ia",
      label: "Information architecture",
      headline: "We made the scroll a trip from the sky to the sea floor.",
      body: [
        "Each section is a place with an owner. Sponsors sit at the surface, right after last year's numbers, where they're seen.",
      ],
      visual: {
        kind: "diagram",
        cols: 7,
        nodes: [
          { id: "h", text: "Hero", sub: "Lighthouse", col: 0, row: 0, tone: "accent" },
          { id: "a", text: "About", sub: "Beach", col: 1, row: 0, tone: "white" },
          { id: "l", text: "Last year", sub: "Fishing dock", col: 2, row: 0, tone: "white" },
          { id: "s", text: "Sponsors", sub: "Underwater", col: 3, row: 0, tone: "white" },
          { id: "f", text: "FAQ", sub: "Sea floor", col: 4, row: 0, tone: "white" },
          { id: "t", text: "Team", sub: "Treasure chest", col: 5, row: 0, tone: "white" },
          { id: "o", text: "Footer", sub: "Sand and crabs", col: 6, row: 0, tone: "white" },
        ],
        edges: [
          { from: "h", to: "a" },
          { from: "a", to: "l" },
          { from: "l", to: "s" },
          { from: "s", to: "f" },
          { from: "f", to: "t" },
          { from: "t", to: "o" },
        ],
        gap: "32px",
        minWidth: 1000,
      },
    },
    {
      id: "live",
      label: "The landing page",
      headline: "We shipped it with the date, place and Apply in the first screen.",
      body: [
        "Experienced hackers get what they came for without scrolling. New hackers and sponsors keep going down the coast to the stories and the numbers.",
      ],
      visual: {
        kind: "switch",
        label: "Device",
        options: [
          {
            label: "Desktop",
            note: "hackcanada.org, live.",
            images: [
              desk("live-hero", "The live landing page: lighthouse, date, place and the Apply button"),
              desk("live-stats", "Last year's numbers as sea creatures: prizes, sponsors, projects, hackers"),
            ],
          },
          {
            label: "Phone",
            note: "The same page at 390 px.",
            images: [
              phone("live-m-hero", "The landing page on a phone: the hero and About"),
              phone("live-m-2", "The landing page on a phone, further down the beach"),
            ],
          },
        ],
      },
    },
    {
      id: "journey",
      label: "User flow",
      headline: "I mapped the hacker's whole weekend, from the landing page to prizes.",
      body: [
        "The landing page hands off to the dashboard at Apply. From there every step earns or spends points, so the dashboard had to make points and actions impossible to confuse.",
      ],
      visual: {
        kind: "diagram",
        cols: 5,
        minWidth: 960,
        rowGap: 40,
        gap: "clamp(48px, 5vw, 96px)",
        nodes: [
          {
            id: "l",
            text: "Lands on the site",
            sub: "hackcanada.org",
            col: 0,
            row: 0,
            rowSpan: 2,
            tone: "ink",
          },
          {
            id: "a",
            text: "Applies",
            sub: "then RSVPs once accepted",
            col: 1,
            row: 0,
            rowSpan: 2,
            tone: "white",
          },
          {
            id: "c",
            text: "Checks in",
            sub: "shows a QR at the door",
            col: 2,
            row: 0,
            rowSpan: 2,
            tone: "white",
          },
          {
            id: "e",
            text: "Earns points",
            sub: "challenges and mini games",
            col: 3,
            row: 0,
            rowSpan: 2,
            tone: "white",
          },
          { id: "s", text: "Store", sub: "redeems a prize", col: 4, row: 0, tone: "accent" },
          { id: "b", text: "Bet Points", sub: "backs a team to win", col: 4, row: 1, tone: "white" },
        ],
        edges: [
          { from: "l", to: "a" },
          { from: "a", to: "c" },
          { from: "c", to: "e" },
          { from: "e", to: "s" },
          { from: "e", to: "b" },
        ],
      },
    },
    {
      id: "problem",
      label: "The dashboard",
      headline: "I inherited the dashboard as one Figma file with no rules behind it.",
      body: [
        "Every screen had its own spacing, the buttons were coral on cream, and the copy was still lorem ipsum. Engineers had to guess every value.",
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
      id: "system",
      label: "Design system",
      headline: "So I built one library for every screen, in light and dark.",
      body: [
        "35 components, tokens and motion on one docs site, each with a live preview, the code and its rules. It sits on Meta's open source Astryx, so focus states and keyboard support came tested.",
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
        "The Figma styles used line heights like 75.6 and 18.9. I moved every size to a multiple of 8, with 4 as the only half step. The check fails the build if anything drifts.",
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
      label: "Accessibility",
      headline: "I gave blue the work, saved gold for rewards, and checked contrast.",
      body: [
        "Blue is for actions and links. Gold only appears where hackers earn something. I darkened the brand blue from #1c74c9 to #1a6dbd so small labels pass 4.5:1, with a 2 px focus ring and 44 px touch targets.",
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
        "We read left to right, so the action you came for is the first thing you hit, then the safe way out. On phones, dialog buttons stack with the main one under the thumb.",
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
    },
    {
      id: "agents",
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
      id: "challenge-flow",
      label: "User flow",
      headline: "I designed a challenge as one hand-off between hacker and organizer.",
      body: ["No codes to type. The hacker shows a QR, an organizer scans it, and the points land in gold."],
      visual: {
        kind: "diagram",
        cols: 5,
        minWidth: 960,
        rowGap: 40,
        gap: "clamp(40px, 4vw, 80px)",
        nodes: [
          { id: "h1", text: "Starts a challenge", sub: "Hacker", col: 0, row: 0, tone: "white" },
          { id: "h2", text: "Shows a QR code", sub: "Hacker", col: 1, row: 0, tone: "white" },
          { id: "o1", text: "Scans it", sub: "Organizer", col: 2, row: 1, tone: "plain" },
          { id: "o2", text: "Confirms the points", sub: "Organizer", col: 3, row: 1, tone: "plain" },
          { id: "h3", text: "Sees +40 land", sub: "Hacker", col: 4, row: 0, tone: "accent" },
        ],
        edges: [
          { from: "h1", to: "h2" },
          { from: "h2", to: "o1" },
          { from: "o1", to: "o2" },
          { from: "o2", to: "h3" },
        ],
      },
    },
    {
      id: "applied",
      label: "In use",
      headline: "Then I moved the hacker dashboard onto it.",
      body: [
        "Challenges, the store, Bet Points and the mini games share one set of parts. Each category used to have its own loud colour; now points are gold and the action is always the same blue button.",
      ],
      visual: pair("challenges", "Challenges"),
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "We now have the site, the library and the dashboard live, and matching.",
      body: ["One brand from the first visit to the last prize, in light and dark."],
      visual: {
        kind: "stats",
        stats: [
          { value: "6", text: "designers, each owning a section of the coast." },
          { value: "35", text: "components in light and dark, checked by a script." },
          { value: "23", text: "dashboard pages that fit a phone with no sideways scroll." },
        ],
      },
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "I learned owners keep a team together and checks keep a system together.",
      body: [
        "Giving each designer a section kept six people on one story. Rules in a doc drifted within a day; the spacing and contrast checks held. Next time I'd bring developers into the first critique.",
      ],
    },
  ],
  next: "ripple",
  draft: ["team list and section owners", "timeline", "Fay Wu credit wording"],
};
