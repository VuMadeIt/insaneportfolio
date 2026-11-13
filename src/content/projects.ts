/**
 * Every project shown on the site. Sources: Lucas's previous portfolio repo (case-study copy and
 * media), Devpost (event, team, prizes, demo videos), LinkedIn (roles and dates). Fields marked
 * DRAFT are drafted for the layout and must be confirmed by Lucas (listed in REPORT.md).
 */

/** A phone screen's frame: the app's colours behind the status bar and home indicator (Phone.tsx). */
export interface Frame {
  top: string;
  bottom: string;
  dark?: boolean;
  /** Shot full height: the status bar and home indicator sit see-through on top of the screen. */
  full?: boolean;
}

export interface Media {
  /** Video loop (muted) with its poster, or a still image. */
  video?: string;
  poster?: string;
  image?: string;
  /** A muted loop that plays only while the card is hovered (the still stays otherwise). */
  hover?: string;
  alt: string;
  /** Shown in an iPhone frame. */
  frame?: Frame;
  /** A small tag above a framed phone: which version this is. */
  label?: string;
  /** Intrinsic size of the poster or image. */
  width: number;
  height: number;
  /** The same screen in English (Passion Nails' staff app is Vietnamese first). */
  en?: Omit<Media, "en">;
}

/** Rendered objects in public/media/objects (scripts/objects.mjs). */
export type Prize = "gold" | "bronze" | "cash" | "airpods";

