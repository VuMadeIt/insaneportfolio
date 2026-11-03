import type { CaseStudy } from "./types";

/**
 * Ripple, rewritten in revision 4 (PLAN 13.6): Rachel Chen's structure (brief, my role, problem,
 * research, explorations, solution, decisions, outcome, reflection) in Caleb Wu's rhythm, with
 * coded graphics. Team facts from Lucas (8 hours, 3rd place, his four roles) and Samuel Huang's
 * post (the challenge, the team). The old case study supplies the concept, the ideation map and the
 * decisions. Research published after the event is used only in "Looking back", with sources.
 */
export const ripple: CaseStudy = {
  slug: "ripple",
  year: "2026",
  accent: "#2f6f9e",
  accentSoft: "#d6e8f4",
  summary:
    "Ripple is an AI assistant that checks whether your question has already been answered before it generates a new answer. It resurfaces past answers first, falls back to an efficient model only when nothing fits, and shows each person how much water their questions saved.",
  claim:
    "We designed an AI assistant that reuses answers before it generates new ones, so everyday questions cost less water.",
  meta: {
    role: "Research, concept, UI design, prototype and pitch",
    team: "Samuel Huang, Jonathan Zhou, Grace Yu, Lucas Vu",
    timeline: "8 hours, UW/UX BLOOM Designathon, March 2026",
    scope: "Desk research, interviews, competitor review, product design",
    outcome: "3rd place",
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
      id: "brief",
      label: "The brief",
      headline: "We had eight hours to make sustainable action part of an everyday habit.",
      body: [
        "BLOOM, run by UW/UX and UW Blueprint, gave every team the same question and one working day to answer it with a designed product.",
      ],
      visual: {
        kind: "brief",
        prompt:
          "How might we use design and technology to make climate awareness and sustainable action easier to understand and practice in everyday life?",
        source: "The BLOOM Designathon challenge",
        facts: [
          { label: "Event", value: "UW/UX BLOOM Designathon 2026" },
          { label: "Time", value: "8 hours" },
          { label: "Team", value: "4 designers" },
          { label: "Result", value: "3rd place" },
        ],
      },
    },
    {
      id: "role",
      label: "My role",
      headline: "I worked on every stage, from the research to the pitch.",
      body: ["In a team of four with eight hours, everyone touched everything. My part of it:"],
      visual: {
        kind: "list",
        items: [
          "Research: the papers and articles on what AI costs in water and energy, and conversations with students about how they use ChatGPT.",
          "Concept: choosing the problem and shaping the idea of reuse before regeneration.",
          "UI design: the home, answer, discover and profile screens.",
          "Prototype and pitch: the Figma prototype, and presenting it to the judges.",
        ],
      },
    },
    {
      id: "ideation",
      label: "Finding the problem",
      headline: "We went looking for a habit people repeat every day, not a lifestyle change.",
      body: [
        "We mapped everyday actions with a climate cost and what each could become. We wanted an action where a small change, repeated, adds up, and one that people talk about less.",
      ],
      visual: {
        kind: "diagram",
        cols: 3,
        widths: "minmax(0,0.8fr) minmax(0,0.9fr) minmax(0,1.3fr)",
        nodes: [
          { id: "c", text: "Climate awareness", col: 0, row: 0, rowSpan: 5, tone: "ink" },
          { id: "t", text: "Transport", col: 1, row: 0 },
          { id: "f", text: "Food waste", col: 1, row: 1 },
          { id: "th", text: "Thrifting", col: 1, row: 2 },
          { id: "g", text: "Garbage", col: 1, row: 3 },
          { id: "ai", text: "AI usage", col: 1, row: 4, tone: "accent" },
          { id: "t2", text: "A carpooling app", col: 2, row: 0, tone: "ghost" },
          { id: "f2", text: "An app for one kind of food waste", col: 2, row: 1, tone: "ghost" },
          { id: "th2", text: "A community thrifting app", col: 2, row: 2, tone: "ghost" },
          { id: "g2", text: "Something to make things out of garbage", col: 2, row: 3, tone: "ghost" },
          {
            id: "ai2",
            text: "Something about the data centres behind every prompt",
            col: 2,
            row: 4,
            tone: "white",
          },
        ],
        edges: [
          { from: "c", to: "t", tone: "muted" },
          { from: "c", to: "f", tone: "muted" },
          { from: "c", to: "th", tone: "muted" },
          { from: "c", to: "g", tone: "muted" },
          { from: "c", to: "ai", tone: "accent" },
          { from: "t", to: "t2", tone: "muted", dashed: true },
          { from: "f", to: "f2", tone: "muted", dashed: true },
          { from: "th", to: "th2", tone: "muted", dashed: true },
          { from: "g", to: "g2", tone: "muted", dashed: true },
          { from: "ai", to: "ai2", tone: "accent" },
        ],
      },
      caption: "Redrawn from our whiteboard map. The branch nobody else was talking about was AI.",
    },
    {
      id: "criteria",
      label: "Finding the problem",
      headline: "We chose AI prompts because they are daily, invisible and rarely discussed.",
      body: [
        "We held each idea we had brainstormed against the two things we wanted: an action people repeat every day, and one that is not already the subject of every sustainability campaign.",
      ],
      visual: {
        kind: "table",
        columns: ["Repeated every day", "Rarely talked about", "Needs no new habit"],
        rows: [
          { label: "A borrowing and sharing platform", cells: [false, false, false] },
          { label: "Daily sustainability challenges", cells: [true, false, false] },
          { label: "A reduce, reuse, recycle app", cells: [true, false, false] },
          { label: "Asking an AI a question", cells: [true, true, true], ours: true },
        ],
      },
    },
    {
      id: "problem",
      label: "The problem",
      headline: "We found that every AI answer has a cost nobody sees.",
      body: [
        "LLMs now answer everything from simple facts to questions asked a thousand times before, and the experience is so smooth that the data centre behind each answer disappears. The numbers we worked from:",
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
      headline: "We noticed that many everyday questions have already been answered.",
      body: [
        "Simple searches are moving to chat, and the same question comes back in slightly different words. Each version is generated from scratch.",
      ],
      visual: {
        kind: "diagram",
        cols: 2,
        minWidth: 0,
        rowGap: 10,
        gap: "clamp(48px, 5vw, 80px)",
        widths: "auto minmax(0,1fr)",
        nodes: [
          { id: "q1", text: "how tall is the eiffel tower?", col: 0, row: 0, tone: "chip" },
          { id: "q2", text: "eiffel tower height", col: 0, row: 1, tone: "chip" },
          { id: "q3", text: "How high is the Eiffel Tower in metres", col: 0, row: 2, tone: "chip" },
          { id: "q4", text: "what's the height of the eiffel tower", col: 0, row: 3, tone: "chip" },
          { id: "q5", text: "Eiffel Tower how tall", col: 0, row: 4, tone: "chip" },
          {
            id: "a",
            text: "About 330 metres, antennas included.",
            sub: "One answer that only needed generating once",
            col: 1,
            row: 0,
            rowSpan: 5,
            tone: "accent",
          },
        ],
        edges: ["q1", "q2", "q3", "q4", "q5"].map((q) => ({ from: q, to: "a", tone: "accent" as const })),
      },
      caption: "Five ways to ask one question, five generations.",
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "We realised that telling people to use AI less would never work.",
      body: [
        "AI is part of daily life now. A product that asks people to give it up loses before it starts; one that changes what happens underneath does not have to ask.",
      ],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "Ask people to change",
            items: ["Use ChatGPT less", "Search before you prompt", "Feel bad about it"],
          },
          {
            title: "Change what happens underneath",
            tone: "accent",
            items: [
              "Ask the way you already do",
              "Get an existing answer if there is one",
              "See what that saved",
            ],
          },
        ],
      },
      pair: true,
    },
    {
      id: "competitors",
      label: "Competitor review",
      headline: "I looked at where people ask questions today: none reuse an answer or show its cost.",
      body: [
        "The tools people already use answer questions well. None of them tell you an answer already exists, or what yours cost to make.",
      ],
      visual: {
        kind: "table",
        columns: ["Familiar chat", "Reuses past answers first", "Shows the water and energy"],
        rows: [
          { label: "ChatGPT", cells: [true, false, false] },
          { label: "Perplexity", cells: [true, false, false] },
          { label: "Google Search", cells: [false, "Links to pages", false] },
          { label: "Ripple", cells: [true, true, true], ours: true },
        ],
      },
    },
    {
      id: "opportunity",
      label: "The opportunity",
      headline: "So we asked a different question: why not redefine what it means to use an LLM?",
      body: ["In a world where AI is unavoidable, the answer is not to avoid it but to adapt it."],
      visual: {
        kind: "statement",
        text: "How might we make an everyday AI question cost less, without asking anyone to change how they ask it?",
      },
    },
    {
      id: "solution",
      label: "Solution",
      headline: "We designed Ripple to search before it generates.",
      body: [
        "A question first goes to a library of answers that already exist. If one fits, Ripple shows it with what reusing it saved. Only when nothing fits does it generate, and then with an efficient, low-cost model.",
      ],
      visual: {
        kind: "diagram",
        cols: 4,
        minWidth: 960,
        gap: "clamp(96px, 9vw, 150px)",
        nodes: [
          { id: "q", text: "Your question", col: 0, row: 0, rowSpan: 2, tone: "ink" },
          {
            id: "s",
            text: "Search past answers",
            sub: "prompts people already asked",
            col: 1,
            row: 0,
            rowSpan: 2,
            tone: "white",
          },
          {
            id: "hit",
            text: "Show the existing answer",
            sub: "and the water it saved",
            col: 2,
            row: 0,
            tone: "accent",
          },
          {
            id: "miss",
            text: "Generate a new answer",
            sub: "with an efficient, low-cost model",
            col: 2,
            row: 1,
          },
          {
            id: "vote",
            text: "Votes rank the answers",
            sub: "so the best match rises",
            col: 3,
            row: 0,
            tone: "white",
          },
          {
            id: "keep",
            text: "It joins the library",
            sub: "for the next person who asks",
            col: 3,
            row: 1,
            tone: "white",
          },
        ],
        edges: [
          { from: "q", to: "s" },
          { from: "s", to: "hit", label: "a close match", tone: "accent" },
          { from: "s", to: "miss", label: "nothing fits", tone: "muted" },
          { from: "hit", to: "vote", tone: "accent" },
          { from: "miss", to: "keep", tone: "muted" },
        ],
      },
      caption:
        "How a question moves through Ripple. A typical LLM goes straight from question to generation, every time.",
    },
    {
      id: "same-answer",
      label: "Solution",
      headline: "We kept the answer the same and changed where it comes from.",
      body: ["Side by side, the difference is invisible to the person asking. That is the point."],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/comparison.png",
            alt: "ChatGPT generating a new answer about the Eiffel Tower, next to Ripple resurfacing an existing one",
            width: 889,
            height: 500,
          },
        ],
      },
      caption: "Same question: ChatGPT generates the answer again; Ripple resurfaces one that exists.",
    },
    {
      id: "decision-familiar",
      label: "Design decision",
      headline: "I kept the interface familiar, so nobody has to learn a new tool.",
      body: [
        "Ripple opens like ChatGPT: a prompt box and nothing else to learn. Type a question and the matching answers that already exist appear first, ready to pick.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/ripple/home.mp4",
            poster: "/media/ripple/home.webp",
            alt: "Typing a question on Ripple's home screen and choosing from existing answers",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "The home screen: ask, then pick from answers that already exist.",
    },
    {
      id: "decision-answer",
      label: "Design decision",
      headline: "I designed the answer page so a reused answer earns trust at a glance.",
      body: [
        "A resurfaced answer has to show which question it answered, how others rated it, and that you can still keep going.",
      ],
      visual: {
        kind: "anatomy",
        image: {
          src: "/media/ripple/answer.png",
          alt: "Ripple's answer page for the question how do I use an em dash",
          width: 522,
          height: 1024,
        },
        points: [
          {
            x: 80,
            y: 12,
            title: "What it saved",
            text: "Every reused answer says how much water it saved, in millilitres.",
          },
          {
            x: 10,
            y: 21,
            title: "The question it answered",
            text: "The original prompt sits on top, so you can judge the match yourself.",
          },
          {
            x: 76,
            y: 29,
            title: "Votes",
            text: "Up and down votes are how Ripple learns which answers fit best.",
          },
          { x: 60, y: 89, title: "Follow up", text: "Ask more and Ripple carries on like any chat." },
        ],
      },
    },
    {
      id: "decision-water",
      label: "Design decision",
      headline: "I made the saving visible, because people do not care about what they cannot see.",
      body: [
        "Water runs through the whole design. The profile counts the litres you saved this month, and a river of past questions, with badges at milestones, turns the saving into something you can watch grow.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/profile-history.png",
            alt: "Ripple's profile with 500 litres saved, and the history river",
            width: 860,
            height: 720,
          },
        ],
      },
      caption: "The profile and the history river.",
    },
    {
      id: "discover",
      label: "Solution",
      headline: "We added Discover so people can learn from answers that already exist.",
      body: [
        "Inspired by Ditto Lists, Discover lets you browse questions others have asked by category, and learn without generating anything new.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/ripple/discover.png",
            alt: "Ripple's Discover page with categories and question cards",
            width: 860,
            height: 720,
          },
        ],
      },
    },
    {
      id: "prototype",
      label: "Prototype",
      headline: "We built the whole flow as a Figma prototype for the judges.",
      body: ["Ask, pick an existing answer, follow up, see the saving. Open it to try the flow yourself."],
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
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "We placed 3rd at BLOOM.",
      body: ["Out of the teams at UW/UX and UW Blueprint's designathon, in eight hours."],
      visual: { kind: "podium", place: 3, name: "Ripple" },
    },
    {
      id: "hindsight-scale",
      label: "Looking back",
      headline: "I went back to the research: the idea is stronger at scale than per prompt.",
      body: [
        "Since we worked from the 2023 estimate, Google and OpenAI have published their own per-prompt numbers, far lower. One prompt costs a few drops. Billions a day still add up.",
      ],
      visual: {
        kind: "bars",
        scale: "log",
        min: 0.1,
        max: 100,
        ticks: [0.1, 1, 10, 100],
        unit: "mL",
        bars: [
          {
            label: "The estimate we worked from",
            sub: "GPT-3, 2023",
            source: "Li et al.",
            href: "https://arxiv.org/abs/2304.03271",
            value: [10, 50],
            display: "10 to 50 mL",
            tone: "soft",
          },
          {
            label: "Average ChatGPT query",
            sub: "OpenAI, 2025, not peer reviewed",
            source: "Altman",
            href: "https://blog.samaltman.com/the-gentle-singularity",
            value: 0.32,
            display: "0.32 mL",
            tone: "ink",
          },
          {
            label: "Median Gemini text prompt",
            sub: "Google, 2025",
            source: "Google",
            href: "https://arxiv.org/abs/2508.15734",
            value: 0.26,
            display: "0.26 mL",
            tone: "accent",
          },
        ],
      },
      caption:
        "Water per prompt, on a log scale. At Google's own figure, the 2.5 billion prompts ChatGPT receives a day (Axios, July 2025) would still use about 650,000 litres.",
    },
    {
      id: "hindsight-personal",
      label: "Looking back",
      headline: "I'd make Ripple personal first, because that is where questions repeat.",
      body: [
        "Studies of semantic caching since have measured how often questions really repeat. Across everyone's public chats, rarely. Within one person's own history, often. A reused answer can also go out of date.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 40,
        ticks: [0, 10, 20, 30, 40],
        unit: "%",
        bars: [
          {
            label: "Questions an earlier one could answer, public chat logs",
            source: "SCALM, LMSYS and MOSS",
            href: "https://arxiv.org/abs/2406.00025",
            value: [4.5, 7.5],
            display: "4.5 to 7.5%",
            tone: "soft",
          },
          {
            label: "One person's questions similar to their own earlier ones",
            source: "MeanCache, 20 users",
            href: "https://arxiv.org/abs/2403.02694",
            value: 31,
            display: "about 31%",
            tone: "accent",
          },
        ],
      },
      caption:
        "What I'd change: start from your own history and your campus's, show the saving as a range rather than one number, and date every answer so stale ones retire.",
    },
    {
      id: "learnings",
      label: "Key learnings",
      headline: "I learned to meet people where they are and to make the invisible visible.",
      body: [],
      visual: {
        kind: "list",
        items: [
          "Don't reinvent the interface. People already know how to use ChatGPT, so Ripple looks and feels like it; the sustainability happens quietly underneath.",
          "Meet people where they are, not where you wish they were. Telling people to use AI less was never going to work; Ripple works with the habit instead.",
          "Make the invisible feel real. Water and energy are hidden in every LLM. If people can't see it they won't feel it, and if they don't feel it they won't care.",
          "Check the numbers again after the event. The case got more honest, and more interesting, once the per-prompt figures came down.",
        ],
      },
    },
  ],
  next: "shufflr",
  draft: [
    "the competitor table rows (which tools the review covered)",
    "the criteria table ticks, judged from the two criteria in the old copy",
    "the opportunity question, condensed from the old copy",
  ],
};
