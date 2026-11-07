import type { CaseStudy } from "./types";

/**
 * Shufflr, rewritten in revision 4 (PLAN 13.6). Facts from Lucas (48 hours, more than 20 people
 * interviewed, his four roles, 1st place and Most Practical), his LinkedIn post (the challenge, the
 * three inputs, 4 to 6 cards, the photo prompt) and the old case study (quotes, strategy, metrics,
 * learnings).
 */
export const shufflr: CaseStudy = {
  slug: "shufflr",
  accent: "#6a3df0",
  accentSoft: "#e6defd",
  summary:
    "Shufflr brings back spontaneous, low-stakes hangouts. Three inputs, time, budget and vibe, and a shuffle turns them into four to six things to do nearby, so a plan comes together in under a minute. During the hangout it prompts a photo for the group's private archive.",
  claim: "We designed a shuffle that turns three loose preferences into a real hangout in under a minute.",
  meta: {
    role: "Interviews and research, product strategy, UI design, coded prototype",
    team: "Emma Phuntsok, Jasmine Kumar, Kelly M, Lucas Vu",
    timeline: "48 hours, Western University Product Design Sprint, April 2026",
    scope: "Interviews, synthesis, strategy, product design, prototyping",
    outcome: "1st place and Most Practical",
  },
  link: { label: "Devpost", href: "https://devpost.com/software/shufflr" },
  hero: {
    image: "/media/shufflr/hero.webp",
    alt: "Shufflr on two phones: the shuffle and an activity card",
    width: 1916,
    height: 1046,
  },
  blocks: [
    {
      id: "brief",
      label: "The brief",
      headline: "We had 48 hours to bring back what made 2016 feel alive.",
      body: [
        "Western University and Western Founders Network ran the sprint. Every team got the same question about 2016 and a weekend to answer it.",
      ],
      visual: {
        kind: "brief",
        prompt:
          "How might we design a digital experience that recaptures some of what made 2016 feel so alive, and translate it into something that works for people today?",
        source: "The Product Design Sprint challenge",
        facts: [
          { label: "Event", value: "Western University Product Design Sprint 2026" },
          { label: "Time", value: "48 hours" },
          { label: "Team", value: "4 designers" },
          { label: "Result", value: "1st place and Most Practical" },
        ],
      },
    },
    {
      id: "role",
      label: "My role",
      headline: "I ran interviews, shaped the strategy, designed screens and coded the shuffle.",
      body: ["Four of us split the weekend, and I worked across it:"],
      visual: {
        kind: "list",
        items: [
          "Interviews and research: talking to more than 20 people, and the numbers behind friendship and loneliness.",
          "Product strategy: desirability, viability and feasibility, and the metric each feature had to move.",
          "UI design: the shuffle, discover, connect and memories screens.",
          "Coded prototype: the shuffle itself, built with Claude so we could feel its timing.",
        ],
      },
    },
    {
      id: "reading",
      label: "Reading the brief",
      headline: "We decided what 2016 had was spontaneity: hangouts nobody had to plan.",
      body: [
        "We wanted to bring back the spontaneous, low-stakes moments many of us remember from back then: someone is free, someone suggests something, and you go.",
      ],
    },
    {
      id: "research-friendship",
      label: "Research",
      headline: "We started from the research: close friendships take time most students never get.",
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
      id: "interviews",
      label: "Research",
      headline: "We talked to more than 20 people, and they all described the same stall.",
      body: [
        "Students, young professionals and people in their thirties told us the same story from different sides: everyone wants to hang out, and nothing gets planned.",
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
            text: "We have group chats with 15 people and still can\u2019t get four people to hang out.",
            who: "Gen Z student",
          },
          {
            text: "I have friends I\u2019d love to see more often. We just never actually make plans.",
            who: "Young professional",
          },
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
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "We heard that big group chats still don't turn into hangouts.",
      body: ["A chat full of friends is not a plan. Someone still has to propose one, and nobody wants to."],
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
      id: "synthesis",
      label: "Synthesis",
      headline: "We boiled it down to one finding: planning, not desire, is the friction.",
      body: ["Every quote landed in one of three themes, and all three pointed at the same thing."],
      visual: {
        kind: "diagram",
        cols: 3,
        minWidth: 900,
        widths: "minmax(0,1.2fr) minmax(0,0.9fr) minmax(0,0.9fr)",
        nodes: [
          {
            id: "q1",
            text: "\u201cNobody wants to be the one who plans\u201d",
            col: 0,
            row: 0,
            tone: "chip",
          },
          { id: "q2", text: "\u201cWe just never actually make plans\u201d", col: 0, row: 1, tone: "chip" },
          {
            id: "q3",
            text: "\u201cBy the time I figure out what, I go home\u201d",
            col: 0,
            row: 2,
            tone: "chip",
          },
          {
            id: "q4",
            text: "\u201c15 people, can\u2019t get four to hang out\u201d",
            col: 0,
            row: 3,
            tone: "chip",
          },
          {
            id: "q5",
            text: "\u201cEveryone needs to check their calendar\u201d",
            col: 0,
            row: 4,
            tone: "chip",
          },
          { id: "q6", text: "\u201cEverything feels like an event\u201d", col: 0, row: 5, tone: "chip" },
          { id: "t1", text: "Nobody owns the plan", col: 1, row: 0, rowSpan: 2, tone: "white" },
          { id: "t2", text: "Deciding takes too long", col: 1, row: 2, rowSpan: 2, tone: "white" },
          { id: "t3", text: "Every plan needs a schedule", col: 1, row: 4, rowSpan: 2, tone: "white" },
          {
            id: "f",
            text: "Planning, not desire, is the friction",
            sub: "So lower the activation energy of a hangout",
            col: 2,
            row: 0,
            rowSpan: 6,
            tone: "accent",
          },
        ],
        edges: [
          { from: "q1", to: "t1", tone: "muted" },
          { from: "q2", to: "t1", tone: "muted" },
          { from: "q3", to: "t2", tone: "muted" },
          { from: "q4", to: "t2", tone: "muted" },
          { from: "q5", to: "t3", tone: "muted" },
          { from: "q6", to: "t3", tone: "muted" },
          { from: "t1", to: "f", tone: "accent" },
          { from: "t2", to: "f", tone: "accent" },
          { from: "t3", to: "f", tone: "accent" },
        ],
      },
      caption: "From interview quotes to themes to the finding.",
    },
    {
      id: "opportunity",
      label: "The opportunity",
      headline: "So we set ourselves one question.",
      body: [],
      visual: {
        kind: "statement",
        text: "How might we reduce the activation energy of in-person hangouts so that authentic connection becomes the path of least resistance?",
      },
    },
    {
      id: "solution",
      label: "Solution",
      headline: "We cut planning down to three inputs and a shuffle.",
      body: [
        "Time, budget and vibe. Everything else is the shuffle's job: it returns four to six activity cards nearby, so a group goes from idea to plan in under 60 seconds.",
      ],
      visual: {
        kind: "diagram",
        cols: 3,
        minWidth: 720,
        widths: "minmax(0,0.8fr) minmax(0,0.8fr) minmax(0,1fr)",
        nodes: [
          { id: "t", text: "Time", sub: "how long you have", col: 0, row: 0, tone: "white" },
          { id: "b", text: "Budget", sub: "what you want to spend", col: 0, row: 1, tone: "white" },
          { id: "v", text: "Vibe", sub: "chill, active, new", col: 0, row: 2, tone: "white" },
          {
            id: "s",
            text: "The shuffle",
            sub: "preference-aware randomness",
            col: 1,
            row: 0,
            rowSpan: 3,
            tone: "ink",
          },
          {
            id: "c",
            text: "4 to 6 activity cards nearby",
            sub: "a plan in under 60 seconds",
            col: 2,
            row: 0,
            rowSpan: 3,
            tone: "accent",
          },
        ],
        edges: [
          { from: "t", to: "s" },
          { from: "b", to: "s" },
          { from: "v", to: "s" },
          { from: "s", to: "c", tone: "accent" },
        ],
      },
      caption: "Three inputs in, a shortlist out. The negotiation step is gone.",
    },
    {
      id: "prototype",
      label: "Prototype",
      headline: "I coded the shuffle, because static frames could not show how it should feel.",
      body: [
        "Timing and randomness don't demo as flat screens, so I built the shuffle with Claude. Seeing it move changed decisions that frames never would have surfaced.",
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
      id: "discover",
      label: "Solution",
      headline: "We put the next hangout one tap away with Discover and plan.",
      body: [
        "Trending activities, low-stakes hangout sessions and events nearby, filtered by price, and an event made in a few taps.",
      ],
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
      caption: "Home, create an event, and the group chat it lands in.",
    },
    {
      id: "decision-connect",
      label: "Design decision",
      headline: "I designed connection around being in the same place, not around follow requests.",
      body: [
        "People join nearby communities and send invites without cold outreach. Every activity is a chance to meet someone, with no acquisition cost.",
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
        "During the hangout, Shufflr sends a reminder to take a photo. It goes into the group's private archive with a line about how it went.",
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
      id: "strategy",
      label: "Product strategy",
      headline: "I tested the concept against desirability, viability and feasibility.",
      body: ["A concept only survives the sprint if people want it, it can last, and it can be built."],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "Desirability",
            items: [
              "Targets the loneliness and social friction felt most by 18 to 24 year olds, who over-index on phone use and under-index on social satisfaction.",
            ],
          },
          {
            title: "Viability",
            tone: "accent",
            items: [
              "The memory archive is a retention flywheel: it means more the longer you use it, without needing new features.",
            ],
          },
          {
            title: "Feasibility",
            items: [
              "Activities come from existing maps, events and reviews services; Shufflr brings them together instead of rebuilding them.",
            ],
          },
        ],
      },
    },
    {
      id: "metrics",
      label: "Product strategy",
      headline: "I tied each feature to the one number that would prove it worked.",
      body: ["Every surface had to earn its place with a metric we could actually watch."],
      visual: {
        kind: "table",
        columns: ["What it proves", "The number"],
        rows: [
          {
            label: "The shuffle",
            cells: ["The algorithm picks well", "Shuffle-to-hangout rate"],
            ours: true,
          },
          { label: "Discover and plan", cells: ["People actually go", "Weekly active completers"] },
          { label: "Connect", cells: ["People come back", "7-day return rate"] },
          { label: "Memories", cells: ["People care", "Memory capture rate"] },
        ],
      },
    },
    {
      id: "final",
      label: "Final solution",
      headline: "We ended with a loop that takes a group from idea to hangout in under a minute.",
      body: ["Shuffle, go, keep the memory, and shuffle again."],
      visual: {
        kind: "media",
        media: [
          {
            video: "/media/shufflr/hero.mp4",
            poster: "/media/shufflr/hero.webp",
            alt: "Shufflr from shuffle to activity",
            width: 1916,
            height: 1046,
          },
        ],
      },
      caption: "Shufflr, end to end.",
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "We won 1st place and Most Practical.",
      body: ["At Western University's Product Design Sprint, hosted with Western Founders Network."],
      visual: { kind: "podium", place: 1, name: "Shufflr", extra: ["Most Practical"] },
    },
    {
      id: "hindsight",
      label: "Looking back",
      headline: "I'd design for the second hangout, because one hangout doesn't make a friend.",
      body: [
        "Hall's research puts a close friendship at more than 200 hours together. One evening out is a sliver of that. Shufflr's real job is the repeat: the same people, again.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 220,
        ticks: [0, 50, 100, 150, 200],
        unit: "hours",
        bars: [
          { label: "One evening out", sub: "for scale", value: 3, display: "3 hours", tone: "accent" },
          { label: "Casual friend", value: 50, display: "about 50 hours", tone: "soft" },
          { label: "Friend", value: 90, display: "about 90 hours", tone: "soft" },
          {
            label: "Close friend",
            source: "Jeffrey A. Hall",
            href: "https://journals.sagepub.com/doi/10.1177/0265407518761225",
            value: 200,
            display: "200+ hours",
            tone: "ink",
          },
        ],
      },
      caption:
        "What I'd change: make re-shuffling with the same group the default, and let the archive be the reason to meet again.",
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
          "Design for the repeat, not the first time. A friendship is hundreds of hours; a product that helps should count the second hangout, not the first.",
        ],
      },
    },
  ],
  next: "reboot",
  draft: ["the three synthesis themes", "the 'one evening out' scale bar (illustrative)"],
};
