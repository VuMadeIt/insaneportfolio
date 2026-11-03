/**
 * The About room. Sources: Lucas's previous About page and essay (updated-portfolioi), LinkedIn.
 * Captions are his own lines from the old site, lightly tightened.
 */

export const statement = [
  "What defines me is wanting to try new things: soccer, fishing, martial arts, dancing, or jumping on a project idea the night it shows up.",
  "What has stayed constant is a pull toward people, building and design. Making good products for people and communities I can relate to is the thing I was made to do, and it isn't going anywhere.",
];

export const portrait = {
  src: "/media/about/japan.png",
  alt: "Lucas giving a thumbs up in front of Senso-ji in Tokyo, on a solo backpacking trip",
  width: 1024,
  height: 883,
};

/** Oldest first, read left to right. `dark` puts a white logo on a dark tile. */
export const chronology: { when: string; role: string; place: string; logo: string; dark?: boolean }[] = [
  { when: "Ongoing", role: "Systems Design Engineering", place: "University of Waterloo", logo: "uwaterloo" },
  {
    when: "2025",
    role: "Systems Design and Ops Coordinator",
    place: "The Local Charity",
    logo: "local-charity",
  },
  {
    when: "2026",
    role: "Figma Design Director",
    place: "Waterloo Engineering Society",
    logo: "waterloo-engineering",
  },
  { when: "2026", role: "Digital Product Manager", place: "Maple Leaf Foods", logo: "maple-leaf-foods" },
  { when: "2026", role: "Product Designer", place: "Creators Collective", logo: "creators-collective" },
  { when: "2026", role: "Design Engineer", place: "Parrot (YC F25)", logo: "parrot-yc" },
  { when: "2026, now", role: "Product Design Lead", place: "Hackathons North America", logo: "hack-canada" },
  {
    when: "2026, now",
    role: "Product Designer",
    place: "Digital Extremes",
    logo: "digital-extremes",
    dark: true,
  },
];

export interface ObjectItem {
  /** Anchor on /about, linked from the home page's photo strip. */
  id: string;
  title: string;
  year: string;
  medium: string;
  text: string;
  image?: { src: string; alt: string; width: number; height: number };
  video?: { src: string; poster: string; alt: string; width: number; height: number };
}

export const objects: ObjectItem[] = [
  {
    id: "cadets",
    title: "Remembrance Day parade in the snow",
    year: "Cadets",
    medium: "Photograph",
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
    year: "High school chess",
    medium: "Photograph",
    text: "Chess was how I made friends before I got over my anxiety. I left the division with a record of 13-1-2, and later founded a program pairing high schoolers with elderly residents at The Village of Humber Heights.",
    image: {
      src: "/media/about/chess-tcdsb-west-end.png",
      alt: "Lucas at a chess board in the TCDSB West-End division",
      width: 585,
      height: 1024,
    },
  },
  {
    id: "speech",
    title: "After a 15-minute speech",
    year: "Volunteer Appreciation Ceremony",
    medium: "Photograph",
    text: "Fifteen minutes on a stage, about the chess program and the people in it. I like being on stages more than I expected to.",
    image: {
      src: "/media/about/chess-volunteer-ceremony.png",
      alt: "Lucas after his speech at the Volunteer Appreciation Ceremony",
      width: 1010,
      height: 754,
    },
  },
  {
    id: "hack-the-6ix",
    title: "Winning $1,400 USD",
    year: "Hack the 6ix 2026",
    medium: "Photograph",
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
    title: "Socratica's Create-a-thon",
    year: "Socratica, UW/UX, Blueprint",
    medium: "Photograph",
    text: "I'm proud to be part of a community of makers, artists and builders who simply work on what they love.",
    image: {
      src: "/media/about/socratica-create-a-thon.png",
      alt: "Socratica Create-a-thon",
      width: 1024,
      height: 682,
    },
  },
  {
    id: "fishing",
    title: "A hummingbird on the tip of my rod",
    year: "Fishing at 4am",
    medium: "Video, 26 seconds",
    text: "It hovered over the red tip of my fishing rod like it had found a flower, then realised and darted off. The essay below is about that morning.",
    video: {
      src: "/media/about/hummingbird.mp4",
      poster: "/media/about/hummingbird.webp",
      alt: "A hummingbird hovering over the red tip of a fishing rod",
      width: 360,
      height: 640,
    },
  },
];

export const essay = {
  title: "Why I'm finally ready to call myself a designer",
  date: "August 24, 2026",
  paragraphs: [
    "I woke at 4:00am for something I hadn't earned yet. With 5-inch green pumpkin senkos in my tackle box, a weedless rig tied by hand the night before, and fishing rods I borrowed from a friend, I was certain that wanting something badly enough, studying how to catch one and dedicating the time to go out there was enough to catch that big fish.",
    "That's the first lie every beginner tells himself: that the thing exists already, and the only work left is the reeling in.",
    "Three hours passed in silence before anything was answered. And in that silence, sitting alone on the shore before the world woke up, my mind wandered somewhere I hadn't planned for it to go. I began thinking about my future, towards the rest of my life. I'd always told myself I was an entrepreneur at heart, that building and disrupting was the whole point. But after becoming an operations coordinator for a charity, I realised running the machine never made my legs bounce under the desk. What does is the quieter thing: sitting down and making a product that actually reaches someone, that changes their morning the way mine was being changed by nothing but water and waiting. I hadn't gone there to figure that out. But the water doesn't ask what you came for before it gives you something anyway.",
    "A hummingbird came by while I sat there, and hovered over the red tip of my rod like it had found a flower. It hung there for a second, waiting for a sweetness that wasn't there, before realising it had been fooled by paint and darting away. I think about that a lot. Like the bird, it's so easy to chase bright appearances over actual substance, to go after the shiny shell of a title, like entrepreneur, instead of the craft that actually feeds you. But the bird's real wisdom wasn't in avoiding the mistake; it was in refusing to stay tricked. It didn't waste time trying to drink from plastic or feeling foolish for being fooled. It recognised a dead end, pivoted instantly, and went looking for the real thing. That felt like something worth learning from a creature with a brain the size of a seed.",
    "So when I think about why design is the thing, not entrepreneurship, not operations, but actually building the product and shipping the features people touch, I think about that morning by the water. There is a profound beauty in the realisation that the title you spent your life chasing is sometimes just the painted red tip of a fishing rod, and the work you actually crave is the quiet, deliberate act of making something real. For me, it is the thrill of stepping into a blank canvas to map out the exact mechanics of a multiplayer experience, or watching someone interact with a prototype and having them find it intuitive. That is the actual, sustaining sweetness I was looking for.",
    "I think about London, a week out from now, where I'll finally get to build game assets and a website for a studio I've dreamed about working for since I was a kid, and how none of that path was a straight cast either. The casts that didn't land and the operations roles that felt hollow were just the necessary silence before the water answered.",
    "And for that, I am forever grateful.",
  ],
};
