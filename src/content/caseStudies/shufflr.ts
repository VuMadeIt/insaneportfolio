import type { CaseStudy } from "./types";

/** Ported from the previous portfolio (shufflrContent.ts); headlines rewritten as claims. */
export const shufflr: CaseStudy = {
  slug: "shufflr",
  claim:
    "I helped design a shuffle that turns a few loose preferences into a real hangout in under a minute.",
  meta: {
    role: "Product designer",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    timeline: "Product Design Sprint, 2026",
    scope: "Research, product strategy, interaction design, prototyping",
  },
  link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
  hero: {
    video: "/media/shufflr/hero.mp4",
    poster: "/media/shufflr/hero.webp",
    alt: "Shufflr on two phones: the shuffle and an activity card",
    width: 1280,
    height: 698,
  },
  sections: [
    {
      id: "context",
      label: "Context",
      headline:
        "We started from a gap: students want deeper friendships, but unstructured time together has become high-friction.",
      body: [
        "Shufflr is a concept for bringing back spontaneous, low-stakes hangout moments. Input a few loose preferences and it generates a curated shortlist of things to do nearby.",
        "It surfaces activities where people with overlapping interests are already showing up, and afterwards prompts the group to capture a memory of what they did, who with, and what it felt like.",
      ],
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
    {
      id: "problem",
      label: "Problem",
      headline: "We learned that planning, not desire, was what stopped people from hanging out.",
      body: [
        "How might we reduce the activation energy of in-person hangouts so that real connection becomes the path of least resistance? Every interview pointed at the same moment: someone has to propose a plan, and nobody wants to be that person.",
      ],
      quotes: [
        {
          text: "Nobody wants to be the one who plans something, so nothing happens.",
          who: "Waterloo student",
        },
        {
          text: "We have group chats with 15 people and still can't get four people to hang out.",
          who: "Gen Z student",
        },
        {
          text: "After work, I want to do something, but by the time I figure out what, I just go home.",
          who: "Young professional",
        },
        {
          text: "We used to hang out because someone was bored. Now everyone needs to check their calendar.",
          who: "30-year-old",
        },
      ],
    },
    {
      id: "solution",
      label: "Solution",
      headline: "So we made the plan the product: shuffle, pick, go.",
      body: [
        "Users enter a vibe, group size, distance and available time. Shufflr returns a short list of activities, cutting the time from group negotiation to hangout to under a minute. Preference-aware randomness removes the main drop-off point in social coordination.",
      ],
      media: [
        {
          video: "/media/shufflr/shuffle.mp4",
          poster: "/media/shufflr/shuffle.webp",
          alt: "The shuffle: preferences in, a shortlist of activities out",
          width: 1280,
          height: 720,
        },
      ],
    },
    {
      id: "features",
      label: "Key features",
      headline:
        "I designed every surface around getting a group out the door, then giving them a reason to come back.",
      body: [
        "Discover and plan shows trending activities, nearby events and price filters. Connect lets people join nearby communities and chats and send invites without cold outreach: new connections come from being in the same place, not from follow requests.",
      ],
      media: [
        {
          image: "/media/shufflr/discover.png",
          alt: "Shufflr home discovery, create event and group chat screens",
          width: 1024,
          height: 659,
        },
        {
          video: "/media/shufflr/community.mp4",
          poster: "/media/shufflr/community.webp",
          alt: "Joining a nearby community in Shufflr",
          width: 1280,
          height: 720,
        },
      ],
      points: [
        {
          title: "Profile and memories",
          body: "After each hangout the group is prompted to take a photo, which builds a shared album. The longer someone stays, the more the archive means to them.",
        },
      ],
    },
    {
      id: "system",
      label: "System",
      headline: "I tied each feature to one number that would tell us it worked.",
      body: [
        "Desirability: it targets the loneliness most acutely felt by 18 to 24 year olds. Viability: the memory archive builds a retention loop without constant feature novelty. Feasibility: activity generation builds on existing maps, events and reviews services rather than rebuilding them.",
      ],
      points: [
        {
          title: "Weekly active completers",
          body: "Share of weekly users who complete at least one Shufflr activity with another person.",
        },
        {
          title: "Shuffle-to-hangout conversion",
          body: "Share of shuffles that become a confirmed activity: the measure of the algorithm.",
        },
        {
          title: "Memory capture rate",
          body: "Share of completed activities that end in a saved memory: emotional investment.",
        },
        {
          title: "7-day return shuffle rate",
          body: "Share of users who shuffle again within a week of their first activity.",
        },
      ],
      media: [
        {
          image: "/media/shufflr/profile-memories.png",
          alt: "A hangout photo prompt, a shared memory and the event album",
          width: 1024,
          height: 659,
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      headline:
        "I learned to talk to people before Figma, and to code the parts that flat screens cannot show.",
      body: [
        "We only found that planning was the friction because we ran interviews early and kept going back to them instead of assuming we already knew the problem.",
        "The shuffle-to-result flow was impossible to feel out as static frames, so I vibe coded it with Claude to test real timing and randomisation. Seeing it move changed decisions that mockups never would have surfaced.",
      ],
    },
  ],
  next: "ripple",
  draft: ["role", "headlines rewritten as first-person claims"],
};
