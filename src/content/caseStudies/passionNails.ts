import type { Frame } from "../projects";
import bars from "./passionNails.bars.json";
import type { CaseStudy } from "./types";

/**
 * Passion Nails (my mom's salon), from the build history in VuMadeIt/nailsalon: PLAN.md, the planning
 * Q&A (59 questions before any code, 32 more while the techs tried it), the screen audit of the
 * first build, and the branches after it. Every screen is a real build on fake bookings
 * (scripts/passion-nails-shots.mjs): night = feat/08-polish, the first fix round = feat/11, now = feat/36.
 */
/** Which build a screen is from: tagged on the page, so the first version never reads as today's. */
const STAGE: Record<string, string> = { night: "First build", audit: "First fix round" };
const framed = (name: string) => {
  const b = (bars as Record<string, Frame | undefined>)[name];
  return b && { frame: b, label: STAGE[name.split("-")[0]!] };
};
const phone = (name: string, alt: string) => ({
  src: `/media/passion-nails/${name}.webp`,
  alt,
  width: 780,
  height: 1512,
  ...framed(name),
});
/** The same screen as `Media`, for media rows. */
const shot = (name: string, alt: string, label?: string) => {
  const { src, ...rest } = phone(name, alt);
  return { image: src, ...rest, ...(label && { label }) };
};
/** A film, framed like its screens. */
const film = (name: string, alt: string) => ({
  video: `/media/passion-nails/${name}.mp4`,
  poster: `/media/passion-nails/${name}.webp`,
  alt,
  width: 780,
  height: 1512,
  ...framed(name),
});

