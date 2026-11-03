# Report

Overnight build of Lucas Vu's portfolio, following PLAN.md. This file is updated at the end of
every phase; the final section is written last.

## Phases

### Phase 00: foundation (`v0.0.0-foundation`)
Next.js 16.4.3 App Router, TypeScript strict, Tailwind v4, ESLint, Prettier, Vitest, Playwright on
Edge. Tokens, Fraunces, the static hero (corner lines, edge-to-edge giant name). References moved
to `reference/`. Screens: `.artifacts/screens/v0.0.0/`.

### Phase 01: physics (`v0.1.0-physics`)
Custom XPBD Newton's cradle in SI units: bifilar unilateral strings, impulse contacts with
restitution, damped XPBD hand, kinematic anchors, sleep, collision events, a visual rope sim.
All ten acceptance tests pass (`npm run test`, 18 tests). Restitution 0.975 and hysteresis 0.03/s
calibrated against a real recording (`docs/physics/calibration.svg`). `/lab/physics` debugger
(dev only, or `LAB=1`).

### Phase 02: the real object (`v0.2.0-object`)
R3F stage with a transparent canvas over the page wall, long-lens shift camera, gallery HDRI
(white-balanced), chrome with fingerprints and per-ball cube reflections, screw eyes, clear nylon
strings with a 1 px minimum, VSM wall shadows sized to a 5 cm museum spot, analytic string
shadows, porcelain and dark metal for comparison, `/lab` with every switch. Pre-rendered still as
LCP and no-WebGL fallback, aligned to the live canvas. Four realism rounds in DECISIONS.md.
Screens: `.artifacts/screens/v0.2.0/`, lab sheets in `.artifacts/lab/`.

