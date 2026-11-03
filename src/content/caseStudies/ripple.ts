import type { CaseStudy } from "./types";

/**
 * Ported from the previous portfolio (rippleContent.ts) into Caleb Wu's rhythm; headlines are
 * first-person claims. The three research numbers now cite their sources (the old copy had none;
 * the water figure is restated as the paper gives it: 500 mL per 10 to 50 responses).
 */
export const ripple: CaseStudy = {
  slug: "ripple",
  year: "2026",
  summary:
    "Ripple is a concept for a more sustainable AI, focused on reuse, not regeneration. Before it generates anything, it searches the prompts people have already asked and resurfaces the most relevant answers, so everyday questions stop costing the water and energy data centres spend on each new response.",
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
    image: "/media/ripple/hero-still.webp",
    alt: "Ripple: the best LLM isn't an LLM",
    width: 1630,
    height: 912,
  },
  blocks: [
    {
      id: "problem",
      label: "The problem",
      headline: "We found that every AI answer quietly costs water and energy, and nobody sees it.",
      body: [
        "The experience is so seamless that we forget the compute, storage and cooling behind each response.",
      ],
      visual: {
        kind: "stats",
        stats: [
          {
            value: "500 mL",
            text: "of water for roughly every 10 to 50 GPT-3 responses, to cool data centres.",
            source: "Li, Yang, Islam and Ren",
            href: "https://arxiv.org/abs/2304.03271",
          },
          {
            value: "6.6B m\u00b3",
            text: "of water withdrawal projected for AI by 2027, at the upper estimate.",
            source: "Li, Yang, Islam and Ren",
            href: "https://arxiv.org/abs/2304.03271",
          },
          {
            value: "10x",
            text: "the electricity of a Google search, for one ChatGPT query.",
            source: "EPRI",
            href: "https://www.epri.com/research/products/000000003002028905",
          },
        ],
      },
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "We saw searches turn into AI prompts, often for answers that already exist.",
      body: [
        "Since ChatGPT launched in 2022, people ask LLMs everything, including the same questions again and again.",
      ],
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "We realised the cost is invisible, so nobody has a reason to change.",
      body: [
        "Nothing in an LLM shows the water or energy a response used. If people can't see it, they won't feel it.",
      ],
      pair: true,
    },
    {
      id: "solution-reuse",
      label: "Solution",
      headline: "We made Ripple search what has already been asked before it generates anything new.",
      body: [
        "Ask about the Eiffel Tower and Ripple resurfaces the most relevant existing answers instead of sending a new prompt.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/comparison.png",
            alt: "ChatGPT generating a new response next to Ripple resurfacing an existing answer",
            width: 889,
            height: 500,
          },
        ],
      },
      caption: "Generate a new answer, or reuse one that already exists.",
    },
    {
      id: "solution-fallback",
      label: "Solution",
      headline: "We kept a fallback: when nothing fits, Ripple answers with an efficient low-cost model.",
      body: ["Only when no suitable match exists does Ripple fall back to generation, like a typical LLM."],
      visual: {
        kind: "flow",
        columns: [
          ["A question"],
          ["Search past answers"],
          ["Resurface the best match", "No match: generate with an efficient model"],
        ],
      },
      caption: "How Ripple works: search and reuse before generation.",
    },
    {
      id: "decision-interface",
      label: "Design decision",
      headline: "I kept a ChatGPT-like interface so people know what to do from the first second.",
      body: [
        "The sustainable part happens quietly underneath, not as a new interaction anyone has to learn.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/ripple/home.mp4",
            poster: "/media/ripple/home.webp",
            alt: "Typing a prompt and choosing a resurfaced answer",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "Type a prompt, pick the resurfaced answer that fits.",
    },
    {
      id: "decision-water",
      label: "Design decision",
      headline: "I used water as the visual language so an invisible cost would finally feel real.",
      body: ["Water-saving animations, stats and a river of past usage gamify the better habit."],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/answer.png",
            alt: "An answer page showing 80 mL of water saved",
            width: 522,
            height: 1024,
          },
          {
            image: "/media/ripple/history.png",
            alt: "The history river: litres saved and prompts reused over the year",
            width: 522,
            height: 1024,
          },
        ],
      },
      caption: "Water saved on every answer, and the history river.",
    },
    {
      id: "research-context",
      label: "Research",
      headline: "We went looking for an everyday habit with a hidden environmental cost.",
      body: [
        "There are hundreds of environmental issues, from transportation and clothing to food waste. We wanted one action from everyday life, and something less commonly discussed.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/ideation.png",
            alt: "Early ideation map of everyday actions and climate awareness",
            width: 1024,
            height: 680,
          },
        ],
      },
      caption: "Early ideation: everyday actions and climate awareness.",
    },
    {
      id: "research-pain-points",
      label: "Research",
      headline: "We found AI replacing everyday search, at a cost almost nobody talks about.",
      body: [
        "Simple Google searches are being replaced by AI ones, and each AI answer costs far more to produce.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/research.png",
            alt: "Research collage on AI's environmental impact and everyday AI use",
            width: 888,
            height: 500,
          },
        ],
      },
      caption: "Research on AI's environmental impact.",
    },
    {
      id: "research-consolidating",
      label: "Research",
      headline:
        "We accepted that telling people to stop using AI would never work, and asked a better question.",
      body: [
        "In a world where AI is becoming unavoidable, the right response is not to avoid it, but to adapt it.",
      ],
      visual: { kind: "statement", text: "Why not redefine what it means to use an LLM?" },
    },
    {
      id: "ideation-options",
      label: "Solution ideation",
      headline: "We weighed our ideas against one test: change a habit, not a lifestyle.",
      body: [
        "We brainstormed widely, then kept the idea that worked with an existing habit and that few people discuss.",
      ],
      visual: {
        kind: "options",
        options: [
          {
            title: "Community sharing for borrowing items",
            pros: ["Real reuse of things people own"],
            cons: ["Asks people to change how they get things"],
          },
          {
            title: "Daily sustainability challenges",
            pros: ["Part of everyday life"],
            cons: ["Adds a new daily effort to keep up"],
          },
          {
            title: "A reduce, reuse, recycle app",
            pros: ["Familiar and easy to explain"],
            cons: ["A commonly discussed topic"],
          },
          {
            title: "Ripple: reuse AI answers",
            pros: ["Works with a habit people already have", "Rarely discussed"],
            cons: ["Only as good as the answers it resurfaces"],
            chosen: true,
          },
        ],
      },
      caption: "The four directions we brainstormed, against our two criteria.",
    },
    {
      id: "ideation-discover",
      label: "Solution ideation",
      headline: "I borrowed from Ditto Lists to let people browse what has already been asked.",
      body: [
        "A discover page with category filters encourages learning from existing knowledge before generating more.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/discover.png",
            alt: "Ripple discover page with category filters and prompt cards",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "The discover page.",
    },
    {
      id: "ideation-prototype",
      label: "Solution ideation",
      headline: "We built the whole flow as a clickable prototype.",
      body: ["Home, answer, discover and profile, connected in Figma so anyone can click through it."],
      visual: {
        kind: "embed",
        src: "https://embed.figma.com/proto/01XnqrdkdhHhUCY7Ii3AvT/BLOOM-Designathon-2026?node-id=36-1061&p=f&scaling=scale-down&content-scaling=fixed&starting-point-node-id=36%3A1061&page-id=0%3A1&embed-host=share",
        title: "Ripple prototype in Figma",
        poster: {
          image: "/media/ripple/hero-still.webp",
          alt: "Ripple prototype",
          width: 1630,
          height: 912,
        },
      },
      caption: "The Figma prototype. It loads only when you ask for it.",
    },
    {
      id: "ideation-feedback",
      label: "Solution ideation",
      headline: "We let people's votes teach Ripple which answers are most relevant.",
      body: ["Up and down votes on every resurfaced answer act as its algorithm for learning what fits."],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/ripple/answer.mp4",
            poster: "/media/ripple/answer.webp",
            alt: "An answer page with water saved, votes and follow-up questions",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "Water saved, votes and follow-ups on the answer page.",
    },
    {
      id: "final",
      label: "Final solution",
      headline: "We ended with an LLM that looks familiar and quietly saves water with every reuse.",
      body: ["The profile shows litres saved this month, a river of past usage and badges for milestones."],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/profile-history.png",
            alt: "Ripple profile and the river timeline of water savings",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "Profile and history.",
    },
    {
      id: "learnings",
      label: "Key learnings",
      headline: "I learned to meet people where they are, not where I wish they were.",
      body: [],
      visual: {
        kind: "list",
        items: [
          "Don't reinvent the LLM interface. People already know how to use ChatGPT, so Ripple looks and feels like it.",
          "Meet people where they are. Telling people to use AI less was never going to work; Ripple works with the habit instead of against it.",
          "Make the invisible feel real. If people can't see a cost, they won't feel it, and if they don't feel it, they won't care.",
        ],
      },
    },
  ],
  next: "maple-leaf-foods",
  draft: [
    "role",
    "team",
    "headlines rewritten as first-person claims",
    "ideation pros and cons: drafted from the two criteria in the old copy (everyday habit, less commonly discussed)",
  ],
};
