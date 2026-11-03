import type { CaseStudy } from "./types";

/** Ported from the previous portfolio (rippleContent.ts); headlines rewritten as claims. */
export const ripple: CaseStudy = {
  slug: "ripple",
  claim: "We redesigned what it means to use an LLM: reuse an answer first, generate only when nothing fits.",
  meta: {
    role: "Product designer",
    timeline: "BLOOM Designathon, 2026",
    scope: "Research, concept, interaction and visual design, prototype",
  },
  link: {
    label: "Figma prototype",
    href: "https://www.figma.com/proto/01XnqrdkdhHhUCY7Ii3AvT/BLOOM-Designathon-2026?node-id=36-1061&starting-point-node-id=36%3A1061",
  },
  hero: {
    video: "/media/ripple/hero.mp4",
    poster: "/media/ripple/hero.webp",
    alt: "Ripple's prompt screen with resurfaced answers",
    width: 1280,
    height: 716,
  },
  sections: [
    {
      id: "context",
      label: "Context",
      headline: "We went looking for an everyday habit with a hidden environmental cost.",
      body: [
        "There are hundreds of environmental issues to tackle, from transportation and clothing to food waste. We brainstormed a community lending platform, daily sustainability challenges and a reduce, reuse, recycle app.",
        "We wanted an unsustainable action from everyday life, so the solution could change behaviour without asking for a lifestyle overhaul, and something less commonly discussed.",
      ],
      media: [
        {
          image: "/media/ripple/ideation.png",
          alt: "Early ideation map of everyday actions and climate awareness",
          width: 1024,
          height: 680,
        },
      ],
    },
    {
      id: "problem",
      label: "Problem",
      headline: "We found that every AI answer quietly costs water and energy, and nobody sees it.",
      body: [
        "Since ChatGPT launched in 2022, LLMs have replaced simple searches and answer the same questions again and again. The experience is so seamless that we forget the compute, storage and cooling behind each response.",
        "It is estimated that every 10 ChatGPT responses use 500 mL of water to cool data centres, that AI water use could reach 6.6 billion cubic metres by 2027, and that a ChatGPT response can use up to ten times the energy of a Google search.",
      ],
      media: [
        {
          image: "/media/ripple/research.png",
          alt: "Research collage on AI's environmental impact and everyday AI use",
          width: 888,
          height: 500,
        },
      ],
    },
    {
      id: "insight",
      label: "Insight",
      headline: "Telling people to stop using AI was never going to work, so we changed what using it means.",
      body: [
        "In a world where AI is becoming unavoidable, the answer is not to avoid it but to adapt it. Ripple makes the sustainable choice the easy one, without asking anyone to change their behaviour.",
      ],
    },
    {
      id: "solution",
      label: "Solution",
      headline: "We made Ripple search what has already been asked before it generates anything new.",
      body: [
        "When a user enters a prompt, Ripple searches a database of previous prompts and resurfaces the most relevant answers, skipping generation and the water and energy it costs. Ask about the Eiffel Tower and you get the best existing answers. Only when nothing fits does Ripple generate, and then with efficient, low-cost models.",
      ],
      media: [
        {
          image: "/media/ripple/comparison.png",
          alt: "ChatGPT generating a new response next to Ripple resurfacing an existing answer",
          width: 889,
          height: 500,
        },
        {
          image: "/media/ripple/system-diagram.png",
          alt: "System diagram: search and reuse before generation",
          width: 1024,
          height: 673,
        },
      ],
    },
    {
      id: "features",
      label: "Key features",
      headline: "I kept the interface familiar so the sustainable part could happen quietly underneath.",
      body: [
        "The home page mimics a ChatGPT-like flow so people know what to do immediately; after typing, they pick the resurfaced answer that best matches. The answer page shows how much water they saved, takes follow-ups, and uses up and down votes to learn which answers are most relevant.",
      ],
      media: [
        {
          video: "/media/ripple/home.mp4",
          poster: "/media/ripple/home.webp",
          alt: "Typing a prompt and choosing a resurfaced answer",
          width: 860,
          height: 720,
        },
        {
          video: "/media/ripple/answer.mp4",
          poster: "/media/ripple/answer.webp",
          alt: "An answer page with water saved and follow-up questions",
          width: 860,
          height: 720,
        },
      ],
      points: [
        {
          title: "Discover",
          body: "Inspired by Ditto Lists: browse previously asked prompts by category and learn from existing knowledge.",
        },
        {
          title: "Profile",
          body: "Litres saved this month, a river timeline of past water use, and badges for milestones.",
        },
      ],
    },
    {
      id: "decisions",
      label: "Design decisions",
      headline: "I used water as the visual language so an invisible cost would finally feel real.",
      body: [
        "Water-saving animations, stats and the history river work together to make the cost visible and gamify the better habit. If people cannot see it, they will not feel it, and if they do not feel it, they will not care.",
      ],
      media: [
        {
          image: "/media/ripple/discover.png",
          alt: "Ripple discover page with category filters",
          width: 860,
          height: 720,
        },
        {
          image: "/media/ripple/profile-history.png",
          alt: "Ripple profile and the river timeline of water savings",
          width: 860,
          height: 720,
        },
      ],
    },
    {
      id: "reflection",
      label: "Reflection",
      headline: "I learned to meet people where they are, not where I wish they were.",
      body: [
        "Don't reinvent the LLM interface. People already know how to use ChatGPT, so Ripple looks and feels like it; the sustainability works underneath instead of as a new interaction to learn. And work with the habit, not against it: resurfacing old answers asks nobody to change.",
      ],
    },
  ],
  next: "maple-leaf-foods",
  draft: ["role", "team", "headlines rewritten as first-person claims"],
};
