export type IdentitySlug = "people" | "ideas" | "experiments" | "products";

export interface Identity {
  slug: IdentitySlug;
  title: string;
  /** One-line title description. */
  line: string;
  /** Three short sentences. DRAFT: Lucas to edit (PLAN 4.8). */
  sentences: [string, string, string];
}

/** Left to right, the order of the balls. */
export const identities: Identity[] = [
  {
    slug: "people",
    title: "People",
    line: "Where every problem starts.",
    sentences: [
      "I've always been curious about what makes people tick.",
      "I've run chess nights, taught cadet classes of seventy, and I still talk to strangers at every design event in Waterloo.",
      "The best problems I've solved were hiding inside someone else's story.",
    ],
  },
  {
    slug: "ideas",
    title: "Ideas",
    line: "The first push.",
    sentences: [
      "Ideas are cheap until someone moves first.",
      "Six hackathon wins taught me to say 'what if' out loud and sketch it before the room moves on.",
      "Most of mine are bad; the good ones only showed up because I kept swinging.",
    ],
  },
  {
    slug: "experiments",
    title: "Experiments",
    line: "Built to find out.",
    sentences: [
      "I'd rather build it than argue about it.",
      "When Figma couldn't show how a shuffle should feel, I coded it; when Google's song search annoyed me, I rebuilt it.",
      "Experiments are how I find out I'm wrong quickly and cheaply.",
    ],
  },
  {
    slug: "products",
    title: "Products",
    line: "The part you can hold.",
    sentences: [
      "Products are where everything finally touches someone.",
      "At Maple Leaf Foods that meant moving $14M+ in penalties out of email chains and into an app people actually wanted to open.",
      "I care about the last five percent, the part nobody asks for and everybody notices.",
    ],
  },
];

export const identityIndex = (slug: string) => identities.findIndex((i) => i.slug === slug);
