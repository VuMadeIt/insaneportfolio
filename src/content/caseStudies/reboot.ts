import type { CaseStudy } from "./types";

/**
 * Reboot, adapted from my Framer case study (lucasvu.framer.website/projects/reboot) into the house
 * rhythm (PLAN 13.6, 14.6): the problem, the survey and its insights, the question, then the
 * product page by page and what sets it apart. Every number is from our survey of 83 Waterloo
 * engineering students, except the e-waste figure, which carries its source.
 */
export const reboot: CaseStudy = {
  slug: "reboot",
  accent: "#3552d4",
  accentSoft: "#dde3fa",
  summary:
    "Reboot is a marketplace that redistributes retired data centre hardware to reduce e-waste and make high-performance computing accessible. Hardware is sorted by what you can build with it, every part shows where it came from, and a project builder takes you from parts to a working build.",
  claim:
    "We designed a marketplace that gives retired data centre hardware to students who want to build with it.",
  meta: {
    role: "Product manager and designer",
    team: "Jenny Yang, Kelly M, Lucas Vu",
    timeline: "UofT UDesignathon, March 2026",
    scope: "Survey research, product strategy, product design in Figma",
    outcome: "3rd place",
  },
  hero: {
    video: "/media/work/reboot.mp4",
    poster: "/media/work/reboot.webp",
    alt: "Reboot's home page: hardware sorted by what you want to build",
    width: 1474,
    height: 1060,
  },
  blocks: [
    {
      id: "problem",
      label: "The problem",
      headline: "We saw working hardware retired while students went without compute.",
      body: [
        "Picture a student who wants GPU power for a project. Across the country, a data centre is decommissioning thousands of perfectly functional units.",
      ],
      visual: {
        kind: "stats",
        stats: [
          {
            value: "62M",
            text: "tonnes of e-waste generated worldwide in a year.",
            source: "Global E-waste Monitor 2024",
            href: "https://ewastemonitor.info/the-global-e-waste-monitor-2024/",
          },
          { value: "83", text: "Waterloo engineering students answered our survey." },
          { value: "53%", text: "of them say cost has often stopped a hardware project." },
        ],
      },
    },
    {
      id: "context",
      label: "The problem",
      headline: "We traced it to AI moving faster than the hardware it runs on.",
      body: [
        "Companies upgrade often to stay competitive, so functional hardware gets labelled outdated and leaves the data centre.",
      ],
      visual: {
        kind: "cards",
        cards: [
          { title: "Rising adoption", body: "AI use is growing fast, at work and at home." },
          { title: "Environmental strain", body: "That use puts real strain on the environment." },
          { title: "Easy access", body: "Free tiers lower the barrier to entry and speed it up." },
          {
            title: "Rapid obsolescence",
            body: "Infrastructure turns over quickly, leaving working hardware behind.",
          },
        ],
      },
    },
    {
      id: "gap",
      label: "The gap",
      headline: "We found no bridge from affordable hardware to real projects.",
      body: [
        "Redistribution channels are built for enterprise buyers, not individuals. Startups and students need affordable compute, and no platform takes them from a part to a real project.",
      ],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "Today",
            tone: "plain",
            items: [
              "Resale is built for enterprise buyers",
              "Listings speak in specs",
              "Learning lives in scattered YouTube tutorials",
              "The experience ends at checkout",
            ],
          },
          {
            title: "What students need",
            tone: "accent",
            items: [
              "Hardware sized and priced for one person",
              "Parts found by what they help you build",
              "A guided path from parts to project",
              "One place to buy, learn and build",
            ],
          },
        ],
      },
    },
    {
      id: "survey",
      label: "Research",
      headline: "We surveyed 83 Waterloo engineering students first.",
      body: [
        "We asked whether they had tried to build hardware, what stopped them, and what would make second-hand parts worth trusting. Affordable compute topped the list of what makes starting hard.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 80,
        ticks: [0, 20, 40, 60, 80],
        unit: "%",
        bars: [
          { label: "Finding affordable compute", value: 67, display: "67%", tone: "accent" },
          { label: "Knowing what hardware is needed", value: 58, display: "58%" },
          { label: "Understanding what to build", value: 52, display: "52%" },
          { label: "Connecting learning to a project", value: 49, display: "49%" },
          { label: "Setting up the environment", value: 41, display: "41%", tone: "soft" },
          { label: "Finding resources beyond theory", value: 38, display: "38%", tone: "soft" },
        ],
      },
      caption: "The hardest part of getting started with a hardware project. Up to two answers each.",
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "We learned the interest exists; a clear way in doesn't.",
      body: [
        "More than half wanted to build hardware projects but hadn't started or got stuck. Not for lack of interest, but because the entry point is unclear.",
      ],
      visual: { kind: "dots", total: 20, lit: 11 },
      caption: "55% wanted to build but hadn't started (38%) or got stuck (17%).",
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "We learned guidance is what turns interest into action.",
      body: [
        "83% would be more likely to use a marketplace with step-by-step walkthroughs. The value is not only the hardware, but the path from hardware to a working project.",
      ],
      visual: {
        kind: "stats",
        stats: [
          { value: "83%", text: "more likely to use it with guided project walkthroughs." },
          { value: "5.7", text: "out of 7: how useful browsing by what you can build would be." },
        ],
      },
      pair: true,
    },
    {
      id: "insight-3",
      label: "Insight #3",
      headline: "We learned trust is the real currency.",
      body: [
        "80% said they would buy refurbished hardware if it were trustworthy, and the signals they asked for are all about context and clarity.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 80,
        ticks: [0, 20, 40, 60, 80],
        unit: "%",
        bars: [
          { label: "An explanation of compatible uses", value: 74, display: "74%", tone: "accent" },
          { label: "Verified condition reports", value: 71, display: "71%", tone: "accent" },
          { label: "A return or guarantee policy", value: 68, display: "68%" },
          { label: "Benchmark results for each unit", value: 63, display: "63%" },
          { label: "Reviews from other builders", value: 58, display: "58%", tone: "soft" },
          { label: "Setup support and docs", value: 55, display: "55%", tone: "soft" },
        ],
      },
      caption: "What would make you trust that the hardware was legitimate and usable? All that apply.",
    },
    {
      id: "opportunity",
      label: "The opportunity",
      headline: "So we asked one question.",
      body: [],
      visual: {
        kind: "statement",
        text: "How might we make repurposed hardware accessible, trustworthy and understandable, so that students and builders can easily turn it into real projects?",
      },
    },
    {
      id: "home",
      label: "Design decision",
      headline: "I organised the home page by what you want to build, not by specs.",
      body: [
        "38% wanted to build but didn't know where to start, so the home page opens with that question and answers it with use cases.",
      ],
      visual: {
        kind: "anatomy",
        image: {
          src: "/media/work/reboot.webp",
          alt: "Reboot's home page with use-case categories, a filter and suggested hardware",
          width: 1474,
          height: 1060,
        },
        points: [
          {
            x: 80,
            y: 33,
            title: "Use-case navigation",
            text: "Compute, networking, power, cooling: hardware sorted by purpose instead of specs.",
          },
          { x: 35, y: 49, title: "Progressive filtering", text: "Narrow the list one choice at a time." },
          {
            x: 56,
            y: 56,
            title: "Recommendations in context",
            text: "Suggested hardware, tagged by the project it belongs to.",
          },
        ],
      },
    },
    {
      id: "product",
      label: "Design decision",
      headline: "I linked every part to the data centre it came from, so a listing earns trust.",
      body: [
        "Each product shows its originating data centre, its usage and its condition, turning anonymous resale into traceable infrastructure. Bundles and bulk options sit right under it.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/reboot/product.webp",
            alt: "Reboot's product page for a GPU accelerator card, with its source and bulk options",
            width: 1321,
            height: 948,
          },
        ],
      },
      caption: "The product page: where it came from, how it was used, what it pairs with.",
    },
    {
      id: "builder",
      label: "Solution",
      headline: "We designed a project builder that takes you from parts to a working build.",
      body: [
        "A node-based map shows how the components connect, with guided steps beside it and every part one click from the cart. Projects come in tiers, so beginners and experienced builders both have a path.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/reboot/builder.webp",
            alt: "Reboot's project builder: a CPU, RAM and SSD connected to a motherboard, with steps beside it",
            width: 1626,
            height: 1172,
          },
        ],
      },
      caption: "The project builder: the system as a map, the steps beside it.",
    },
    {
      id: "impact",
      label: "Design decision",
      headline: "I made the environmental impact visible, so every build counts for something.",
      body: [
        "The statistics page shows the parts you recycled, the e-waste and CO2 you prevented and your progress over time, turning technical work into a contribution you can see.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/reboot/impact.webp",
            alt: "Reboot's statistics page: parts recycled, e-waste prevented, a bar chart by month and trees saved",
            width: 1626,
            height: 1172,
          },
        ],
      },
      caption: "Impact, in parts, kilograms and trees.",
    },
    {
      id: "different",
      label: "What sets it apart",
      headline: "We changed three things marketplaces take for granted.",
      body: [],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "From specs to use cases",
            tone: "plain",
            items: [
              "Hardware is found by outcome and intent, so beginners never have to decode a spec sheet.",
            ],
          },
          {
            title: "From buying to building",
            tone: "plain",
            items: ["Guided templates replace scattered tutorials, with clear steps for every skill level."],
          },
          {
            title: "From waste to opportunity",
            tone: "accent",
            items: ["Surplus becomes a low-cost way into hardware, AI and systems building."],
          },
        ],
      },
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "We placed 3rd at the UofT UDesignathon.",
      body: [],
      visual: { kind: "podium", place: 3, name: "Reboot" },
    },
  ],
  next: "maple-leaf-foods",
  draft: ["insight and decision headlines rewritten as first-person claims from the Framer copy"],
};
