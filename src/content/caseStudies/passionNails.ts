import type { Frame } from "../projects";
import { PN_MEDIA } from "./mediaRev";
import bars from "./passionNails.bars.json";
import type { CaseStudy } from "./types";

/**
 * Passion Nails (my mom's salon), from the build history in VuMadeIt/nailsalon: PLAN.md, the planning
 * Q&A (59 questions before any code, 32 more while the techs tried it), the screen audit of the
 * first build, and the branches after it. Every screen is a real build on fake bookings
 * (scripts/passion-nails-shots.mjs): night = feat/08-polish, the first fix round = feat/11, now =
 * feat/38-one-look. Vietnamese words are marked [[Vietnamese|English]] and show their English on hover.
 */
/** Which build a screen is from: titled on the page, so the first version never reads as today's. */
const STAGE: Record<string, string> = { night: "First build", audit: "First fix round" };
const framed = (name: string) => {
  const b = (bars as Record<string, Frame | undefined>)[name];
  return b && { frame: b, label: STAGE[name.split("-")[0]!] };
};
/** Today's screens are full iPhone height (393 x 852 at 2x); the first builds' are 390 x 756. */
const size = (name: string) =>
  (bars as Record<string, Frame | undefined>)[name]?.full
    ? { width: 786, height: 1704 }
    : { width: 780, height: 1512 };
const phone = (name: string, alt: string) => ({
  src: `/media/passion-nails/${name}.webp${PN_MEDIA}`,
  alt,
  ...size(name),
  ...framed(name),
});
/** Its English twin, when the shoot made one ("<name>-en"). */
const english = <T>(name: string, make: (n: string) => T) =>
  `${name}-en` in bars ? { en: make(`${name}-en`) } : {};
/** The same screen as `Media`, for media rows, with its English twin. */
const shot = (name: string, alt: string, label?: string) => {
  const one = (n: string) => {
    const { src, ...rest } = phone(n, n === name ? alt : `${alt}, in English`);
    return { image: src, ...rest, ...(label && { label }) };
  };
  return { ...one(name), ...english(name, one) };
};
/** A screen film with its controls, framed like its screens; `sideways` for the landscape one. */
const film = (name: string, alt: string, sideways = false) => {
  const one = (n: string) => ({
    video: `/media/passion-nails/${n}.mp4${PN_MEDIA}`,
    poster: `/media/passion-nails/${n}.webp${PN_MEDIA}`,
    alt: n === name ? alt : `${alt}, in English`,
    ...(sideways ? { width: 1704, height: 786 } : { width: 786, height: 1704 }),
    ...framed(n),
  });
  return { ...one(name), ...english(name, one) };
};

