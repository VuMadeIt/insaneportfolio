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
