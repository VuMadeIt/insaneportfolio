export type IdentitySlug = "people" | "ideas" | "experiments" | "products";

export interface Identity {
  slug: IdentitySlug;
  title: string;
  /** One-line title description. */
  line: string;
  /** The wall text, in my words (Lucas, 2026-11-05). */
  paragraphs: string[];
}

/** Left to right, the order of the balls. */
export const identities: Identity[] = [
  {
    slug: "people",
    title: "People",
    line: "Where every problem starts.",
    paragraphs: [
      "I've always been curious about what makes people tick, what drives them and what they spend (or wish they spent) most of their time doing, because the best problems I've solved were hiding inside someone else's story.",
    ],
  },
  {
    slug: "ideas",
    title: "Ideas",
    line: "The first push.",
    paragraphs: [
      "Some may call me a mad man. I think they're right. I live in my mind a lot, which often produces ideas! Most of them are horrible, but they are cheap to produce and the small minority that work keep me alive!",
    ],
  },
  {
    slug: "experiments",
    title: "Experiments",
    line: "Built to find out.",
    paragraphs: [
      "Remember when I said most of my ideas are horrible? Experiments are how I find out if they stink or if I'm onto something.",
    ],
  },
  {
    slug: "products",
    title: "Products",
    line: "The part you can hold.",
    paragraphs: [
      "Products are the shiny part, the beautiful part. It can manifest in so many different mediums. I love working on products, established 80 years ago or weeks ago, but not one product has ever existed without at least one of the previous three elements.",
      "All of these elements are interconnected. Hopefully Newton's Cradle helped to visualize this.",
    ],
  },
];

export const identityIndex = (slug: string) => identities.findIndex((i) => i.slug === slug);
