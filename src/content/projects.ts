/**
 * Every project shown on the site. Sources: Lucas's previous portfolio repo (case-study copy and
 * media), Devpost (event, team, prizes, demo videos), LinkedIn (roles and dates). Fields marked
 * DRAFT are drafted for the layout and must be confirmed by Lucas (listed in REPORT.md).
 */

export interface Media {
  /** Video loop (muted) with its poster, or a still image. */
  video?: string;
  poster?: string;
  image?: string;
  /** A muted loop that plays only while the card is hovered (the still stays otherwise). */
  hover?: string;
  alt: string;
  /** Intrinsic size of the poster or image. */
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  /** 1 to 4: the home page shows 1 and 2; 1 to 3 lead the /work list. */
  rank?: number;
  /** YYYY-MM, for the chronological list (newest first). */
  date: string;
  year: string;
  medium: string;
  role: string;
  team?: string;
  /** Where it happened (the hackathon or company). */
  event?: string;
  /** Prizes and results, each shown as its own line. */
  accolades?: string[];
  credit?: string;
  /** Two-line description for the lists. */
  description: string;
  /** The one line under the title on cards (Next exhibit). */
  caption?: string;
  /** Plays on hover in the lists. */
  media: Media;
  /** Has a case study page at /work/<slug>. */
  caseStudy: boolean;
  link?: { label: string; href: string };
  draft?: string[];
}