export interface Project {
  slug: string;
  title: string;
  /** YYYY-MM, for the chronological list (newest first). */
  date: string;
  year: string;
  medium: string;
  role: string;
  team?: string;
  /** Where it happened (the hackathon or company). */
  event?: string;
  /** A hackathon prize: the object drawn beside the title, and the line that opens the description on /work. */
  prize?: { object: Prize; text: string };
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
    date: "2026-03",
    year: "2026",
    medium: "LLM product concept",
    role: "Product designer",
    event: "UW/UX BLOOM Designathon 2026",
    prize: { object: "bronze", text: "3rd place at the UW/UX BLOOM Designathon." },
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
    date: "2026-04",
    year: "2026",
    medium: "Mobile app concept",
    role: "Product designer",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    event: "Western University Product Design Sprint 2026",
    prize: { object: "gold", text: "1st place and Most Practical at the Western Product Design Sprint." },
    description:
      "Lowering the activation energy of fun, low-stakes hangouts: a shuffle that turns a few loose preferences into a plan in under a minute.",
    caption: "A shuffle that turns a few loose preferences into a plan in under a minute.",
    media: {
      video: "/media/work/shufflr.mp4",
      poster: "/media/work/shufflr.webp",
      alt: "Shufflr on two phones: the shuffle and an activity card",
      width: 1630,
      height: 912,
    },
    caseStudy: true,
    link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
    draft: ["role"],
  },
  {
    slug: "we-should-go-to-japan",
    title: "We should go to Japan",
    date: "2026-07",
    year: "2026",
    medium: "Group trip planner",
    role: "Designer and builder",
    team: "Alexander Gu, Kaamil Mirza, Lucas Vu, Ryan Chang",
    event: "Hack the 6ix 2026",
    prize: {
      object: "cash",
      text: "Winner of two tracks at Hack the 6ix, $1,400 USD: Base44 Venture Creation and Best Use of AI by Pheobe.",
    },
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
    slug: "passion-nails",
    title: "Passion Nails",
    date: "2026-11",
    year: "2026",
    medium: "Booking site and staff app",
    role: "Design engineer",
    event: "My family's boutique nail salon",
    description:
      "My mom's salon ran on one phone and no front desk. Now customers book online, and four techs run the day from a staff app in Vietnamese.",
    caption: "Taking my mom's salon off the phone, with a staff app in Vietnamese.",
    media: {
      video: "/media/work/passion-nails.mp4",
      poster: "/media/work/passion-nails.webp",
      alt: "The live Passion Nails site: the home page, services and reviews, then a booking from services to 'You're booked'",
      width: 1630,
      height: 912,
    },
    caseStudy: true,
    link: { label: "Live site", href: "https://passionnailstoronto.ca" },
  },
  {
    slug: "maple-leaf-foods",
    title: "Maple Leaf Foods",
    date: "2026-04",
    year: "2026",
    medium: "Internal tools, three projects",
    role: "Digital product manager (intern)",
    event: "Maple Leaf Foods",
    description:
      "Digitising decades-old workflows: a service penalty app that now processes $14M+ a year, an employee store and a project tracker that replaced email chains and DMs.",
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
    prize: {
      object: "airpods",
      text: "Won AirPods at the SOON Hackathon for Best Use of AI on a Real Inspection.",
    },
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
    slug: "sweaterify",
    title: "Sweaterify",
    date: "2026-10",
    year: "2026",
    medium: "Image tool",
    role: "Designer and builder",
    description:
      "Turn any image into a Christmas sweater: every square of the grid becomes a knit stitch, ready to download.",
    media: {
      video: "/media/work/sweaterify.mp4",
      poster: "/media/work/sweaterify.webp",
      alt: "Sweaterify knitting the word Noel, the stitches getting finer",
      width: 916,
      height: 460,
    },
    caseStudy: false,
    link: { label: "Live site", href: "https://sweaterify.vercel.app" },
  },
  {
    slug: "liam-vu",
    title: "Liam Vu's portfolio",
    date: "2026-10",
    year: "2026",
    medium: "Portfolio site",
    role: "Designer and builder",
    description:
      "A portfolio for my brother Liam, The Urban Planning Influencer: you ride a TTC line, station to station, through his social media, case studies, projects and art.",
    media: {
      video: "/media/work/liam-vu.mp4",
      poster: "/media/work/liam-vu.webp",
      alt: "Liam Vu's portfolio: a subway platform, and the train pulling in",
      width: 1600,
      height: 1000,
    },
    caseStudy: false,
    link: { label: "Live site", href: "https://liamvu.vercel.app" },
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
    date: "2026-02",
    year: "2026",
    medium: "Marketplace and project builder",
    role: "Product manager and designer",
    team: "Jenny Yang, Kelly M, Lucas Vu",
    event: "UofT UDesignathon 2026",
    prize: { object: "bronze", text: "3rd place at the UofT UDesignathon." },
    description:
      "A marketplace that gives retired data-centre hardware a second life, with guided builds so students can turn it into real projects.",
    media: {
      video: "/media/work/reboot-wide.mp4",
      poster: "/media/work/reboot-wide.webp",
      alt: "Reboot's home page: hardware sorted by what you want to build",
      width: 1630,
      height: 912,
    },
    caseStudy: true,
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
    prize: { object: "gold", text: "1st place at Incubator Hacks 2." },
    description:
      "A neutral, third-party read on bringing renewable energy home, personalised from a single address.",
    media: {
      video: "/media/work/solarscore.mp4",
      poster: "/media/work/solarscore.webp",
      alt: "SolarScore checking a home from its address, then the emailed roof report and its satellite outline",
      width: 1280,
      height: 720,
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

/** "2026-03" as "March 2026". */
export function monthOf(date: string): string {
  const [year, month] = date.split("-").map(Number);
  return `${MONTHS[month! - 1]} ${year}`;
}

/** The home page (revision 8): Reboot, then Passion Nails (a live product), then Shufflr. Ripple stays on /work. */
export const homeProjects = ["passion-nails", "reboot", "shufflr"].map((slug) => projectBySlug(slug)!);

/** /work (PLAN 14.6, 15.16): hackathon wins, then selected projects, in my own order. */
const pick = (slugs: string[]) => slugs.map((slug) => projectBySlug(slug)!);
export const wins = pick(["ripple", "shufflr", "we-should-go-to-japan", "reboot", "asper", "solarscore"]);
export const selected = pick([
  "passion-nails",
  "maple-leaf-foods",
  "sweaterify",
  "liam-vu",
  "frictionless",
  "parrot",
  "warframe",
  "google-song-search",
  "creators-collective",
]);
