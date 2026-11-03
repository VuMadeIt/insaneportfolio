import type { CaseStudy } from "./types";

/**
 * Ported from the previous portfolio (shufflrContent.ts) into Caleb Wu's rhythm; headlines are
 * first-person claims. Every fact, number and quote comes from that file.
 */
export const shufflr: CaseStudy = {
  slug: "shufflr",
  year: "2026",
  summary:
    "Shufflr is a concept for bringing back spontaneous, low-stakes hangout moments. Put in a few loose preferences and it shuffles up a shortlist of things to do nearby, where people with overlapping interests are already showing up; afterwards it prompts the group to keep a memory of what they did, who with, and what it felt like.",
  claim:
    "I helped design a shuffle that turns a few loose preferences into a real hangout in under a minute.",
  meta: {
    role: "Product designer",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    timeline: "Western University Product Design Sprint, 2026. 1st place and Most Practical",
    scope: "Research, product strategy, interaction design, prototyping",
  },
  link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
  hero: {
    image: "/media/shufflr/hero.webp",
    alt: "Shufflr on two phones: the shuffle and an activity card",
    width: 1280,
    height: 698,
  },
  blocks: [
    {
      id: "problem",
      label: "The problem",
      headline: "We learned that planning, not desire, was what stopped people from hanging out.",
      body: [
        "University students want deeper friendships, but coordinating unstructured social time has become high-friction. Someone has to propose a plan, and nobody wants to be that person.",
      ],
      visual: {
        kind: "statement",
        text: "How might we reduce the activation energy of in-person hangouts so that authentic connection becomes the path of least resistance?",
      },
      caption: "The question the whole sprint answered.",
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "We heard that big group chats still don't turn into hangouts.",
      body: ["A chat full of friends is not a plan, and someone still has to propose one."],
      visual: { kind: "dots", total: 15, lit: 4 },
      caption:
        "\u201cWe have group chats with 15 people and still can\u2019t get four people to hang out.\u201d",
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "We heard that every hangout now feels like an event to schedule.",
      body: [
        "Spontaneity used to come from boredom. Now it waits for everyone's calendar, and the moment passes.",
      ],
      visual: {
        kind: "quotes",
        quotes: [
          {
            text: "We used to hang out because someone was bored. Now everyone needs to check their calendar.",
            who: "30-year-old",
          },
          {
            text: "Everything feels like an event now. Sometimes I just want to go do something stupid with my friends.",
            who: "21-year-old",
          },
        ],
      },
      pair: true,
    },
    {
      id: "solution-shuffle",
      label: "Solution",
      headline: "So we made the plan the product: shuffle, pick, go.",
      body: [
        "Users enter a vibe, group size, distance and available time. Shufflr returns a shortlist of activities, cutting group negotiation to under a minute.",
      ],
      visual: {
        kind: "flow",
        columns: [["Vibe", "Group size", "Distance", "Available time"], ["Shuffle"], ["A shortlist nearby"]],
      },
      caption: "Preference-aware randomness removes the main drop-off point in social coordination.",
    },
    {
      id: "solution-discover",
      label: "Solution",
      headline: "We put the next hangout one tap away with Discover and plan.",
      body: ["Trending activities, low-stakes hangout sessions and events nearby, filtered by price."],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/shufflr/discover.png",
            alt: "Home discovery, create event and group chat",
            width: 1024,
            height: 659,
          },
        ],
      },
      caption: "Home discovery, create event and group chat.",
    },
    {
      id: "decision-connect",
      label: "Design decision",
      headline: "I designed connection around being in the same place, not around follow requests.",
      body: [
        "People join nearby communities and chats and send invites without cold outreach. Every activity becomes a touchpoint, with no acquisition cost.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/shufflr/community.mp4",
            poster: "/media/shufflr/community.webp",
            alt: "Joining a nearby community",
            width: 1280,
            height: 720,
          },
        ],
      },
      caption: "Joining a nearby community.",
    },
    {
      id: "decision-memories",
      label: "Design decision",
      headline: "I turned every hangout into a memory, so the app means more the longer you stay.",
      body: [
        "After each hangout the group is prompted for a photo, which builds a shared album of what they did and who with.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/shufflr/profile-memories.png",
            alt: "A hangout photo prompt, a shared memory and the event album",
            width: 1024,
            height: 659,
          },
        ],
      },
      caption: "The photo prompt, a shared memory and the album.",
    },
    {
      id: "research-context",
      label: "Research",
      headline: "We started from the numbers: close friendship takes time most students never get.",
      body: ["Before any screens, we looked at what the research says about making friends at this age."],
      visual: {
        kind: "stats",
        stats: [
          {
            value: "200",
            text: "hours is how long it takes for someone to become a close friend.",
            source: "Jeffrey A. Hall",
            href: "https://journals.sagepub.com/doi/10.1177/0265407518761225",
          },
          {
            value: "56%",
            text: "of college students say it is difficult to make friends.",
            source: "American Friendship Project",
            href: "https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0305834",
          },
          {
            value: "17%",
            text: "of Canadians aged 15 to 24 often or always feel lonely.",
            source: "Statistics Canada",
            href: "https://www150.statcan.gc.ca/n1/pub/11-627-m/11-627-m2021052-eng.htm",
          },
        ],
      },
    },
    {
      id: "research-pain-points",
      label: "Research",
      headline: "I kept going back to interviews instead of assuming we already knew the problem.",
      body: [
        "Students, young professionals and a 30-year-old all described the same moment from different sides.",
      ],
      visual: {
        kind: "quotes",
        quotes: [
          {
            text: "Nobody wants to be the one who plans something, so nothing happens.",
            who: "Waterloo student",
          },
          {
            text: "After work, I want to do something, but by the time I figure out what, I just go home.",
            who: "Young professional",
          },
          {
            text: "I have friends I\u2019d love to see more often. We just never actually make plans.",
            who: "Young professional",
          },
          {
            text: "We have group chats with 15 people and still can\u2019t get four people to hang out.",
            who: "Gen Z student",
          },
        ],
      },
    },
    {
      id: "research-consolidating",
      label: "Research",
      headline: "We boiled every interview down to one finding: the plan is the friction.",
      body: [
        "Different people, one pattern. Wanting to hang out was never the problem; deciding what to do was.",
      ],
      visual: {
        kind: "flow",
        columns: [
          ["Nobody wants to plan", "Group chats stall", "Everything is an event"],
          ["Planning, not desire, is the friction"],
          ["Lower the activation energy of a hangout"],
        ],
      },
      caption: "From interview quotes to the problem statement.",
    },
    {
      id: "ideation-criteria",
      label: "Solution ideation",
      headline: "We tested the concept against desirability, viability and feasibility.",
      body: ["A concept only survives the sprint if people want it, it can last, and it can be built."],
      visual: {
        kind: "cards",
        cards: [
          {
            title: "Desirability",
            body: "Targets the loneliness and social friction most acutely felt by 18 to 24 year olds, who over-index on mobile use and under-index on social satisfaction.",
          },
          {
            title: "Viability",
            body: "The memory archive is a retention flywheel: emotional investment grows with use, without needing constant feature novelty.",
          },
          {
            title: "Feasibility",
            body: "Activity generation builds on existing maps, events and reviews services; Shufflr brings them together rather than rebuilding them.",
          },
        ],
      },
    },
    {
      id: "ideation-metrics",
      label: "Solution ideation",
      headline: "I tied each feature to the one number that would prove it worked.",
      body: ["Every surface had to earn its place with a metric we could actually watch."],
      visual: {
        kind: "flow",
        columns: [
          ["The Shuffle", "Discover and plan", "Connect", "Profile and memories"],
          ["Shuffle-to-hangout rate", "Weekly active completers", "7-day return rate", "Memory capture rate"],
        ],
      },
      caption: "Feature to metric: algorithm quality, activation, retention, emotional investment.",
    },
    {
      id: "ideation-prototype",
      label: "Solution ideation",
      headline: "I coded the shuffle, because flat frames could not show how it should feel.",
      body: [
        "The shuffle-to-result flow was impossible to judge as static screens, so I vibe coded it with Claude.",
      ],
      visual: {
        kind: "scrub",
        video: "/media/shufflr/shuffle-scrub.mp4",
        poster: "/media/shufflr/shuffle.webp",
        alt: "The shuffle prototype: preferences in, a shortlist out",
        width: 1280,
        height: 720,
      },
      caption: "Scroll to play the prototype frame by frame.",
    },
    {
      id: "ideation-feedback",
      label: "Solution ideation",
      headline: "I found that seeing it move changed decisions static frames never would have surfaced.",
      body: [
        "Testing real timing and randomisation in the coded prototype told us more than any review of mockups could.",
      ],
    },
    {
      id: "final",
      label: "Final solution",
      headline: "We ended with a loop that takes a group from idea to hangout in under a minute.",
      body: [
        "Shuffle, discover, connect, and keep the memory: one loop that gets people out the door and back again.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/shufflr/hero.mp4",
            poster: "/media/shufflr/hero.webp",
            alt: "Shufflr from shuffle to activity",
            width: 1280,
            height: 698,
          },
        ],
      },
      caption: "Shufflr, end to end.",
    },
    {
      id: "learnings",
      label: "Key learnings",
      headline: "I learned to talk to people before Figma, and to code what screens cannot show.",
      body: [],
      visual: {
        kind: "list",
        items: [
          "Talk to people before you talk to Figma. Planning, not desire, was the friction, and that only came out because we ran interviews early and kept going back to them.",
          "Prototype the parts that don't demo well in static mockups. Seeing the shuffle move changed decisions that frames never would have surfaced.",
        ],
      },
    },
  ],
  next: "ripple",
  draft: ["role", "headlines rewritten as first-person claims", "block bodies condensed from the old copy"],
};