### Phase 03: interaction and sound (`v0.3.0-interaction`)
Drag and flick with the soft hand constraint (touch only captured on a ball), hover captions,
real buttons projected over each ball (Tab order, focus ring, arrow-key push, names "People:
where every problem starts. Open story."), on-demand rendering with sleep and off-screen pause,
WebAudio clacks from a CC0 recording grouped per chain and scaled by impact speed, `[sound on]`
toggle. 60 fps at 1440x900 DPR 2 on an integrated GPU after a shadow-map fix. E2E: keyboard flow,
push, reduced motion, sound toggle.

### Phase 04: identities (`v0.4.0-identities`)
People (iris with blinks, breathing pupil, gaze), Ideas (flowing AI-orb filaments), Experiments
(comet electrons weaving a lattice, nucleus flare), Products (gladiolus in a thin-film bubble
with drifting clouds), all rendered inside the ball in object space. Three reveal variants (A
surface, B glass, C ripple; B default). Four compare rounds against the source images in
`.artifacts/identity/`. 60 fps in every hover state.

### Phase 05: story state (`v0.5.0-story`)
Click (or Enter, or two taps on touch) opens `/people` etc.: strings dip, the others rise out of
frame like a curtain, the chosen ball glides to the left third with a physical lag and arrives
still (input-shaped anchor motion), the name slides away, the wall text rises in. Back arrow,
Escape, empty wall and browser back reverse it; interrupting is safe; deep links and reduced
motion enter the state directly. Filmed sheets: `.artifacts/story/1440/sheet.png`,
`.artifacts/story/390/sheet.png`.

### Phase 06: site shell and home (`v0.6.0-home`)
`[more]` dialog, four full-screen sticky exhibits with real (re-encoded) media and wall labels,
"View all work", the close with contact links and the returning name, inner-page slim nav, 404,
favicon from the real render, sitemap, robots. Taste inspector: 0 FAIL with the PLAN allow-list.

### Phase 07: case studies (`v0.7.0-case-studies`)
Shufflr, Ripple, Maple Leaf Foods and Warframe (under wraps) on one template: Sam's layout,
Caleb's rhythm, Rachel Chen's claim headlines, square progress bar, Next exhibit card. Copy and
media ported from the old repo; a test enforces the headline skim rule.

### Phase 08: About and All work (`v0.8.0-about`)
About as a museum room (statement and portrait, chronology, six labelled objects, the essay in a
reading room) and the `/work` catalogue (11 projects, hover previews). Fixed an invalid scroll
animation range that left text half-transparent.

### Release candidate (`v1.0.0-rc.1`)
All phases merged into `main` with `--no-ff`, one annotated tag each. Gates on the final build:
typecheck clean, ESLint and Prettier clean, Vitest 28 tests (all ten physics acceptance tests plus
rope, choreography, audio grouping and copy rules), Playwright 27 tests on Edge with the real GPU,
Taste inspector 0 FAIL on the home page with the PLAN allow-list. Screens:
`.artifacts/screens/v0.9.0/` (home, people, work, about, work/shufflr at 1440, 768, 390).

### Phase 10: slow motion lab (`v1.1.0-slowmo`)
Hovering a ball while the cradle swings eases the whole world to 0.1x (300 ms in, 400 ms out) so
it can be clicked; leaving eases back. The time scale multiplies the real frame time fed to the
physics accumulator, the rope sim, the identity clocks and the clack pitch (floored at 0.45x), so
trajectories in simulation time are bit-identical (Vitest). Whoosh down/up from a CC0 Freesound
recording through a tape-stop (`scripts/audio/whoosh.py`). Behind a flag: on in `/lab` and with
`?slowmo=1`, off in production. `scripts/slowmo.mjs` measures the speed ratio in a real browser.

### Phase 11: type, nav and motion (`v1.2.0-type-nav`)
Fraunces is gone: General Sans for headings and the name, Cabinet Grotesk for everything else
(Fontshare woff2, self-hosted). The hero follows Lucas's mock: three lowercase status lines, the
links-only nav with a `say hi` pill, the vertical tagline "the person who gets things *moving*"
with the old site's looping scroll line, and `LUCAS VU` in capitals rising in letter by letter.
Inner pages get the old fixed bar with the "i am vu" logo. A `--metal` grey gradient sampled from
the chrome draws the underlines, the scroll line and the progress fill; rounded corners (8/16/24)
are allowed. Text rises in on scroll (GSAP ScrollTrigger) over Lenis smooth scrolling. Screens:
`.artifacts/screens/v1.2.0/`.

### Phase 12: work stack (`v1.3.0-work-stack`)
The home work section is now a Folio Stack: full-bleed rounded cards that pin near the top; each
covered card steps back (shrinks and dims) and leaves a sliver of its top edge, so the stack reads
as a pile. Title bottom left over the media, a one-line caption, `01 / 04`, a tag. The intro is
gone. Warframe is a card only: its still plays the glitch on hover, it says "coming soon", and
`/work/warframe` no longer exists. Films: `.artifacts/scroll/stack-1440/`, `stack-390/`.

### Phase 13: case studies v2 (`v1.4.0-case-studies`)
Shufflr and Ripple now follow Caleb Wu's RevisionDojo rhythm block for block (problem, two
insights side by side, two solutions, two design decisions, research, solution ideation, final
solution, key learnings, Next), with a visual on almost every block: the real media first, then
coded ones (counters, word-by-word statements, dots, drawn flow diagrams, criteria and pros/cons
cards, a scroll-scrubbed prototype, the Figma prototype on request). Caleb's microanimations are
listed in DECISIONS.md with what was rebuilt (chapter rail, grey media stage, snapshot box, dark
Next card). Maple Leaf follows the updated portfolio's overview plus three apps. Films:
`.artifacts/scroll/cs-1440/`, `cr-1440/`, `cm-390/`.

