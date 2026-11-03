/**
 * Every project shown on the site. Sources: Lucas's previous portfolio repo (case-study copy and
 * media), Devpost (event, team, prizes), LinkedIn (roles and dates). Fields marked DRAFT are
 * drafted for the layout and must be confirmed by Lucas (listed in REPORT.md).
 */

export interface Media {
  /** Video loop (muted) with its poster, or a still image. */
  video?: string;
  poster?: string;
  image?: string;
  alt: string;
  /** Intrinsic size of the poster or image. */
  width: number;
  height: number;
}

export interface Project {
  slug: string;
  title: string;
  featured: boolean;
  /** Wall label lines. */
  year: string;
  medium: string;
  role: string;
  team?: string;
  credit?: string;
  /** Two-line description for the catalogue. */
  description: string;
  media?: Media;
  /** Has a case study page at /work/<slug>. */
  caseStudy: boolean;
  link?: { label: string; href: string };
  draft?: string[];
}

export const projects: Project[] = [
  {
    slug: "shufflr",
    title: "Shufflr",
    featured: true,
    year: "2026",
    medium: "Mobile app concept",
    role: "Product designer",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    credit: "Winner, Product Design Sprint",
    description:
      "Lowering the activation energy of fun, low-stakes hangouts: a shuffle that turns a few loose preferences into a plan in under a minute.",
    media: {
      video: "/media/shufflr/hero.mp4",
      poster: "/media/shufflr/hero.webp",
      alt: "Shufflr on two phones: the shuffle and an activity card",
      width: 1280,
      height: 698,
    },
    caseStudy: true,
    link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
    draft: ["role", "year"],
  },
  {
    slug: "ripple",
    title: "Ripple",
    featured: true,
    year: "2026",
    medium: "LLM product concept",
    role: "Product designer",
    credit: "BLOOM Designathon 2026",
    description:
      "An LLM that reuses before it regenerates: past answers resurface first, so everyday questions stop costing water and energy.",
    media: {
      video: "/media/ripple/hero.mp4",
      poster: "/media/ripple/hero.webp",
      alt: "Ripple's prompt screen with resurfaced answers",
      width: 1280,
      height: 716,
    },
    caseStudy: true,
    link: {
      label: "Figma prototype",
      href: "https://www.figma.com/proto/01XnqrdkdhHhUCY7Ii3AvT/BLOOM-Designathon-2026?node-id=36-1061&starting-point-node-id=36%3A1061",
    },
    draft: ["role", "team"],
  },
  {
    slug: "maple-leaf-foods",
    title: "Maple Leaf Foods",
    featured: true,
    year: "2026",
    medium: "Internal tools, three projects",
    role: "Digital product manager (intern)",
    credit: "A Power App processing $14M+ in penalties a year",
    description:
      "Digitising decades-old workflows: a service penalty app, an employee store and a project tracker that replaced email chains and DMs.",
    media: {
      video: "/media/maple-leaf/hero.mp4",
      poster: "/media/maple-leaf/hero.webp",
      alt: "Maple Leaf Foods internal apps",
      width: 1280,
      height: 694,
    },
    caseStudy: true,
  },
  {
    slug: "warframe",
    title: "Warframe",
    featured: true,
    year: "2026, ongoing",
    medium: "Game UI and product design",
    role: "Product designer, Digital Extremes",
    credit: "Under wraps for now",
    description:
      "Product design at Digital Extremes on Warframe. The work is not public yet; ask me about it.",
    caseStudy: true,
    draft: ["medium", "NDA status"],
  },
  {
    slug: "asper",
    title: "Asper",
    featured: false,
    year: "2026",
    medium: "AI agent for home inspectors",
    role: "Designer and builder",
    team: "Lucas Vu, Shrey Shingala",
    credit: "Winner, SOON Hackathon Fall 2026",
    description:
      "Answers customers instantly, books the inspection, writes the report and follows up until the job is done.",
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/asper" },
    draft: ["role"],
  },
  {
    slug: "parrot",
    title: "Parrot",
    featured: false,
    year: "2026",
    medium: "Contract, Parrot (YC F25)",
    role: "Design engineer",
    description: "Design engineering for a Y Combinator F25 startup over the summer of 2026.",
    media: {
      video: "/media/work/parrot.mp4",
      poster: "/media/work/parrot.webp",
      alt: "Parrot wordmark over clouds",
      width: 1280,
      height: 720,
    },
    caseStudy: false,
  },
  {
    slug: "creators-collective",
    title: "Creators Collective",
    featured: false,
    year: "2026",
    medium: "Product design",
    role: "Product designer",
    description: "Product design for Creators Collective from January to June 2026.",
    media: {
      video: "/media/work/creators-collective.mp4",
      poster: "/media/work/creators-collective.webp",
      alt: "Creators Collective motion piece",
      width: 1280,
      height: 720,
    },
    caseStudy: false,
  },
  {
    slug: "we-should-go-to-japan",
    title: "We should go to Japan",
    featured: false,
    year: "2026",
    medium: "Group trip planner",
    role: "Designer and builder",
    team: "Alexander Gu, Kaamil Mirza, Lucas Vu, Ryan Chang",
    credit: "Hack the 6ix 2026",
    description: "Get your Japan trip out of the group chat and into an actual plan.",
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/a-nhsi8g" },
    draft: ["role"],
  },
  {
    slug: "frictionless",
    title: "Frictionless",
    featured: false,
    year: "2026",
    medium: "Product research tool",
    role: "Designer and builder",
    team: "Jimmy Nguyen, Lucas Vu, Ved Thakar, Xiaotong Shen",
    credit: "Hack the North 2026",
    description: "Find your product's friction before your customers do.",
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/personalize-038weu" },
    draft: ["role", "team name spellings"],
  },
  {
    slug: "solarscore",
    title: "SolarScore",
    featured: false,
    year: "2025",
    medium: "Home energy tool",
    role: "Designer and builder",
    team: "Gabe Lynch, Jaskirat Mann, Lucas Vu",
    credit: "1st place, Incubator Hacks 2",
    description:
      "A neutral, third-party read on bringing renewable energy home, personalised from a single address.",
    caseStudy: false,
    link: { label: "Devpost", href: "https://devpost.com/software/solarscore" },
    draft: ["year", "role"],
  },
  {
    slug: "google-song-search",
    title: "Google song search, rebuilt",
    featured: false,
    year: "2026",
    medium: "Interaction experiment",
    role: "Design engineer",
    description:
      "When Google's hum-to-search annoyed me, I rebuilt the experience the way I wanted it to feel.",
    media: { image: "/media/work/search-a-song.jpg", alt: "Song search rebuild", width: 1280, height: 720 },
    caseStudy: false,
    link: { label: "GitHub", href: "https://github.com/VuMadeIt/lucasvu" },
    draft: ["description", "year"],
  },
];

export const featured = projects.filter((p) => p.featured);
export const projectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
