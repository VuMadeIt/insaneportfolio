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

## Where to look first
1. `npm run build && npm run start`, open http://localhost:3000 . Drag a ball, flick it, let it go.
   Hover each ball, click one, press Escape.
2. `npm run dev`, then `/lab` (materials, HDRIs, tone mapping, shadows, strings, reveal variants),
   `/lab/identity` (the four identities large; `?reveal=a|b|c&value=0.5`), `/lab/physics` (2D
   debugger, scenarios, slow motion, the recording's onsets on the desk preset).
3. Visual evidence: `.artifacts/identity/r1..r4.png` (identity rounds vs references),
   `.artifacts/story/1440/sheet.png` and `390/sheet.png` (the choreography, frame by frame),
   `.artifacts/lab/` (HDRI and material comparisons), `docs/physics/calibration.svg`.

## What still falls short
- **Physics:** the sequential-impact contact model matches the recording's loudness for about a
  dozen clacks, but a real toy synchronises faster at the end (its clack interval shrinks 13%, ours
  stays constant). A Hertzian contact model with micro-substeps during impacts would capture the
  wave dispersion; it is the main physics upgrade left.
- **Chrome:** convincing at hero size, but reflections of the strings are not visible, and the
  ball shadows are uniform rather than slightly darker at the core.
- **Identities:** the orb's prismatic dispersion is subtler than the reference photo; the
  gladiolus florets are rounded blobs rather than open ruffled petals.
- **Fallback still** is shot from one camera distance, so on screens far from 16:10 the shadows
  shift a few pixels at the crossfade; on phones taller than about 1:2.2 the portrait still ends a
  few pixels below the top edge.
- **Not built:** per-page OG images (pages have OG titles and descriptions; case studies use their
  poster), pre-rendered per-identity fallback stills (the no-WebGL story pages show the chrome
  still with the story text), the lab's string material comparison is only visible at 1 px.
- Case-study headlines run three to five lines on phones. They are claim sentences by design (the
  skim test); shorten them if you want tighter headlines.

## Open questions for Lucas
1. Warframe / Digital Extremes: is any of it showable? The exhibit and page say "under wraps"
   and invite an email.
2. Identity copy (`src/content/identities.ts`) is the PLAN 4.8 draft. Edit freely.
3. Reveal variant: B (glass) ships; A and C are in `/lab` and `?reveal=`. Material: chrome.
4. The 13-1-2 record: PLAN said soccer, your old site said the TCDSB West-End chess division. The
   site follows the old site.
5. Is "Hackathons North America" right (the old site said Hack Canada)?

## Draft or unconfirmed content to check
- `src/content/projects.ts`: every `draft` field (roles on Shufflr, Ripple, Asper, Japan,
  Frictionless, SolarScore; Ripple team; SolarScore year; the song-search description, year and
  GitHub link; Warframe medium). Frictionless team names were normalised from Devpost handles.
- `src/content/caseStudies/*`: headlines rewritten as first-person claims (body copy is yours,
  ported). The Maple Leaf reflection is a placeholder for you to write.
- `src/components/MoreDialog.tsx`: the two-sentence intro.
- `src/components/Close.tsx`: "I'm looking for Summer 2027 co-op roles" (from LinkedIn S27).
- `src/content/about.ts`: captions tightened from your old site; chronology dates from LinkedIn.

## Morning to-dos
1. Connect the repo to Vercel; set `NEXT_PUBLIC_SITE_URL` to the production URL (sitemap, OG).
2. Read the drafts above and edit the content files.
3. Try it on a phone (two taps to open a story) and with sound on.
4. If you want the lab in a preview build: `LAB=1` at build time.
5. `bash scripts/audio/fetch.sh` restores the calibration recordings if you want to rerun
   `scripts/audio/analyse.py` or `scripts/physics/calibrate.ts`.

## Git
Branches `phase/00-foundation` to `phase/09-polish` and `release/1.0.0-rc.1`, tags
`v0.0.0-foundation` to `v0.9.0-polish` and `v1.0.0-rc.1`, all pushed to origin. No force pushes,
no rewritten history. One note: the first physics commit contains the four Freesound previews
(they were untracked in the next commit); all four licences permit this with the attribution in
CREDITS.md.
