import type { CaseStudy, Shot } from "./types";

/**
 * Hack Canada, end to end: the landing page (the team's FigJam research, sketches and flow, and the
 * live hackcanada.org) and the design system we founded for the hacker dashboard
 * (VuMadeIt/hackcanada-design-system and VuMadeIt/daedalus). "Before" dashboard screens are the
 * vibecoded upstream dashboard (Hack-Canada/daedalus 290d3ef) on demo data; "after" is our redesign.
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
      note: "The vibecoded dashboard we started from.",
      images: [desk(`before-${name}`, `${what} on the vibecoded dashboard, before our redesign`)],
    },
    {
      label: "After",
      note: "Our redesign, built on the design system.",
      images: [desk(`after-${name}`, `${what} on our redesigned dashboard`)],
    },
  ],
});

export const hackCanada: CaseStudy = {
  slug: "hack-canada",
  accent: "#1a6dbd",
  accentSoft: "#e3eefa",
  summary:
    "Hack Canada is a national hackathon. Over four months, our team of four designers made the landing page that sells the weekend to hackers and sponsors, then founded a design system from scratch and redesigned the hacker dashboard on it.",
  claim: "I led Hack Canada's landing page and the design system we founded for its dashboard.",
  meta: {
    role: "Design lead and design engineer",
    team: "Four designers, with the visual design and software teams",
    timeline: "4 months",
    scope: "Research, landing page, design system, dashboard",
    outcome: "Live site, library and dashboard",
  },
  link: { label: "Visit hackcanada.org", href: "https://hackcanada.org" },
  links: [
    { label: "Try the design system", href: "https://hackcanada-design-system.vercel.app" },
    { label: "Try the dashboard demo", href: "https://hackcanada-dashboard.vercel.app" },
  ],
  hero: {
    video: `${M}/landing.mp4`,
    poster: `${M}/landing.webp`,
    alt: "The Hack Canada landing page scrolling from the beach to the sea floor",
    width: 1376,
    height: 960,
  },
  blocks: [
    {
      id: "brief",
      label: "The brief",
      headline: "We needed a front door and a home base that look like one product.",
      body: [
        "The landing page convinces people to come. The dashboard runs their weekend: applying, checking in, earning and spending points. Neither had a design behind it, so we designed both from scratch.",
      ],
      visual: {
        kind: "brief",
        prompt:
          "How might one hackathon look and work the same from the first visit to the last prize, for hackers, sponsors and organizers?",
        facts: [
          { label: "Users", value: "Hackers, sponsors, organizers" },
          { label: "Team", value: "4 designers" },
          { label: "Timeline", value: "4 months" },
          { label: "Surfaces", value: "Landing page, dashboard" },
          { label: "Shipped", value: "Live site, design system, dashboard" },
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
      id: "sponsor-brief",
      label: "Sponsors",
      headline: "I wrote the sponsor into the brief as a second user.",
      body: [
        "Sponsors decide whether to pay for the weekend. They need proof before they read a single word: how many hackers came, what they built, who they are and who already backs it.",
      ],
    },
    {
      id: "competitors",
      label: "Research",
      headline: "We pulled apart three hackathon sites before drawing anything.",
      body: [
        "Each of us filled the same board of likes and dislikes for JAMHacks, Hack the North and HackHERS. Then we sorted the notes into what we'd take.",
      ],
      visual: {
        kind: "notes",
        columns: [
          {
            title: "JAMHacks",
            colour: "#a8d8fb",
            image: {
              src: `${M}/site-jamhacks.webp`,
              alt: "The JAMHacks site: a hand-drawn jar mascot on a blue sky with stars and a balloon",
            },
            notes: [
              "Interactive details, like clouds that move when you click them.",
              "A floating cat that blinks and wags its tail.",
              "Sponsor logos at a sensible size, not giant posters.",
              "Cluttered, with rough jumps between backgrounds.",
            ],
          },
          {
            title: "Hack the North",
            colour: "#d4bffc",
            image: {
              src: `${M}/site-htn.webp`,
              alt: "The Hack the North site: an illustrated map with objects on a wooden table",
            },
            notes: [
              "Far less cluttered, with real photos of the event.",
              "Flowers that keep growing as you scroll.",
              "Music adds to the experience.",
              "Sponsor text is squished at the bottom.",
            ],
          },
          {
            title: "HackHERS",
            colour: "#ffb8a6",
            image: {
              src: `${M}/site-hackhers.webp`,
              alt: "The HackHERS site: a night sky with clouds, a moon and a flying dragon",
            },
            notes: [
              "Looks official and legitimate.",
              "Photos in a camera roll, and a rare loading screen.",
              "Clean boxes separate the content.",
              "Backgrounds stand alone and carry no information.",
            ],
          },
          {
            title: "What we took",
            colour: "#b3f0bc",
            notes: [
              "One theme, carried through every section.",
              "Real photos and projects from last year.",
              "Room for every sponsor logo, by tier.",
              "Backgrounds that hold the content, not just sit behind it.",
            ],
          },
        ],
      },
    },
    {
      id: "sketches",
      label: "Leadership",
      headline: "I ran our work sessions: brainstorm together, sketch alone, then combine.",
      body: [
        "We brainstormed Nova Scotia together: coast, lighthouses, docks, the sea. Everyone sketched two or three sections of how the site should feel, we voted, merged the strongest ideas, and each designer took the sections they were best at.",
      ],
      visual: {
        kind: "mosaic",
        media: [
          {
            image: `${M}/lofi-lighthouse.webp`,
            alt: "Sketch: a lighthouse whose beam lights up text, with notes on why it fails on phones",
            width: 1200,
            height: 786,
          },
          {
            image: `${M}/lofi-scroll.webp`,
            alt: "Lo-fi flow: the lighthouse hero winding down a river to the team section",
            width: 900,
            height: 1918,
          },
          {
            image: `${M}/lofi-moodboard.webp`,
            alt: "Mood board: a pixel art lighthouse at sunset and a pond under a waterfall",
            width: 816,
            height: 520,
          },
          {
            image: `${M}/lofi-hero.webp`,
            alt: "Lo-fi wireframe: the hero with the date, Register, fact cards that tilt on hover and a lighthouse",
            width: 1200,
            height: 1194,
          },
          {
            image: `${M}/lofi-footprints.webp`,
            alt: "Sketch: words written as beaver footprints in the sand, washed away by waves",
            width: 1200,
            height: 810,
          },
          {
            image: `${M}/lofi-paper.webp`,
            alt: "Paper sketch: the hero with the lighthouse and Apply, then Meet the team",
            width: 900,
            height: 1583,
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
      id: "sponsor-proof",
      label: "For sponsors",
      headline: "I gave each sponsor question its own answer on the page.",
      body: [
        "Below the hero, the page turns into proof: 800+ hackers, 210+ projects in 36 hours, 20+ sponsors and 10K+ in prizes last year. Sponsors pass it on the way down to their own logo wall.",
      ],
      visual: {
        kind: "cards",
        cards: [
          {
            title: "What they build",
            body: "Real projects with their teams, like Wallhacks, which sees people through walls.",
            image: {
              src: `${M}/proof-projects.webp`,
              alt: "Get inspired: the Wallhacks project and its team on a driftwood sign, with two photos of the demo",
              width: 1200,
              height: 937,
            },
          },
          {
            title: "Who they are",
            body: "Photos from last year, framed in sandcastles along the beach.",
            image: {
              src: `${M}/proof-photos.webp`,
              alt: "Photos of last year's hackers in sandcastle frames on the beach",
              width: 960,
              height: 600,
            },
          },
          {
            title: "Who backs it",
            body: "Logos by tier, each with room to breathe, unlike the squished walls we saw.",
            image: {
              src: `${M}/proof-sponsors.webp`,
              alt: "The sponsor wall under the sea: Squarepoint, Tailscale and Photon in Silver, then Reality Defender, Taste Labs, ElevenLabs and Render in Bronze",
              width: 1200,
              height: 1041,
            },
          },
        ],
      },
    },
    {
      id: "sponsor-flow",
      label: "Sponsor flow",
      headline: "I mapped a sponsor's scroll, from the first screen to their decision.",
      body: [
        "A sponsor never applies, so the page itself is their journey. Each stop answers one question, and the sponsor wall sits right after the proof.",
      ],
      visual: {
        kind: "diagram",
        cols: 6,
        minWidth: 1080,
        gap: "clamp(32px, 3vw, 64px)",
        nodes: [
          {
            id: "o",
            text: "Opens the site",
            sub: "Date and place, first screen",
            col: 0,
            row: 0,
            tone: "ink",
          },
          { id: "n", text: "Last year", sub: "800+ hackers, 210+ projects", col: 1, row: 0, tone: "white" },
          { id: "p", text: "Get inspired", sub: "What hackers built", col: 2, row: 0, tone: "white" },
          { id: "f", text: "Photos", sub: "Who the hackers are", col: 3, row: 0, tone: "white" },
          { id: "w", text: "Sponsor wall", sub: "Who backs it, by tier", col: 4, row: 0, tone: "white" },
          { id: "d", text: "Decides", sub: "Reaches out to the team", col: 5, row: 0, tone: "accent" },
        ],
        edges: [
          { from: "o", to: "n" },
          { from: "n", to: "p" },
          { from: "p", to: "f" },
          { from: "f", to: "w" },
          { from: "w", to: "d" },
        ],
      },
    },
    {
      id: "journey",
      label: "Hacker flow",
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
      headline: "The dashboard was vibecoded, so we redesigned it from scratch.",
      body: [
        "It ran, but nothing was designed: there was no Figma file, and every page picked its own colours, cards and spacing. There was nothing to fix, so we started over.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/before-home.webp`,
            alt: "The vibecoded dashboard home: dark cards with emoji titles and mixed button styles",
            width: 1440,
            height: 900,
          },
          {
            image: `${M}/before-store.webp`,
            alt: "The vibecoded dashboard store: prize cards with placeholder icons",
            width: 1440,
            height: 900,
          },
        ],
      },
      caption: "The dashboard before our redesign, on demo data.",
    },
    {
      id: "system",
      label: "Design system",
      headline: "So we founded a design system from scratch, in light and dark.",
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
      label: "Rule of 8",
      headline: "I put everything on a rule of 8, and a script enforces it.",
      body: [
        "Every size is a multiple of 8, with 4 as the only half step. The check fails the build if anything drifts, so the vibecoded mess can't creep back.",
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
      id: "empty",
      label: "UX principle",
      headline: "I made every empty screen say what to do next.",
      body: [
        "A new hacker sees a lot of empty lists: no bets, no points, no challenges yet. The empty state gives each one a beaver, a plain title and one next step, never a blank page that says \u201cNo data\u201d.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-empty.webp`,
            alt: "Do: No bets yet, pick a market to start, with a beaver. Don't: a blank box that only says No data",
            width: 1200,
            height: 391,
          },
        ],
      },
    },
    {
      id: "agents",
      label: "For AI agents",
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
      id: "colour",
      label: "Accessibility",
      headline: "I gave blue the work, saved gold for rewards, and checked contrast.",
      body: [
        "Blue is for actions and links. Gold only appears where hackers earn something. I darkened the brand blue from #1c74c9 to #1a6dbd so small labels pass 4.5:1, with a 2 px focus ring and 44 px touch targets.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `${M}/ds-color-light.webp`,
            alt: "The design system's colour page with roles and contrast",
            width: 1440,
            height: 900,
          },
        ],
      },
    },
    {
      id: "challenge-flow",
      label: "Dashboard flow",
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
      label: "Redesign",
      headline: "Then we rebuilt every dashboard page on it.",
      body: [
        "Challenges, the store, Bet Points and the mini games now share one set of parts. Points are always gold and the action is always the same blue button.",
      ],
      visual: pair("challenges", "Challenges"),
    },
    {
      id: "try",
      label: "Try it",
      headline: "We built much more than fits here, so try it yourself.",
      body: ["All three are live. The dashboard demo runs on test data, so click anything."],
      visual: {
        kind: "links",
        links: [
          {
            title: "Landing page",
            body: "Scroll from the lighthouse to the sea floor.",
            href: "https://hackcanada.org",
            cta: "Open hackcanada.org",
            image: { src: `${M}/landing.webp`, alt: "The Hack Canada landing page hero with the lighthouse" },
          },
          {
            title: "Design system",
            body: "Every component, with live demos, specs and rules, in light and dark.",
            href: "https://hackcanada-design-system.vercel.app",
            cta: "Open the design system",
            image: { src: `${M}/ds-home-light.webp`, alt: "The design system's home page" },
          },
          {
            title: "Dashboard demo",
            body: "Log in as lucas@test.dev with the password beaver-8d3ac3, then start a challenge or redeem a prize.",
            href: "https://hackcanada-dashboard.vercel.app/sign-in",
            cta: "Open the demo",
            image: { src: `${M}/after-home.webp`, alt: "The redesigned dashboard home" },
          },
        ],
      },
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "We now have the site, the library and the dashboard live, and matching.",
      body: ["One brand from the first visit to the last prize, in light and dark."],
      visual: {
        kind: "stats",
        stats: [
          { value: "4", text: "designers in 4 months, each owning sections of the coast." },
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
        "Giving each designer sections kept four of us on one story. Rules in a doc drifted within a day; the spacing and contrast checks held. Next time I'd bring developers into the first critique.",
      ],
    },
  ],
  next: "ripple",
  draft: ["sponsor flow steps", "competitor notes, condensed from the FigJam boards", "public demo login"],
};