export const projects: Project[] = [
  {
    slug: "ripple",
    title: "Ripple",
    rank: 1,
    date: "2026-03",
    year: "2026",
    medium: "LLM product concept",
    role: "Product designer",
    event: "UW/UX BLOOM Designathon 2026",
    accolades: ["3rd place"],
    description:
      "An LLM that reuses before it regenerates: past answers resurface first, so everyday questions stop costing water and energy.",
    caption: "An LLM that reuses before it regenerates, so everyday questions stop costing water.",
    media: {
      video: "/media/ripple/hero.mp4",
      poster: "/media/ripple/hero.webp",
      alt: "Ripple's prompt screen with resurfaced answers",
      width: 1630,
      height: 912,
    },
    caseStudy: true,
    link: {
      label: "Figma prototype",
      href: "https://www.figma.com/proto/01XnqrdkdhHhUCY7Ii3AvT/BLOOM-Designathon-2026?node-id=36-1061&starting-point-node-id=36%3A1061",
    },
    draft: ["role", "team"],
  },
  {
    slug: "shufflr",
    title: "Shufflr",
    rank: 2,
    date: "2026-03",
    year: "2026",
    medium: "Mobile app concept",
    role: "Product designer",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    event: "Western University Product Design Sprint 2026",
    accolades: ["1st place", "Most Practical"],
    description:
      "Lowering the activation energy of fun, low-stakes hangouts: a shuffle that turns a few loose preferences into a plan in under a minute.",
    caption: "A shuffle that turns a few loose preferences into a plan in under a minute.",
    media: {
      video: "/media/shufflr/hero.mp4",
      poster: "/media/shufflr/hero.webp",
      alt: "Shufflr on two phones: the shuffle and an activity card",
      width: 1920,
      height: 1047,
    },
    caseStudy: true,
    link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
    draft: ["role"],
  },
  {
    slug: "we-should-go-to-japan",
    title: "We should go to Japan",
    rank: 3,
    date: "2026-07",
    year: "2026",
    medium: "Group trip planner",
    role: "Designer and builder",
    team: "Alexander Gu, Kaamil Mirza, Lucas Vu, Ryan Chang",
    event: "Hack the 6ix 2026",
    accolades: ["Winner, Base44 Venture Creation Track ($1,000)", "Winner, Best Use of AI by Pheobe ($400)"],
    description:
      "Get your Japan trip out of the group chat and into an actual plan: an agent books it with the group, one pet at a time.",
    caption: "Get your Japan trip out of the group chat and into an actual plan.",
    media: {
      video: "/media/work/japan.mp4",
      poster: "/media/work/japan.webp",
      alt: "The We should go to Japan web app: a hotel card and the group's sushi pet",
      width: 1920,
      height: 1080,
    },
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/a-nhsi8g" },
    draft: ["role", "description"],
  },
  {
    slug: "maple-leaf-foods",
    title: "Maple Leaf Foods",
    rank: 4,
    date: "2026-04",
    year: "2026",
    medium: "Internal tools, three projects",
    role: "Digital product manager (intern)",
    event: "Maple Leaf Foods",
    accolades: ["A Power App processing $14M+ in penalties a year"],
    description:
      "Digitising decades-old workflows: a service penalty app, an employee store and a project tracker that replaced email chains and DMs.",
    caption: "Three internal apps that took decades-old workflows out of email chains and DMs.",
    media: {
      video: "/media/maple-leaf/hero.mp4",
      poster: "/media/maple-leaf/hero.webp",
      alt: "Maple Leaf Foods internal apps",
      width: 1526,
      height: 828,
    },
    caseStudy: true,
    draft: ["date"],
  },
  {
    slug: "warframe",
    title: "Warframe",
    date: "2026-09",
    year: "2026, ongoing",
    medium: "Game UI and product design",
    role: "Product designer, Digital Extremes",
    event: "Digital Extremes",
    description:
      "Product design at Digital Extremes on Warframe. The work is not public yet; ask me about it.",
    caption: "Product design at Digital Extremes. The case study is coming soon.",
    credit: "Coming soon",
    media: {
      image: "/media/warframe/still.webp",
      hover: "/media/warframe/glitch.mp4",
      alt: "A Warframe in blue light, glitching on hover",
      width: 1024,
      height: 571,
    },
    caseStudy: false,
    link: { label: "Ask me about it", href: "mailto:lucasvu.work@gmail.com?subject=Warframe" },
    draft: ["medium", "NDA status"],
  },
  {
    slug: "asper",
    title: "Asper",
    date: "2026-10",
    year: "2026",
    medium: "AI agent for home inspectors",
    role: "Designer and builder",
    team: "Lucas Vu, Shrey Shingala",
    event: "SOON Hackathon Fall 2026",
    accolades: ["Winner, Best Use of AI on a Real Inspection (AirPods 5)"],
    description:
      "Answers customers instantly, books the inspection, writes the report and follows up until the job is done.",
    media: {
      video: "/media/work/asper.mp4",
      poster: "/media/work/asper.webp",
      alt: "Asper's map of every customer and the conversation beside it",
      width: 1920,
      height: 986,
    },
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/asper" },
    draft: ["role"],
  },
  {
    slug: "frictionless",
    title: "Frictionless",
    date: "2026-09",
    year: "2026",
    medium: "Product research tool",
    role: "Designer and builder",
    team: "Jimmy Nguyen, Lucas Vu, Ved Thakar, Xiaotong Shen",
    event: "Hack the North 2026",
    description: "Find your product's friction before your customers do.",
    media: {
      video: "/media/work/frictionless.mp4",
      poster: "/media/work/frictionless.webp",
      alt: "Frictionless: personas browsing a site and the friction report",
      width: 1920,
      height: 1080,
    },
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/personalize-038weu" },
    draft: ["role", "team name spellings"],
  },
  {
    slug: "parrot",
    title: "Parrot",
    date: "2026-07",
    year: "2026",
    medium: "Contract design engineering",
    role: "Design engineer",
    event: "Parrot (YC F25)",
    description: "Design engineering for a Y Combinator F25 startup over the summer of 2026.",
    media: {
      video: "/media/work/parrot.mp4",
      poster: "/media/work/parrot.webp",
      alt: "Parrot wordmark over clouds",
      width: 1920,
      height: 1080,
    },
    caseStudy: false,
    link: { label: "parrotapp.com", href: "https://parrotapp.com" },
  },
  {
    slug: "creators-collective",
    title: "Creators Collective",
    date: "2026-01",
    year: "2026",
    medium: "Product design",
    role: "Product designer",
    event: "Creators Collective",
    description: "Product design for Creators Collective from January to June 2026.",
    media: {
      video: "/media/work/creators-collective.mp4",
      poster: "/media/work/creators-collective.webp",
      alt: "Creators Collective motion piece",
      width: 1920,
      height: 1080,
    },
    caseStudy: false,
    link: { label: "Live site", href: "https://creatorscollective.framer.website/" },
  },
  {
    slug: "reboot",
    title: "Reboot",
    date: "2026-03",
    year: "2026",
    medium: "Marketplace and project builder",
    role: "Product manager and designer",
    team: "Jenny Yang, Kelly M, Lucas Vu",
    event: "UofT UDesignathon 2026",
    accolades: ["3rd place"],
    description:
      "A marketplace that gives retired data-centre hardware a second life, with guided builds so students can turn it into real projects.",
    media: {
      video: "/media/work/reboot.mp4",
      poster: "/media/work/reboot.webp",
      alt: "Reboot's home page: hardware sorted by what you want to build",
      width: 1474,
      height: 1060,
    },
    caseStudy: false,
    link: { label: "Case study", href: "https://lucasvu.framer.website/projects/reboot" },
  },
  {
    slug: "google-song-search",
    title: "Google song search, rebuilt",
    date: "2026-02",
    year: "2026",
    medium: "Interaction experiment",
    role: "Design engineer",
    description:
      "When Google's hum-to-search annoyed me, I rebuilt the experience the way I wanted it to feel.",
    media: {
      video: "/media/work/search-a-song.mp4",
      poster: "/media/work/search-a-song.webp",
      alt: "The song search rebuild: play, sing or hum, then listening",
      width: 1600,
      height: 1000,
    },
    caseStudy: false,
    link: { label: "Live site", href: "https://google-song-search.vercel.app" },
    draft: ["description", "date"],
  },
  {
    slug: "solarscore",
    title: "SolarScore",
    date: "2025-06",
    year: "2025",
    medium: "Home energy tool",
    role: "Designer and builder",
    team: "Gabe Lynch, Jaskirat Mann, Lucas Vu",
    event: "Incubator Hacks 2",
    accolades: ["1st place"],
    description:
      "A neutral, third-party read on bringing renewable energy home, personalised from a single address.",
    media: {
      video: "/media/work/solarscore.mp4",
      poster: "/media/work/solarscore.webp",
      alt: "Solar panels on a roof, from SolarScore's landing page",
      width: 1920,
      height: 1080,
    },
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/solarscore" },
    draft: ["date", "role"],
  },
];

export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);

/** Where a project opens: its case study, else its public link. */
export const hrefOf = (p: Project) => (p.caseStudy ? `/work/${p.slug}` : p.link?.href);

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "2026-03" as "March", with the year only when it is not this year ("June 2025"). */
export function monthOf(date: string, now = new Date()): string {
  const [year, month] = date.split("-").map(Number);
  const name = MONTHS[month! - 1]!;
  return year === now.getFullYear() ? name : `${name} ${year}`;
}

const ranked = (n: number) => projects.filter((p) => p.rank && p.rank <= n).sort((a, b) => a.rank! - b.rank!);

/** The home page: the two strongest (PLAN 13.3). */
export const homeProjects = ranked(2);

/** /work: the top three, then everything else, newest first. */
export const allProjects = [
  ...ranked(3),
  ...projects.filter((p) => !p.rank || p.rank > 3).sort((a, b) => b.date.localeCompare(a.date)),
];