export const passionNails: CaseStudy = {
  slug: "passion-nails",
  accent: "#87133e",
  accentSoft: "#f1dbe2",
  summary:
    "Passion Nails is my mom's nail salon, a small boutique on Laird Drive in Toronto. There is no front desk, so every booking was a phone call she answered herself, often mid-manicure. As its design engineer, I designed and shipped a booking site for customers, a staff app in Vietnamese that the four techs run on their own, and the design system both are built from. It's live, and the salon runs on it every day.",
  claim:
    "I took my mom's salon off the phone with a booking site and a Vietnamese staff app the techs can run without her.",
  meta: {
    role: "Design engineer: research, product design, design system, front and back end, launch",
    team: "Me, with my mom June (the owner) and the techs Kim, Dina and Alex",
    timeline: "November 2026, live since November 9",
    scope: "Design system, booking site, Vietnamese staff app, texts, email and push, search setup",
    outcome: "Live and used daily; about 4 hours a week back for my mom",
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
      id: "brief",
      label: "The brief",
      headline: "I gave myself one brief: take the phone off my mom's hands before she leaves for Vietnam.",
      body: [
        "My mom runs Passion Nails on Laird Drive in East York. There is no receptionist, so the phone rings at her station all day, while she works on customers.",
      ],
      visual: {
        kind: "brief",
        prompt:
          "How might the salon take bookings, reminders and changes without anyone picking up the phone, in a way four techs can run on their own?",
        source: "My brief, November 2026",
        facts: [
          { label: "Salon", value: "Passion Nails, 120 Laird Drive, Toronto" },
          { label: "People", value: "4 techs, no front desk" },
          { label: "A usual day", value: "About 30 customers" },
          { label: "Deadline", value: "Running on its own by January" },
        ],
      },
    },
    {
      id: "role",
      label: "My role",
      headline: "I was the design engineer: I designed it, built it, shipped it, and I keep it running.",
      body: [
        "It's my family's business, so nothing was out of scope, and my mom and the techs tested every round:",
      ],
      visual: {
        kind: "list",
        items: [
          "Research: question after question with my mom, then watching the techs use each version in the salon.",
          "Product and UX: the booking flow, the staff app, the message rules, and the edge cases a small salon hits every day.",
          "UI and a design system: one set of tokens on Astryx's architecture, themed for the customer site and for the staff app.",
          "Engineering: SvelteKit on Cloudflare, a booking engine with real buffers, texts, email and push notifications.",
          "Launch: the domain, pricing out SMS providers, search engine setup, and a deploy order that can't break the live database.",
        ],
      },
    },
    {
      id: "phone",
      label: "The problem",
      headline: "I've watched my mom answer the phone with a customer's hand in hers.",
      body: [
        "The salon has run the same way for years: one phone, no front desk, and my mom picking up between appointments and during them, even when she is supposed to be resting.",
        "Every booking only she can make means every bit of that stress lands on her.",
      ],
      visual: {
        kind: "stats",
        stats: [
          { value: "0", text: "people at the front desk. Every call goes to my mom." },
          { value: "30", text: "customers on a usual day, each one a booking somebody has to take." },
          { value: "4", text: "techs who all need to see the same day, on their own phones." },
        ],
      },
    },
    {
      id: "deadline",
      label: "The problem",
      headline: "In January she leaves for Vietnam, and I knew the techs would have nobody to ask.",
      body: [
        "The techs are recent immigrants who read Vietnamese first. Whatever I built had to make sense to them the first time, because in January my mom won't be there to explain it.",
      ],
      visual: { kind: "statement", text: "If a screen needs explaining, it has already failed." },
    },
    {
      id: "people",
      label: "Who it's for",
      headline: "I designed for three people, and the customer was the easiest one.",
      body: [
        "The techs open the app dozens of times a day, in a second language, with a customer waiting in the chair. They set the bar for every screen.",
      ],
      visual: {
        kind: "cards",
        cards: [
          {
            title: "My mom, the owner",
            body: "Does nails all day and answers every call. She wants to know about every booking, change and cancellation, from anywhere, including Vietnam.",
          },
          {
            title: "The techs",
            body: "Read Vietnamese first, in the Hanoi way. Small fingers on small phones, and no time to learn an app between customers. Paid per service, so fairness matters.",
          },
          {
            title: "The customer",
            body: "Books at night or between errands, sometimes for a mom and a daughter at once. Wants no account, no code and no call. Walk-ins never touch the site at all.",
          },
        ],
      },
    },
    {
      id: "questions",
      label: "Research",
      headline: "I asked 59 questions before writing any code, and 32 more as the techs tried it.",
      body: [
        "Each question was a real choice with its trade-offs written out: 5 or 15 minutes between appointments, a text code or none, iMessage or SMS, a waitlist or not. The answers became the plan, and every change after went back to my mom.",
      ],
      visual: {
        kind: "quotes",
        quotes: [
          {
            text: "I don't like the text code to verify, because that's just extra inconvenience for most customers.",
            who: "On stopping fake bookings",
          },
          {
            text: "I also don't want to do limits like that, in case it's a mother and her daughter going.",
            who: "On limits per phone number",
          },
          { text: "That's fine, that's why we have the 15 min buffer.", who: "On a service running long" },
          {
            text: "It's pretty rare someone cancels and someone happens to want the same time.",
            who: "On the waitlist",
          },
          { text: "If same day, no need. If not, then send a text.", who: "On texting walk-ins" },
          {
            text: "Can we do a push notification every time someone cancels?",
            who: "On what my mom needs to know",
          },
        ],
      },
    },
    {
      id: "audit",
      label: "Research",
      headline:
        "Then I held the first build the way an older tech would, and found 13 places she'd get stuck.",
      body: [
        "I put the first build on a phone, in Vietnamese, and went screen by screen as someone who reads Vietnamese first, with small fingers on a small phone. Here are five from the first screen alone.",
      ],
      visual: {
        kind: "anatomy",
        image: phone(
          "night-day",
          "The first build's day view in Vietnamese, with English day letters and a floating plus button",
        ),
        points: [
          {
            x: 37,
            y: 10,
            title: "English inside the Vietnamese",
            text: "The days read S, M, T, W, and dates read 'Wed Nov 11'. Single letters are unclear in any language.",
          },
          {
            x: 91,
            y: 37,
            title: "A tech was cut off",
            text: "The staff filter ran off the edge with no hint, so Alex wasn't on the screen at all.",
          },
          {
            x: 16,
            y: 48,
            title: "Small grey times",
            text: "End times and services were small and mid-grey: hard to read with reading glasses.",
          },
          {
            x: 88,
            y: 80,
            title: "A plus with no word",
            text: "The add button had no label and sat on top of the last appointment.",
          },
          {
            x: 30,
            y: 96,
            title: "Five tabs, wrapping",
            text: "In Vietnamese the tab names broke onto two lines, and 'Away' used a person icon.",
          },
        ],
      },
      caption: "The first build in Vietnamese, the way a tech would first see it.",
    },
    {
      id: "insight-1",
      label: "Insight #1",
      headline: "I found that one-tap mistakes were the real danger.",
      body: [
        "Opening hours opened with 'Closed' already ticked on today's date. One tap on Save would have closed online booking for the day, and nobody would know why the phone was quiet.",
      ],
      visual: {
        kind: "media",
        media: [
          shot("night-hours", "The first build's opening hours: today's date with Closed already ticked"),
        ],
      },
      caption: "First build: 'Đóng cửa' (closed) ticked by default.",
      pair: true,
    },
    {
      id: "insight-2",
      label: "Insight #2",
      headline: "I learned that half-translated is the same as untranslated.",
      body: [
        "Buttons were in Vietnamese, but dates, days and tags stayed English. And the words were Southern, while the salon speaks the Hanoi way. Both told the techs the app wasn't made for them.",
      ],
      visual: {
        kind: "table",
        columns: ["First build (Southern)", "Now (Hanoi)"],
        rows: [
          { label: "Late", cells: ["trễ", "muộn"] },
          { label: "Move", cells: ["dời", "chuyển"] },
          { label: "Tap", cells: ["bấm", "nhấn"] },
          { label: "The salon", cells: ["tiệm", "cửa hàng"] },
          { label: "Wednesday 11", cells: ["W 11", "T4 11"], ours: true },
        ],
      },
      caption: "The words a tech says at work, in place of the ones a stranger would use.",
      pair: true,
    },
    {
      id: "opportunity",
      label: "The opportunity",
      headline: "So I set myself one question.",
      body: [],
      visual: {
        kind: "statement",
        text: "How might a staff app be so plain, and so much in their own words, that four techs can run the salon from their phones with nobody to ask?",
      },
    },
    {
      id: "language",
      label: "Design decision",
      headline: "I made Vietnamese the default, in the Hanoi register, and kept nail words in English.",
      body: [
        "At work the techs say shellac, bio gel and fill in English, so those stay. Everything else is Northern Vietnamese, down to the dates and the day strip. English is one switch away for anyone who wants it.",
      ],
      visual: {
        kind: "switch",
        label: "Language",
        options: [
          {
            label: "Tiếng Việt",
            note: "The default: 'Khách đến muộn' (customer running late), '+5 phút', and T2 to CN for the days.",
            images: [
              phone("now-day", "Today's appointments in Vietnamese"),
              phone("now-sheet", "An appointment in Vietnamese with labelled minute buttons"),
            ],
          },
          {
            label: "English",
            note: "The same screens in English. Service names never change, because that's how the techs say them.",
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
      headline: "I made the controls the techs touch all day bigger than the platform minimums.",
      body: [
        "Their fingers are small and so are their phones. The first build's day screen had 36 and 40 pixel controls. Now chips are 50, buttons 54, and every minute button says 'phút', so nobody has to guess what +5 means.",
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
      caption: "Control heights from the app's own styles, before and after.",
    },
    {
      id: "wheels",
      label: "Design decision",
      headline: "I swapped the phone's date picker for big wheels, like the iPhone alarm.",
      body: [
        "The system picker showed tiny dates in English, and rows of time chips filled the screen. Wheels say 'Hôm nay' and 'Ngày mai' in words, and a line underneath says who is free before anyone taps Save.",
      ],
      visual: {
        kind: "media",
        media: [
          shot(
            "now-add-wheels",
            "Add booking: date, hour and minute wheels, and a green line saying Dina is free",
          ),
          shot("now-hours", "Opening hours with nothing ticked until a tech picks a date and a choice"),
        ],
      },
      caption: "Add booking and opening hours: words first, and nothing pre-ticked.",
    },
    {
      id: "nav",
      label: "Design decision",
      headline: "I cut the bottom bar from five tabs to three, so there is nothing to get lost in.",
      body: [
        "The waitlist went, opening hours and days off moved into Settings, and Add booking moved from a button floating over appointments into the bottom bar. What's left: Lịch hẹn, Thêm lịch hẹn, Cài đặt.",
      ],
      visual: {
        kind: "media",
        media: [
          shot("night-day", "The first build's day, with five tabs"),
          shot("audit-day", "The first fix round's day, with four tabs"),
          shot("now-day", "Today's day, with three tabs", "Now"),
        ],
      },
      caption: "The first build, the first fix round, and today: five tabs, four, then three.",
    },
    {
      id: "safety",
      label: "Design decision",
      headline: "I made risky actions look risky, and made the app ask first.",
      body: [
        "Cancel is red and full width. No-show, Block number and Log out ask 'are you sure?'. A walk-in that clashes can still be saved, because the tech knows the room, but a pop-up names the clash first.",
      ],
      visual: {
        kind: "switch",
        label: "Version",
        options: [
          {
            label: "First build",
            note: "June was already picked at login, so Kim's phone could become June's. On an appointment, two rows of bare numbers looked alike and Block sat next to No-show.",
            images: [
              phone("night-login", "The first login screen with June already selected"),
              phone("night-sheet", "The first appointment sheet with bare +5 numbers"),
            ],
          },
          {
            label: "Now",
            note: "Minutes say 'phút', a late customer gets its own amber box, and a clash asks 'Chắc chắn chưa?' (are you sure?) before saving.",
            images: [
              phone("now-sheet", "The appointment sheet now, with a red cancel button"),
              phone("now-sure", "Are you sure? A pop-up naming the clash before saving"),
            ],
          },
        ],
      },
    },
    {
      id: "anyone",
      label: "Design decision",
      headline: "I gave 'Any staff' bookings to whoever has the least chair time, so the work stays fair.",
      body: [
        "The techs are paid per service, and June and Kim are the ones customers ask for by name. So 'Any' goes to the tech with the fewest booked minutes that day, and the customer is promised the finish time of the slowest tech who could do it, so a later swap never makes them late.",
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
      caption: "Customers who don't mind get a fair slot, and the ones who ask for June still find her free.",
    },
    {
      id: "buffer",
      label: "Design decision",
      headline: "I let the gap after an appointment depend on how it was booked.",
      body: [
        "Online customers book blind, so 15 minutes of cleanup follow them. A same-day walk-in is already in the chair and the tech can see when she'll finish, so 5 minutes is enough. Phone bookings for another day keep 15.",
      ],
      visual: {
        kind: "bars",
        scale: "linear",
        min: 0,
        max: 60,
        ticks: [0, 15, 30, 45, 60],
        unit: "min",
        bars: [
          { label: "Online booking", value: 45, display: "1:45", tone: "soft" },
          { label: "Phone booking, another day", value: 45, display: "1:45", tone: "soft" },
          { label: "Same-day walk-in", value: 35, display: "1:35" },
        ],
      },
      caption: "A 30-minute service at 1:00: minutes until the chair can take the next customer.",
    },
    {
      id: "texts",
      label: "Design decision",
      headline: "I made every text fit in one SMS, and skipped the ones people don't need.",
      body: [
        "Canadian carriers add their own fee to every text, on every provider, so I priced the options all-in and picked Telnyx. Every message stays under 160 plain characters (one emoji or curly quote can double or triple the cost), and the 9:30 reminder is skipped for anyone who just booked or tapped Add to calendar.",
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
      caption:
        "My estimate of the all-in cost per text in Canadian cents, carrier fees included: about C$20 to C$31 a month for the salon.",
    },
    {
      id: "push",
      label: "Design decision",
      headline: "I made every change buzz my mom's phone, and never the phone that made it.",
      body: [
        "My mom wants to know everything. Every booking, cancellation and no-show sends a push to her and to the tech it involves. The phone that made the change stays quiet, so nobody is told about what they just did.",
      ],
      visual: {
        kind: "diagram",
        cols: 3,
        minWidth: 760,
        widths: "minmax(0,0.9fr) minmax(0,0.7fr) minmax(0,1fr)",
        nodes: [
          { id: "kim", text: "Kim adds a walk-in for Dina", col: 0, row: 0, rowSpan: 3, tone: "white" },
          { id: "app", text: "Passion Nails", col: 1, row: 0, rowSpan: 3, tone: "ink" },
          { id: "june", text: "My mom's phone buzzes", col: 2, row: 0, tone: "accent" },
          {
            id: "dina",
            text: "Dina's phone buzzes",
            sub: "it's her customer",
            col: 2,
            row: 1,
            tone: "white",
          },
          {
            id: "self",
            text: "Kim's phone stays quiet",
            sub: "she just did it",
            col: 2,
            row: 2,
            tone: "ghost",
          },
        ],
        edges: [
          { from: "kim", to: "app" },
          { from: "app", to: "june", tone: "accent" },
          { from: "app", to: "dina" },
          { from: "app", to: "self", tone: "muted", dashed: true },
        ],
      },
    },
    {
      id: "booking",
      label: "Design decision",
      headline: "I kept booking to four steps, with no account and no code, and the site remembers you.",
      body: [
        "Hands, feet and combos are grouped, one of each, because nobody gets two manicures. A returning customer's name and number stay on their own phone, with a 'Not you?' link. A text code only shows up for unusual volume, like a fourth upcoming booking on one number, so a mom and daughter never see one.",
      ],
      visual: {
        kind: "switch",
        label: "Booking step",
        options: [
          {
            label: "1 Services",
            note: "Hands, Feet, Hands + feet: pick one of each. Waxing and add-ons stack on top.",
            images: [phone("book-services", "Step 1: services grouped into hands, feet and combos")],
          },
          {
            label: "2 Technician",
            note: "Any staff is the default, and each tech shows how long she takes.",
            images: [phone("book-staff", "Step 2: Any staff, or a tech with her own time for the service")],
          },
          {
            label: "3 Time",
            note: "Today is always first, in Toronto time, and only real openings show.",
            images: [phone("book-time", "Step 3: a day strip and the open times")],
          },
          {
            label: "4 Details",
            note: "A returning customer is already filled in. No account, no code.",
            images: [phone("book-details", "Step 4: a returning customer's details already filled in")],
          },
          {
            label: "Booked",
            note: "Tapping Add to calendar skips the 9:30 reminder text, and the button says so.",
            images: [phone("book-done", "Booked, with Add to calendar buttons")],
          },
        ],
      },
    },
    {
      id: "system",
      label: "Design system",
      headline: "I built a design system, so the site and the staff app share one language.",
      body: [
        "It follows the architecture of Astryx, Meta's open-source design system: colour roles, four corner sizes, three shadows, a spacing scale and two motion speeds. The values are the salon's own, from its cream and burgundy, and every screen reads only tokens, so a change lands everywhere at once.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/passion-nails/design-tokens.webp",
            alt: "The design system's tokens: twelve colour roles, five corner radii and three shadows",
            width: 2368,
            height: 978,
          },
        ],
      },
      caption: "The tokens, from the specimen page in the salon's codebase.",
    },
    {
      id: "themes",
      label: "Design system",
      headline: "I gave customers and techs their own theme, built from the same tokens.",
      body: [
        "Customers get the salon's editorial look: pills and wide display type. Techs get Astryx's calmer, denser one: system type at 17 px, white cards on a low shadow, and controls raised to the salon's 48 px floor. One rule holds in both: pills are for tapping, and square badges only label. I measured the first staff theme and its chips and tabs were 1.5:1 against the page, under the 3:1 that WCAG asks of controls, so it moved to white cards, near-black text and borders that pass.",
      ],
      visual: {
        kind: "media",
        media: [
          {
            image: "/media/passion-nails/design-themes.webp",
            alt: "The same components in two themes: buttons, a segmented control, time chips, a service card, a field, badges, notices and a card",
            width: 2240,
            height: 1690,
          },
        ],
      },
      caption: "Same components, same tokens: the site on the left, the staff app on the right.",
    },
    {
      id: "spam",
      label: "Explorations",
      headline:
        "I turned down a text code on every booking, because it taxes every customer to stop a rare few.",
      body: ["Fake bookings could fill a day, so I put three ways to stop them side by side."],
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
      id: "removed",
      label: "Explorations",
      headline: "I also took out things I had already built, once they stopped earning their place.",
      body: ["Every one of these worked. They just cost the techs more attention than they gave back."],
      visual: {
        kind: "compare",
        columns: [
          {
            title: "The waitlist",
            items: [
              "Built in the first version: a full day let customers join a list, and a cancellation texted them all.",
              "Removed: a cancellation matching someone else's wanted time is rare, and the tab was one more thing to learn. An empty day now offers the next open day.",
            ],
          },
          {
            title: "iMessage",
            items: [
              "Asked for at the start.",
              "Dropped: a website can't send iMessage without a Mac running all day or about US$100 a month. A text lands in the same Messages app.",
            ],
          },
          {
            title: "The floating + button",
            tone: "accent",
            items: [
              "Built in the first version, then labelled '+ Thêm' in the first fix round.",
              "Replaced: it still covered appointments, so Add booking became a tab in the bottom bar.",
            ],
          },
        ],
      },
    },
    {
      id: "final",
      label: "Final solution",
      headline: "I ended with a customer booking in a minute, and a tech adding a walk-in in Vietnamese.",
      body: [
        "Both sides share one schedule, so a booking made at midnight is on every tech's phone by morning, and the 9:30 reminder goes out on its own.",
      ],
      visual: {
        kind: "media",
        media: [
          film("customer", "A returning customer books a pedicure online, in under a minute"),
          film("staff", "A tech adds a walk-in for a free technician, in Vietnamese"),
        ],
      },
      caption: "Left, a returning customer books. Right, a tech adds a walk-in in Vietnamese.",
    },
    {
      id: "outcome",
      label: "Outcome",
      headline:
        "I shipped it live: the salon uses it every day, and it gives my mom back about four hours a week.",
      body: [
        "That's her estimate of the time that used to go to answering calls, texting back and forth, copying each booking into her appointment book and passing it on to the techs. On a usual day of about 30 customers, every one of them can book, move or cancel without a call, and she sees every change on her phone, wherever she is.",
      ],
      visual: {
        kind: "stats",
        stats: [
          {
            value: "4 hrs",
            text: "a week back for my mom, by her estimate: calls, texts, the appointment book.",
          },
          { value: "108", text: "automated tests, from double bookings to every text fitting in one SMS." },
          { value: "3", text: "tabs in the staff app, down from five." },
        ],
      },
    },
    {
      id: "hindsight",
      label: "Looking back",
      headline: "I'd put the phone in a tech's hands on day one, not after the first build.",
      body: [
        "The first build passed every test and still had 13 places a tech would get stuck. None of them showed up in the code. All of them showed up in five minutes on a phone, in Vietnamese.",
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
              "Bare +5 numbers and Southern words",
              "A tech cut off the edge of the screen",
            ],
          },
        ],
      },
      caption: "What I'd change: a tech holds the phone in the first hour, and every round after.",
    },
    {
      id: "next",
      label: "Looking back",
      headline: "I know what's left is the part I can't do from a laptop.",
      body: [
        "The real test is January, when my mom is in Vietnam. Before then I want a tech to read every Vietnamese phrase aloud, a run on the oldest phone in the salon, and a month of calls per day, so I can show how many the site took away.",
      ],
    },
    {
      id: "learnings",
      label: "Key learnings",
      headline: "I learned that the hardest user decides the design, and that defaults are decisions.",
      body: [],
      visual: {
        kind: "list",
        items: [
          "Design for the hardest user. The customer flow was easy; techs in a second language, with a customer in the chair, set the bar for every screen.",
          "Translate into the register people speak. Southern words in a Hanoi salon felt as foreign as English dates.",
          "Defaults are decisions. A pre-ticked box and a pre-selected name were the two most dangerous things in the first build.",
          "Design and build in the same hands. A border that fails contrast or a tap target under 48 px is a fix I can ship the same afternoon, in the salon.",
          "Count what things really cost. Carrier fees put my first texting estimate at about half the real price, and one emoji would have doubled every message.",
        ],
      },
    },
  ],
  next: "shufflr",
  draft: [
    "'even when she is supposed to be resting' (from your answer about vacations)",
    "how the techs were involved: watching them use each version in the salon",
    "the techs' persona (recent immigrants, Hanoi Vietnamese, paid per service)",
    "about 30 customers a day",
    "the quote labels: each quote is from our planning answers",
  ],
};
