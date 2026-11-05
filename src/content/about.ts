/**
 * The About room. Sources: Lucas's previous About page (updated-portfolioi), LinkedIn.
 * Captions are his own lines from the old site, lightly tightened.
 */

export const statement = [
  "What defines me is wanting to try new things: soccer, fishing, martial arts, dancing, or jumping on a project idea the night it shows up.",
  "What has stayed constant is a pull toward people, building and design. Making good products for people and communities I can relate to is the thing I was made to do, and it isn't going anywhere.",
];

export const portrait = {
  src: "/media/about/japan.png",
  alt: "Me giving a thumbs up in front of Senso-ji in Tokyo, on a solo backpacking trip",
  width: 1024,
  height: 883,
};

export interface Role {
  role: string;
  place: string;
  /** YYYY-MM; `end` null while it is still going. */
  start: string;
  end: string | null;
  logo: string;
  /** A white logo that needs a dark tile. */
  dark?: boolean;
  text: string;
  link?: { label: string; href: string };
}

/**
 * The chronology (PLAN 13.5), oldest first. Dates from LinkedIn and Lucas; lines from LinkedIn,
 * his essay and Medium post. DRAFT: the WES, Creators Collective and Hackathons lines.
 */
export const chronology: Role[] = [
  {
    role: "Systems Design and Ops Coordinator",
    place: "The Local Charity",
    start: "2025-05",
    end: "2025-08",
    logo: "local-charity",
    text: "Ran the systems and operations behind the charity's programs, and learned I would rather build the product than run the machine.",
  },
  {
    role: "Systems Design Engineering",
    place: "University of Waterloo",
    start: "2025-09",
    end: null,
    logo: "uwaterloo",
    text: "Human-centred design, systems thinking and real-world problem solving, the program I obsessed over in high school.",
  },
  {
    role: "Figma Design Director",
    place: "Waterloo Engineering Society",
    start: "2026-01",
    end: "2026-04",
    logo: "waterloo-engineering",
    text: "Directed the society's design work in Figma for the winter term.",
  },
  {
    role: "Digital Product Manager",
    place: "Maple Leaf Foods",
    start: "2026-01",
    end: "2026-04",
    logo: "maple-leaf-foods",
    text: "Product manager for the Service Penalty App ($14M+ a year), QA for the Maple Leaf Market launch, design engineer for the team's task tracker.",
    link: { label: "Case study", href: "/work/maple-leaf-foods" },
  },
  {
    role: "Product Designer",
    place: "Creators Collective",
    start: "2026-01",
    end: "2026-06",
    logo: "creators-collective",
    text: "Product design for Creators Collective, a student initiative for people who make things.",
    link: { label: "Live site", href: "https://creatorscollective.framer.website/" },
  },
  {
    role: "Product Design Lead",
    place: "Hackathons North America",
    start: "2026-05",
    end: null,
    logo: "hack-canada",
    text: "Leading product design for Hack Canada and the hackathons around it.",
  },
  {
    role: "Design Engineer",
    place: "Parrot (YC F25)",
    start: "2026-07",
    end: "2026-08",
    logo: "parrot-yc",
    text: "Design engineering for the TikTok of language learning, over the summer.",
    link: { label: "parrotapp.com", href: "https://parrotapp.com" },
  },
  {
    role: "Product Designer",
    place: "Digital Extremes",
    start: "2026-09",
    end: null,
    logo: "digital-extremes",
    dark: true,
    text: "Product design on Warframe. The work is not public yet; ask me about it.",
    link: { label: "Ask me about it", href: "mailto:lucasvu.work@gmail.com?subject=Warframe" },
  },
];

export interface ObjectItem {
  /** Anchor on /about, linked from the home page's photo strip. */
  id: string;
  title: string;
  /** Where or when, under the title. */
  context: string;
  text: string;
  image: { src: string; alt: string; width: number; height: number };
}

export const objects: ObjectItem[] = [
  {
    id: "cadets",
    title: "Remembrance Day parade in the snow",
    context: "Cadets",
    text: "I joined cadets to get past my anxiety. Week-long camping trips, instructing classes of 70+, parading in the snow and fundraising for veterans shaped me more than anything else in my childhood.",
    image: {
      src: "/media/about/cadet-remembrance-day-parade.png",
      alt: "Cadets parading in the snow on Remembrance Day",
      width: 1024,
      height: 731,
    },
  },
  {
    id: "chess",
    title: "My last game in the TCDSB West-End division",
    context: "High school chess",
    text: "Chess was how I made friends before I got over my anxiety. I left the division with a record of 13-1-2, and later founded a program pairing high schoolers with elderly residents at The Village of Humber Heights.",
    image: {
      src: "/media/about/chess-tcdsb-west-end.png",
      alt: "Me at a chess board in the TCDSB West-End division",
      width: 585,
      height: 1024,
    },
  },
  {
    id: "speech",
    title: "After a 15-minute speech",
    context: "Volunteer Appreciation Ceremony",
    text: "Fifteen minutes on a stage, about the chess program and the people in it. I like being on stages more than I expected to.",
    image: {
      src: "/media/about/chess-volunteer-ceremony.png",
      alt: "Me after my speech at the Volunteer Appreciation Ceremony",
      width: 1010,
      height: 754,
    },
  },
  {
    id: "hack-the-6ix",
    title: "Winning $1,400 USD",
    context: "Hack the 6ix 2026",
    text: "If there's a design event at Waterloo or Toronto, I'm probably there. This one paid.",
    image: {
      src: "/media/about/hack-the-6ix-2026.png",
      alt: "The team at Hack the 6ix 2026",
      width: 1024,
      height: 682,
    },
  },
  {
    id: "socratica",
    title: "To Socratica Sundays!",
    context: "Socratica",
    text: "I'm proud to be part of a community of makers, artists and builders who simply work on what they love.",
    image: {
      src: "/media/about/socratica-create-a-thon.png",
      alt: "At Socratica",
      width: 1024,
      height: 682,
    },
  },
];