### Release candidate 2 (`v1.5.0-rc.2`)
Phases 10 to 13 merged into `main` with `--no-ff`, one annotated tag each. Gates on the final
build: typecheck clean, ESLint and Prettier clean, Vitest 32 tests (the ten physics acceptance
tests, slow-motion determinism, copy rules including Caleb's rhythm), Playwright 30 tests on Edge
with the real GPU, Taste inspector 0 FAIL on the home page with the allow-list in AGENTS.md (case
studies: only defended warnings and the 390 px headline-length rule, see DECISIONS Phase 13).
`scripts/sweep.mjs`: every route at 1440, 1024, 768 and 390, no console errors, no horizontal
overflow. Screens: `.artifacts/screens/v1.5.0/`, sweep shots in `.artifacts/sweep/`.

## Where to look first
1. `npm run build && npm run start`, open http://localhost:3000 . Watch `LUCAS VU` rise in, drag a
   ball, flick it, hover each ball, click one, press Escape. Scroll through the work stack.
2. Slow motion: open `/?slowmo=1` (or `/lab`), swing the cradle, rest the mouse on a ball. Sound on
   for the whooshes.
3. A case study: `/work/shufflr` (wide screen 1760 px+ shows the chapter rail), then `/work/ripple`
   and `/work/maple-leaf-foods`.
4. `npm run dev`, then `/lab`, `/lab/identity`, `/lab/physics` as before.
5. Visual evidence: `.artifacts/scroll/stack-1440/` (work stack), `.artifacts/scroll/cs-1440/`,
   `cr-1440/`, `cm-390/` (case studies), `.artifacts/caleb/` (Caleb's page, filmed),
   `.artifacts/folio/sheet.png` (Folio Stack demo), plus the earlier identity and story sheets.

## What still falls short
- **Physics:** the sequential-impact contact model matches the recording's loudness for about a
  dozen clacks, but a real toy synchronises faster at the end (its clack interval shrinks 13%, ours
  stays constant). A Hertzian contact model with micro-substeps during impacts would capture the
  wave dispersion; it is the main physics upgrade left.
- **Chrome:** convincing at hero size, but reflections of the strings are not visible, and the
  ball shadows are uniform rather than slightly darker at the core. The live balls show a pale rim
  (the wall at grazing angles) that the pre-rendered still does not, so the crossfade changes the
  rim slightly.
- **Identities:** the orb's prismatic dispersion is subtler than the reference photo; the
  gladiolus florets are rounded blobs rather than open ruffled petals.
- **Slow motion** only reacts to mouse moves: if the ball swings out from under a resting cursor
  the world stays slow until the mouse moves or leaves. The whoosh volume was set by loudness
  numbers, not by ear; check it with headphones.
- **Case studies:** the "feedback" block on Shufflr has no picture (nothing in the old material);
  headlines run three lines on phones (claim sentences, the skim test); the chapter rail only
  appears from 1760 px wide, where it fits beside the content.
- **Fallback still** is shot from one camera distance, so on screens far from 16:10 the shadows
  shift a few pixels at the crossfade.
- **Not built:** per-page OG images, pre-rendered per-identity fallback stills.

## Open questions for Lucas
1. Slow motion is off in production until you approve it (`?slowmo=1` to try). Turn it on by
   setting `slowmo.enabled` from the flag check in `src/scene/Interaction.tsx`.
2. Fonts: the ITF Free Font License allows self-hosting but forbids making the font files
   available to third parties. A public GitHub repo exposes `app/fonts/*.woff2`. Options: make the
   repo private, or switch to Fontshare's CSS API (no files in the repo).
3. Identity copy (`src/content/identities.ts`) is the PLAN 4.8 draft. Edit freely.
4. The 13-1-2 record: PLAN said soccer, your old site said the TCDSB West-End chess division. The
   site follows the old site.
5. The hero says "current product design lead of hack canada" (your words in PLAN 12.2); the
   About chronology still says Hackathons North America (LinkedIn). Pick one.

## Draft or unconfirmed content to check
- `src/content/projects.ts`: every `draft` field (roles on Shufflr, Ripple, Asper, Japan,
  Frictionless, SolarScore; Ripple team; SolarScore year; the song-search description, year and
  GitHub link; Warframe medium). New: the one-line captions on the four home cards, cut from each
  description.
- `src/content/caseStudies/*`: headlines rewritten as first-person claims; block bodies condensed
  from your old copy; Ripple's pros and cons per idea are drafted from the two criteria in your old
  copy; Ripple's water number is restated as the paper gives it (500 mL per 10 to 50 responses,
  not per 10). Maple Leaf has no reflection (the old placeholder no longer shows).
- `src/components/Close.tsx`: "I'm looking for Summer 2027 co-op roles" (from LinkedIn S27).
- `src/content/about.ts`: captions tightened from your old site; chronology dates from LinkedIn.

## Morning to-dos
1. Connect the repo to Vercel; set `NEXT_PUBLIC_SITE_URL` to the production URL (sitemap, OG).
2. Decide on the font-licence question above before the site goes public.
3. Try slow motion and decide; read the drafts above and edit the content files.
4. Try it on a phone (two taps to open a story, the work stack, a case study) and with sound on.
5. `bash scripts/audio/fetch.sh` restores the calibration recordings and the whoosh source.

## Git
Branches `phase/00-foundation` to `phase/13-case-studies`, `release/1.0.0-rc.1` and
`release/1.5.0-rc.2`; tags `v0.0.0-foundation` to `v1.4.0-case-studies`, `v1.0.0-rc.1` and
`v1.5.0-rc.2`, all pushed to origin. No force pushes, no rewritten history. `.gitattributes` now
pins LF line endings (Windows checkouts had CRLF, which failed Prettier).