export const passionNails: CaseStudy = {
  slug: "passion-nails",
  accent: "#87133e",
  accentSoft: "#f1dbe2",
  summary:
    "Passion Nails is my mom's nail salon in East York, Toronto. I designed and built its booking site and a staff app in Vietnamese, and the salon has run on them every day since November 9.",
  claim:
    "I took my mom's salon off the phone with a booking site and a Vietnamese staff app the techs can run without her.",
  meta: {
    role: "Design engineer: research, design, design system, build, launch",
    team: "Me, with my mom June (the owner) and the techs Kim, Dina and Alex",
    timeline: "November 2026, live since November 9",
    scope: "Booking site, Vietnamese staff app, design system, texts and push",
    outcome: "Used daily; about 4 hours a week back for my mom",
  },
  link: { label: "Live site", href: "https://passionnailstoronto.ca" },
  hero: {
    video: "/media/work/passion-nails.mp4",
    poster: "/media/work/passion-nails.webp",
    alt: "The live Passion Nails site: the home page, services and reviews, then a booking from services to 'You're booked'",
    width: 1630,
    height: 912,
  },
  blocks: [
    {
      id: "phone",
      label: "The problem",
      headline: "Every booking was a phone call my mom took mid-manicure.",
      body: [
        "One phone, no front desk, and she picks up between customers and during them. In January she leaves for Vietnam, and the techs will have nobody to ask.",
      ],
      visual: {
        kind: "stats",
        stats: [
          { value: "0", text: "people at the front desk." },
          { value: "30", text: "customers on a usual day, each one a call." },
          { value: "4", text: "techs, most over 40, who read Vietnamese first." },
        ],
      },
    },
    {
      id: "questions",
      label: "Research",
      headline: "I asked 59 questions before writing any code.",
      body: [
        "Each one a real choice with its trade-offs written out, for my mom to pick. 32 more came once the techs had it in their hands. Three answers that shaped everything:",
      ],
      visual: {
        kind: "quotes",
        quotes: [
          {
            text: "I don't like the text code to verify, because that's just extra inconvenience for most customers.",
            who: "On fake bookings",
          },
          {
            text: "I also don't want to do limits like that, in case it's a mother and her daughter going.",
            who: "On limits per phone number",
          },
          {
            text: "Can we do a push notification every time someone cancels?",
            who: "On what she needs to know",
          },
        ],
      },
      caption: "My mom, in our planning answers.",
    },
    {
      id: "audit",
      label: "Research",
      headline: "Then I held the first build the way an older tech would.",
      body: [
        "Vietnamese on, a small phone, reading glasses in mind. I found 13 places she'd get stuck, three of them on the first screen.",
      ],
      visual: {
        kind: "anatomy",
        image: phone(
          "night-day",
          "The first build's day view in Vietnamese, with English day letters and a floating plus button",
        ),
        points: [
          {
            x: 13,
            y: 10,
            title: "English inside the Vietnamese",
            text: "Days read S, M, T, W. Dates read 'Wed Nov 11'.",
          },
          {
            x: 97,
            y: 29,
            title: "A tech cut off",
            text: "The filter ran off the edge, so Alex wasn't on screen at all.",
          },
          {
            x: 95,
            y: 85,
            title: "A plus with no word",
            text: "No label, and it sat on top of the last appointment.",
          },
        ],
      },
      caption: "The first build, the way a tech first saw it.",
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "One wrong tap could close the salon.",
      body: [
        "Opening hours opened with 'Closed' already ticked for today. One tap on Save, and online booking stops with nobody knowing why.",
      ],
      visual: {
        kind: "media",
        media: [
          shot("night-hours", "The first build's opening hours: today's date with Closed already ticked"),
        ],
      },
      caption: "[[Đóng cửa|Closed]], ticked by default.",
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "Half-translated reads as untranslated.",
      body: [
        "Buttons were Vietnamese, but days and dates stayed English. And the words were Southern, in a salon that talks the Hanoi way.",
      ],
      visual: {
        kind: "table",
        columns: ["First build (Southern)", "Now (Hanoi)"],
        rows: [
          { label: "Late", cells: ["[[trễ|late]]", "[[muộn|late]]"] },
          { label: "Move", cells: ["[[dời|move]]", "[[chuyển|move]]"] },
          { label: "Wednesday 11", cells: ["W 11", "[[T4 11|Wednesday 11]]"], ours: true },
        ],
      },
      caption: "What a stranger would write, and what the techs say.",
      pair: true,
    },
    {
      id: "opportunity",
      label: "The opportunity",
      headline: "So I set myself one question.",
      body: [],
      visual: {
        kind: "statement",
        text: "How might four techs run the salon from their phones, in their own words, with nobody to ask?",
      },
    },
    {
      id: "language",
      label: "Design decision",
      headline: "Vietnamese by default, the way the techs actually talk.",
      body: [
        "The first build was machine-translated, so it came out Southern. Walking the techs through the real app, again and again, gave me their words: [[muộn|late]], not [[trễ|late]]. Nail words like manicure, shellac and fill stay English in both languages, because that's what everyone says at work.",
      ],
      visual: {
        kind: "switch",
        label: "Language",
        options: [
          {
            label: "Tiếng Việt",
            note: "[[Khách đến muộn|Customer running late]], +5 [[phút|minutes]], and [[T2|Monday]] to [[CN|Sunday]] for the days.",
            images: [
              phone("now-day", "Today's appointments in Vietnamese"),
              phone("now-sheet", "An appointment in Vietnamese with labelled minute buttons"),
            ],
          },
          {
            label: "English",
            note: "The same screens in English. Service names never change.",
            images: [
              phone("now-day-en", "Today's appointments in English"),
              phone("now-sheet-en", "An appointment in English with labelled minute buttons"),
            ],
          },
        ],
      },
    },
    {
      id: "taps",
      label: "Design decision",
      headline: "What the techs tap all day beats Apple's and Google's minimums.",
      body: [
        "Most of the techs are over 40 and immigrants, and still fairly new to smartphones. So their app gets bigger controls than the customer site: chips went from 40 to 50 px, buttons to 54, and every minute button says [[phút|minutes]], so +5 is never a guess.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 60,
        ticks: [0, 20, 40, 60],
        unit: "px",
        bars: [
          { label: "Today button", sub: "first build", value: 36, display: "36", tone: "soft" },
          { label: "Staff filter chips", sub: "first build", value: 40, display: "40", tone: "soft" },
          {
            label: "Apple's minimum",
            sub: "44 by 44 pt",
            source: "Apple HIG",
            href: "https://developer.apple.com/design/human-interface-guidelines/accessibility",
            value: 44,
            display: "44",
            tone: "ink",
          },
          {
            label: "Android's minimum",
            sub: "48 by 48 dp",
            source: "Android Accessibility Help",
            href: "https://support.google.com/accessibility/android/answer/7101858",
            value: 48,
            display: "48",
            tone: "ink",
          },
          { label: "Staff filter chips", sub: "now", value: 50, display: "50" },
          { label: "Buttons", sub: "now", value: 54, display: "54" },
        ],
      },
      caption: "Control heights, from the app's own styles.",
    },
    {
      id: "walk-in",
      label: "Design decision",
      headline: "A walk-in tells you who's free before you save.",
      body: [
        "Add sits in the bottom bar, where it can't cover an appointment. Big wheels replaced the phone's tiny English date picker, and a green line says who's free before anyone taps [[Lưu|Save]].",
      ],
      visual: {
        kind: "media",
        media: [film("staff", "A tech adds a walk-in pedicure for a free technician, in Vietnamese")],
      },
      caption: "Adding a walk-in, in Vietnamese.",
    },
    {
      id: "nav",
      label: "Design decision",
      headline: "Five tabs, then four, then three.",
      body: [
        "The waitlist went, hours and days off moved into Settings, and Add became a tab. Less to learn, nothing to get lost in.",
      ],
      visual: {
        kind: "media",
        media: [
          shot("night-day", "The first build's day, with five tabs"),
          shot("audit-day", "The first fix round's day, with four tabs"),
          shot("now-day", "Today's day, with three tabs", "Now"),
        ],
      },
    },
    {
      id: "anyone",
      label: "Design decision",
      headline: "'Any staff' goes to whoever has the least chair time.",
      body: [
        "The techs are paid per service, and customers ask for June and Kim by name. So 'Any' goes to the tech with the fewest booked minutes, and the customer is promised the slowest tech's finish time, so a swap never makes them late.",
      ],
      visual: {
        kind: "diagram",
        cols: 4,
        minWidth: 960,
        widths: "minmax(0,0.8fr) minmax(0,0.9fr) minmax(0,1fr) minmax(0,1.1fr)",
        nodes: [
          { id: "any", text: "A customer picks Any staff", col: 0, row: 0, rowSpan: 2, tone: "white" },
          {
            id: "free",
            text: "Techs who are free then",
            sub: "and who do that service",
            col: 1,
            row: 0,
            rowSpan: 2,
            tone: "white",
          },
          {
            id: "least",
            text: "Fewest booked minutes today",
            sub: "ties go Dina, Alex, Kim, June",
            col: 2,
            row: 0,
            rowSpan: 2,
            tone: "ink",
          },
          {
            id: "promise",
            text: "The customer sees a 'done by' time",
            sub: "from the slowest tech who could do it",
            col: 3,
            row: 0,
            tone: "accent",
          },
          {
            id: "real",
            text: "The day uses the real tech's time",
            sub: "plus the gap, so no minutes go to waste",
            col: 3,
            row: 1,
            tone: "white",
          },
        ],
        edges: [
          { from: "any", to: "free" },
          { from: "free", to: "least" },
          { from: "least", to: "promise", tone: "accent" },
          { from: "least", to: "real" },
        ],
      },
      caption: "Fair for the techs, and June is still free for the people who ask for her.",
    },
    {
      id: "booking",
      label: "Design decision",
      headline: "Booking is four steps, with no account and no code.",
      body: [
        "Hands, feet and combos, one of each. The site remembers you on your own phone. A text code only shows up for something odd, like a fourth booking on one number, so a mom and daughter never see one.",
      ],
      visual: {
        kind: "media",
        media: [
          film(
            "customer",
            "A returning customer books a pedicure online: services, technician, time, confirm",
          ),
        ],
      },
      caption: "A returning customer books a pedicure.",
    },
    {
      id: "texts",
      label: "Design decision",
      headline: "Every text fits in one SMS.",
      body: [
        "Carriers charge for every text, so I priced the providers all-in and picked Telnyx. Messages stay under 160 plain characters (one emoji can triple the cost), and the 9:30 reminder skips anyone who just booked or added it to their calendar.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 3,
        ticks: [0, 1, 2, 3],
        unit: "¢",
        bars: [
          { label: "Twilio", value: 2.31, display: "2.3¢", tone: "soft" },
          { label: "Plivo", value: 2.41, display: "2.4¢", tone: "soft" },
          { label: "Telnyx", sub: "the one I picked", value: 1.69, display: "1.7¢" },
        ],
      },
      caption: "My all-in estimate per text, carrier fees included: about C$20 to C$31 a month.",
    },
    {
      id: "spam",
      label: "Explorations",
      headline: "I said no to a text code on every booking.",
      body: ["It taxes every customer to stop a rare few. Three ways to stop fake bookings, side by side:"],
      visual: {
        kind: "options",
        options: [
          {
            title: "A code on every booking",
            pros: ["Proves the number is real"],
            cons: ["An extra step for every customer", "One more paid text per booking"],
          },
          {
            title: "A limit per phone number",
            pros: ["No extra step"],
            cons: ["Blocks a mom and daughter booking together"],
          },
          {
            title: "Invisible layers first",
            pros: [
              "A bot check, a hidden field and rate limits nobody sees",
              "Staff can block a number",
              "A code only at a fourth upcoming booking",
            ],
            cons: ["More to build"],
            chosen: true,
          },
        ],
      },
    },
    {
      id: "system",
      label: "Design system",
      headline: "One design system, and both apps use all of it.",
      body: [
        "The staff app used to look different, and when I checked why, there was no good reason. I'd cut the site's fonts to English letters to load fast, then given the staff app the phone's font instead. Now both apps share every colour, font and shape, and Vietnamese letters load only where they're needed.",
      ],
      visual: {
        kind: "system",
        rules: {
          colour: "Five roles. Burgundy only marks what's chosen or new.",
          type: "Two faces in both apps. Vietnamese letters come in a 9 KB cut, loaded only where they're needed.",
          shape: "What you read is square. What you tap is round.",
          components: "Every size is a token. In the staff app, nothing you tap is under 48 px.",
          spacing: "A 4 px grid from 4 to 32. Inside a card, 12; between the fields of a form, 16.",
        },
        colours: [
          { name: "Cream", hex: "#f4ebdf", role: "the page" },
          { name: "Card", hex: "#fbf7f1", role: "cards and sheets" },
          { name: "Ink", hex: "#0e0e0e", role: "text and hairlines" },
          { name: "Burgundy", hex: "#87133e", role: "chosen, new, Add" },
          { name: "Line", hex: "#8c7b68", role: "control edges, 3.4:1" },
        ],
        faces: [
          { name: "Zalando Sans Expanded", use: "display", family: "display", sample: "Passion Nails" },
          { name: "Hanken Grotesk", use: "text, 17 px for staff", family: "text", sample: "Khách đến muộn" },
        ],
        proof: {
          text: "Thêm lịch hẹn",
          before: "The site's Latin cut: the burgundy letters aren't in it.",
          after: "With the Vietnamese cut, in both apps.",
        },
        shapes: [
          {
            shape: "square",
            label: "Cards, sheets, notices",
            note: "0 px and an ink hairline, like the site's reviews.",
          },
          { shape: "pill", label: "Buttons and chips", note: "Fully round. 54 px tall in the staff app." },
          { shape: "field", label: "Fields and tiles", note: "12 px, for controls too tall to be pills." },
        ],
      },
    },
    {
      id: "themes",
      label: "Design system",
      headline: "Side by side, the staff app is just bigger.",
      body: [
        "The staff theme sets three things: 17 px text, 48 px+ targets, and buttons in sentence case, because capitals crowd Vietnamese tone marks. Everything else comes from the site, down to the reviews' square cards.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: `/media/passion-nails/design-themes.webp${PN_MEDIA}`,
            alt: "The same components in both themes: buttons, a segmented control, time chips, a service card, a field, badges, notices and a card",
            width: 2240,
            height: 1690,
          },
        ],
      },
      caption: "Same components, same tokens: the site on the left, the staff app on the right.",
    },
    {
      id: "final",
      label: "Final solution",
      headline: "Turn the phone sideways, and the whole salon's day fits.",
      body: [
        "Both apps share one schedule, so a booking made at midnight is on every tech's phone by morning, and the 9:30 reminder goes out on its own.",
      ],
      visual: {
        kind: "media",
        media: [
          film(
            "day",
            "A full day by tech on a phone turned sideways: four columns of appointments, then one opened",
            true,
          ),
        ],
      },
      caption: "A usual day, by tech: about 30 customers.",
    },
    {
      id: "outcome",
      label: "Outcome",
      headline: "It's live, and my mom gets about four hours a week back.",
      body: [
        "That's her estimate of the calls, the texting back and forth, and copying each booking into her book for the techs. Over five years, it adds up:",
      ],
      visual: {
        kind: "stats",
        stats: [
          { value: "1,040", text: "hours back, at four a week." },
          { value: "130", text: "eight-hour days off the phone." },
          {
            value: "$18.7k",
            text: "to pay someone for those hours at Ontario's minimum wage of $17.95, before payroll costs.",
            source: "Ontario",
            href: "https://www.ontario.ca/document/your-guide-employment-standards-act-0/minimum-wage",
          },
        ],
      },
    },
    {
      id: "hindsight",
      label: "Looking back",
      headline: "I'd put a phone in a tech's hands on day one.",
      body: [
        "The first build passed every test and still had 13 places a tech would get stuck. Five minutes on a phone, in Vietnamese, found them.",
      ],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "What the tests caught",
            items: [
              "Two people booking the same slot at once",
              "A text running past 160 characters",
              "A reminder sent twice",
            ],
          },
          {
            title: "What only a phone in Vietnamese caught",
            tone: "accent",
            items: [
              "'Closed' ticked by default",
              "June picked for every phone at login",
              "A tech cut off the screen",
            ],
          },
        ],
      },
    },
    {
      id: "learnings",
      label: "Key learnings",
      headline: "I learned that the hardest user decides the design.",
      body: [],
      visual: {
        kind: "list",
        items: [
          "Design for the hardest user. Booking was easy; a tech in her second language, with a customer in the chair, set the bar.",
          "Defaults are decisions. A pre-ticked box and a pre-picked name were the two most dangerous things in the first build.",
          "Ask why twice. The staff app's second look came from a shortcut I'd forgotten, not a reason.",
        ],
      },
    },
  ],
  next: "shufflr",
  draft: [
    "the language story: machine-translated first, Southern; walking the techs through the app gave the Hanoi words",
    "nail words kept in English: manicure, shellac, fill",
    "'about 30 customers' in the By-tech film's caption (the film shows a seeded day of 28)",
  ],
};
