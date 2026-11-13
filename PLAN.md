# Lucas Vu Portfolio: Master Plan

This file is the single source of truth for building Lucas Vu's portfolio. It is written to be
executed by an autonomous agent in a long unattended session (overnight). Read it fully before
touching anything. Then follow **Part 9 (Execution protocol)** exactly.

**Revision 2 (2026-11-03): Part 12 overrides earlier parts wherever they conflict** (typeface,
rounded corners, nav, hero copy, work section, case studies, Warframe, slow motion).
**Revision 4 (2026-11-03 evening): Part 13 overrides Parts 1-12** (light only, nav, cursor, work
rows, physics footer, timeline, how case studies are written and drawn).

Kickoff prompt Lucas will paste into a fresh session:

> Read PLAN.md and AGENTS.md in full. Execute the plan autonomously from Phase 00 onward, following
> Part 9. Do not stop to ask me questions; make the best decision, log it in DECISIONS.md, and keep
> going. Physics and physical realism are the top priority. Finish with REPORT.md.

---

## Part 1. The vision (non-negotiable)

**One sentence:** a quiet, museum-white portfolio whose hero is a real-looking chrome Newton's
cradle with four spheres hanging from the top of the screen; one ball moves, transfers its momentum,
and causes something else to happen. That is Lucas: *"I like getting things moving."*

### 1.1 The feeling
- The whole site feels like a **clean museum exhibition**. Objects are exhibits; text is wall text
  and wall labels. Calm, generous white space, one serif typeface, square corners everywhere.
- The hero object must look like a **real physical object photographed on a gallery wall**, not a
  3D demo, not a game, not "made by code", never cartoony. Benchmark: Sam Cheng's lanyard
  (samfcheng.com) is literally a photograph (`/assets/badge-lanyard.webp`, 900x1997) with a soft
  shadow falling on the wall behind it. Our cradle must reach that level of believability while
  being fully interactive in real time.
- **Realism beats effects.** Real-world scale, real gravity, real materials, real light, real
  sound. If a choice makes it look more like a render and less like a photograph, it is wrong.

### 1.2 What Lucas asked for, verbatim decisions
- Exactly **4 spheres**: People, Ideas, Experiments, Products (in that order, left to right).
- Strings: **clear, real-looking strings** (nylon monofilament) extending from the top of the
  screen. Strings must **sway with real physics**.
- **Shadow on the wall, not on a floor.** A museum spotlight throws soft shadows of the spheres
  and strings onto the wall behind them. There is no floor.
- Name below the cradle, huge, like Sam Cheng's: **"Lucas Vu"** in Fraunces, running edge to edge
  along the bottom of the hero, the cradle hanging in front of it.
- Tagline **"I like getting things moving."** is the **top-left corner line** (like Sam's
  "I design products and the stories behind them. [more]").
- Materials to compare: **chrome (primary, most effort)**, matte white porcelain, dark metal.
- Hover reveal variants to compare: **all three** (A surface fade, B glass with glowing interior,
  C ripple dissolve from the cursor). See Part 4.
- Sound: **real classic clack**, quieter as the balls slow down.
- Physics identical for every sphere regardless of material. Hover never changes mass/collider.
- Typeface: **Fraunces**, formatted like Sam Cheng's site (one serif family for everything).
- Nav: **Sam-style**. Home has no nav bar (corner text only). Inner pages get a slim top line with
  a back arrow plus Work, About, Email.
- Work section: **full-screen cards that stack on top of each other as you scroll** (the sticky
  stacking idea from cathyyin.ca only), **no rounded corners**, museum feel.
- Featured projects (3-4 strongest): **Shufflr, Ripple, Maple Leaf Foods, Warframe/Digital
  Extremes**. A "View all work" page lists everything else.
- Case studies: a strong mix of Caleb Wu (calebwu.ca) story structure, Sam Cheng's layout, and
  Rachel Chen's case-study framework (rachelchen.tech; see 6.4).
- About page: museum-like.
- Identities are remade **in code** (procedural shaders/geometry) to match Lucas's four reference
  images as closely as possible, mapped as cohesive 3D objects (no black square backgrounds),
  each with life: the eye blinks, the flower sways and clouds drift, the idea orb flows like the
  ChatGPT / AI voice orbs, the atom moves like Lucas's reference video.

### 1.3 The click choreography (Lucas's own description, refined)
1. Click a sphere. **All strings dip down slightly together** (anticipation, like a curtain being
   tugged), then **everything rises**, accelerating (quicker at the end, like a theatre curtain).
2. The three other spheres rise **out of frame**. The chosen sphere rises only back to its
   **original rest position** (its string length never changes).
3. Once the others are gone, the chosen sphere's anchor **glides to the left third** of the screen.
   Because the anchor is moved kinematically and the ball is simulated, the ball **lags and swings
   naturally** behind the moving anchor, then settles. This is the signature moment.
4. To the right of the sphere: the identity **title** (e.g. "People"), a tight one-line title
   description, then **three short, memorable sentences**. The giant name slides down out of view
   to open up white space.
5. The chosen sphere can still be **dragged and swung by itself** in this state.
6. A **back arrow** (top-left, Sam-style), **Escape**, or clicking empty wall reverses everything:
   the sphere glides back, the others lower from above with a soft physical settle.
7. Each identity has its own URL: `/people`, `/ideas`, `/experiments`, `/products` (shareable,
   back button works). The 3D canvas persists across these routes (it lives in a shared layout and
   never remounts).

---

## Part 2. Research findings (do not redo; use)

### 2.1 samfcheng.com
- SvelteKit. **One family only: PP Kyoto** (slab serif), weights 400 and 500 plus italics.
- Hero = three things: top-left and top-right corner lines (~15-17px), a huge name along the bottom
  edge (~20vw, very tight leading, slight negative tracking, overflowing the edges), the lanyard
  photo hanging from the top in front of the name with a soft offset shadow on the wall.
- Tokens: `--page-gutter: clamp(32px, 8vw, 128px)`, `--ease-out: cubic-bezier(.23,1,.32,1)`,
  `--ease-drawer: cubic-bezier(.32,.72,0,1)`. Background a very light warm grey/white.
- `[more]` in the corner line is a bracketed underlined button that opens a dialog.
- Work list: project title large, two-to-four line description, date in muted grey, thin rules
  between rows, preview image.
- Case study: centred large title, date pill + link pill, floating dark pill nav at top
  (Back / LinkedIn / X / Instagram / Email), "00 — Context" numbered sections, Role / Team /
  Skills three-column meta, narrow reading column (~600px), wide images, floating bottom progress
  pill showing the current section.
- Footer close: "Building products that people care about." with contact links in running text.

### 2.2 calebwu.ca
- Next.js; SF Pro Display + PP Neue Montreal. Home is a **stack of full-screen cards**: hero card
  on top of RevisionDojo on top of Metalab; a "1 of 5" pill with project icons tracks position.
- Case study story order: year + title + one-paragraph summary + Team block, hero images, then
  **The problem -> Insight #1 -> Insight #2 -> Solution -> Solution -> Design decision -> Design
  decision -> Research (context, pain points, consolidating data) -> Solution ideation (evaluating
  ideas with pros/cons, prototype, feedback) -> Final solution -> Key learnings -> Next project
  card.** Each block: short label, one-sentence headline, two lines of text, one big image.
- Lucas loves Caleb's case studies. Take the **story rhythm and the "Next" card**, not the visual
  styling (no rounded cards, no emoji, no SF Pro).

### 2.3 cathyyin.ca
- Full-width cards that are `position: sticky` and stack: each next card slides up over the
  previous one. **Take only that mechanic.** Everything else (rounded corners, pastel gradients,
  pill buttons, tracked caps) is explicitly rejected.

### 2.4 Rachel Chen (rachelchen.tech), case study framework
The Instagram reel (instagram.com/p/DcKkNHUsTOj, "portfolio to offer, episode 2: case studies")
could not be watched (video behind login). Her published case studies show the framework:
- Metadata header: **Collaborators, Timeline, Scope**.
- The **problem stated as one bold sentence headline**, then the product as one bold sentence,
  then an **impact number** ("8,000+ users").
- Every following section headline is a **first-person claim that tells the story when skimmed**
  ("I built a design system to support our rapid product development.").
- Scannability: strong type hierarchy, consistent grid inside each section.
Rule for us: a visitor who reads **only the headlines** of a case study gets the whole story.

### 2.5 Lucas's own material (the content source of truth)
- LinkedIn `in/beinglucasvu`: Product Designer @ Digital Extremes (Sep 2026-present); Product
  Design Lead @ Hackathons North America (May 2026-present); Design Engineer @ Parrot (YC F25)
  (Jul-Aug 2026); Product Designer @ Creators Collective (Jan-Jun 2026); Figma Design Director @
  Waterloo Engineering Society (Jan-Apr 2026). Systems Design Engineering @ University of
  Waterloo. "6x designathon/hackathon winner who loves connecting with people, building amazing
  products, and being on stages." Seeking S27 co-ops.
- Previous portfolio (Next.js): https://lucas-vu.vercel.app and its source repo
  **github.com/VuMadeIt/updated-portfolioi** (Lucas owns it). It contains full case-study copy and
  assets:
  - `src/components/project/shufflr/shufflrContent.ts` (+ `public/images/shufflr`,
    `public/videos/shufflr`)
  - `src/components/project/ripple/rippleContent.ts` (+ images, videos, Figma embed URL)
  - `src/components/project/maple-leaf/mapleLeafContent.ts` (+ images)
  - `src/components/about/AboutPage.tsx` + `src/assets/{community,experience,polaroid}`
  - `src/components/design-philosophy/content.ts` ("Why I'm Finally Ready to Call Myself a
    Designer", hummingbird video)
  - `src/lib/comingSoonProjects.ts`: Warframe and Parrot were "Coming Soon".
  - Old experience list: Parrot YC (Design Engineer, contract, 2026), Hack Canada (Product Design
    Lead, 2026), Waterloo Engineering Society (Figma Design Director, 2026), Maple Leaf Foods
    (Digital Product Manager, 2026), The Local Charity (Systems Design and Ops Coordinator, 2025).
- Devpost **LucasMadeIt** (use `curl -A "Mozilla/5.0 ..."`; plain fetch gets 403): Shufflr
  (Winner), Asper (Winner), Frictionless, "We should go to Japan" (Hack the 6ix), SolarScore.
- GitHub VuMadeIt repos: parrotyc, slanguage, chess4connection, impressionista, sweatertexture,
  lucasvu (contains "google song search" rebuild, see his LinkedIn post), urbanplanningportfolio.
- Contact: lucasvu.work@gmail.com, linkedin.com/in/beinglucasvu, github.com/VuMadeIt,
  instagram.com/bigmanvu, x.com/bigmanvu, devpost.com/LucasMadeIt.
- Personal lore (from old About page): solo backpacking trip in Japan; cadets (week-long camping
  trips, instructing classes of 70+, parading in the snow, fundraising for veterans; joined to
  overcome anxiety); soccer (TCDSB West-End, last season 13-1-2); high-school chess club;
  Socratica, UW/UX, Blueprint; 15-minute speech at a Volunteer Appreciation Ceremony; fishing
  (hummingbird over the tip of his rod); "the young fisherman".
- **Accuracy rule:** never invent facts, numbers, clients, quotes or results. Anything drafted
  gets `DRAFT` in the content file and is listed in REPORT.md for Lucas to confirm.

### 2.6 Physics research
- Use **XPBD with many small substeps** (Müller et al., "Small Steps in Physics Simulation";
  Ten Minute Physics tutorial 05 "Newton's cradle / constrained dynamics":
  https://matthias-research.github.io/pages/tenMinutePhysics/ and
  https://emlyn.github.io/tenminutephysics/05-cradle.html). Small steps make the momentum pass
  cleanly through touching balls, which general rigid-body engines (Rapier etc.) do poorly.
- **Rapier is not used.** A focused custom solver is cleaner, deterministic, testable and cheaper.

### 2.7 Reference assets found (use these, verify licences when downloading)
- HDRI environments (CC0, Poly Haven, `https://api.polyhaven.com/assets?t=hdris&c=studio`):
  candidates `studio_small_09`, `photo_studio_loft_hall`, `photo_studio_london_hall`,
  `brown_photostudio_02`, `monochrome_studio_02`, `studio_kontrast_02`, `pav_studio_03`. Evaluate
  4+ in the lab, pick the one whose reflections in chrome look like a real gallery/studio.
- Surface imperfection textures (CC0, ambientCG.com): fingerprints / smudges / fine scratches for
  roughness variation on chrome and dark metal. Subtle. Realism lives here.
- Newton's cradle recordings (Freesound): drewtait #676377 (CC0), LoafDV #131596 and #94030,
  HandroMyburg #763542. **Check each licence on its page.** Prefer CC0. Full downloads need a
  login; if blocked, use the public preview MP3s only for CC0 sounds. Credit everything in
  `CREDITS.md`.
- AI-orb references for the Ideas sphere: github.com/weeeha/AI-Orb (style guide with six orb
  archetypes; Plasma and Prism are closest), rareui.com/components/fluidorb (ChatGPT-voice
  fluid orb technique: domain-warped FBM, 3-colour ramp, slow drift). Study, do not copy code
  without a compatible licence.
- Real-world photo references for realism calibration (not shipped): search Wikimedia Commons /
  Openverse for "Newton's cradle", "chrome sphere", "fishing line", "museum spotlight wall
  shadow". Save to `reference/realism/` with source + licence in `reference/realism/SOURCES.md`.
  The Taste skill's `scripts/assets.mjs` can search these collections.

---

## Part 3. Technical architecture

### 3.1 Stack (pin exact versions; prefer releases published at least 7 days ago)
- **Next.js (App Router) + React + TypeScript (strict)**. Latest stable at time of run
  (Nov 2026: next 16.4.x, react 19.x). `npm` as package manager.
- **three.js + @react-three/fiber + @react-three/drei** for rendering.
- **Custom XPBD physics** in plain TypeScript (no Rapier). Runs in the main thread (4 balls are
  cheap); keep it framework-free so it can move to a Worker later if needed.
- **GSAP** for UI/visual tweens and the curtain choreography timeline (never for physics state).
- **Tailwind CSS v4** with design tokens as CSS variables.
- **zustand** for interface state (hover, focus, selected identity, material, reveal variant).
- **Vitest** for unit/physics tests. **Playwright** (`@playwright/test`, `channel: "msedge"`; Edge
  is installed at `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`, Chrome at
  `%LOCALAPPDATA%/Google/Chrome/Application/chrome.exe`) for e2e and screenshot capture.
- **leva** (dev-only) for the comparison lab controls. Never shipped to production bundles.
- **Fraunces** via `next/font/google` (variable; axes `opsz`, `wght`, `SOFT`, `WONK`; OFL licence,
  self-hosted by Next automatically).
- Tooling: ESLint (next config) + Prettier, `tsc --noEmit`. No unused deps.

### 3.2 Folder structure
```
app/
  layout.tsx                 fonts, tokens, persistent <Stage/> slot
  (site)/
    page.tsx                 home: hero + stacked work + close
    [identity]/page.tsx      /people /ideas /experiments /products (static params)
    work/page.tsx            all work (catalogue)
    work/[slug]/page.tsx     case studies
    about/page.tsx           about (museum room)
  lab/                       dev-only comparison lab (404 in production unless LAB=1)
    page.tsx                 materials x reveal variants x identities, leva panel
    physics/page.tsx         2D physics debugger: plots, energy, sliders, scenarios
src/
  physics/                   PURE TS. No three.js, no React imports.
    vec.ts                   small vec3 math
    config.ts                all physical constants (single shared BallSpec)
    cradle.ts                world: balls, anchors, constraints, step()
    rope.ts                  secondary visual rope simulation
    contacts.ts              sphere-sphere contacts + restitution
    drag.ts                  pointer drag constraint
    events.ts                collision events (for sound)
    *.test.ts
  scene/
    Stage.tsx                <Canvas>, camera, renderer settings, frameloop control
    Cradle.tsx               reads sim state, positions meshes (interpolated)
    Sphere.tsx               visual mesh + material + reveal component (one per ball)
    Strings.tsx              rope tubes + clear nylon material
    Wall.tsx                 the gallery wall that receives shadows
    Lighting.tsx             museum spot key light, fill, HDRI environment
    materials/{chrome,porcelain,darkMetal}.ts
    identities/{people,ideas,experiments,products}/  shader + geometry + animation
    reveal/{fade,glass,ripple}.ts                    the three reveal variants
    AccessibleTargets.tsx    HTML buttons projected over each sphere
  audio/
    clack.ts                 WebAudio sample bank, velocity->gain, chain grouping
  state/
    ui.ts                    zustand store (UI only; physics never reads it)
  content/
    identities.ts            title, description, three sentences per identity
    projects.ts              all projects (featured flag, wall label data)
    caseStudies/{shufflr,ripple,maple-leaf,warframe}.ts
    about.ts
  components/                Corner, GiantName, WallLabel, StackedCards, ProgressPill, Nav...
  styles/tokens.css
public/
  hdri/  textures/  audio/  media/<project>/  fallback/
reference/                   NOT shipped. identity images, layout refs, realism refs, videos
scripts/                     asset processing (palette extraction, audio slicing, image opt)
```

### 3.3 The three layers (strict separation)
1. **Physics (`src/physics`)** owns position, rotation, velocity and collisions. Deterministic,
   fixed timestep, unit-tested. Knows nothing about materials, hover, or React.
2. **Visual (`src/scene`)** reads a snapshot of physics state every frame (interpolated between
   fixed steps) and renders it. Materials and reveals change only shader uniforms.
3. **Interface (`src/state`, `components`)** owns hover/focus/selection/route. It may send
   *commands* to physics (grab, move pointer, release, move anchors for choreography) through a
   small typed API. It never writes ball positions directly.

Each sphere instance = a rigid body (physics), a spherical collider (physics), a bifilar
suspension constraint pair (physics), a visual mesh (scene), a material/reveal component (scene),
and an accessible interaction target (DOM button). All four share one `BallSpec`.

---

## Part 4. The hero object in detail (highest priority)

### 4.1 Physics (the most important part of the whole project)
**Units are SI and gravity is real (9.81 m/s^2). Never scale time to fake a feel.**

Model:
- **Ball:** one rigid body per sphere, identical `BallSpec` for all four: radius, mass from steel
  density (7850 kg/m^3), restitution, drag coefficient. Hover/material never touch it.
- **Suspension:** real cradles hang each ball from **two strings in a V (bifilar)** to two anchors
  spaced front/back in depth, which keeps the swing in one plane. Model each string as a
  **unilateral distance constraint** (`|p - anchor| <= L`): a string can pull, never push. This
  gives correct slack automatically (lift a ball above its arc and it falls freely until the string
  snaps taut). Anchors are above the top of the viewport (strings run off-screen).
- **Contacts:** sphere-sphere contact constraints solved in the XPBD position pass, then a
  velocity pass applies restitution (Müller's rigid-body XPBD: correct normal velocity to
  `-e * v_n_before`). Balls rest with a tiny gap (about 0.05-0.2 mm) so a chain resolves as fast
  sequential collisions, which is what makes a real cradle work.
- **Integrator:** fixed simulation step (e.g. 1/240 s) with many substeps (start at 20 per step,
  i.e. ~4800 Hz) and one constraint iteration per substep. Render with an accumulator and
  interpolation so results are identical at 30, 60, 120 and 144 fps.
- **Damping (all shared, all physical):** quadratic air drag (`0.5 * rho_air * Cd * A * |v| v`,
  rho_air 1.2, Cd ~0.47), contact energy loss via restitution, and a very small suspension
  hysteresis term. **Calibrate restitution and hysteresis against a real recording** (4.4): match
  the clack interval timing and the decay of loudness over time. A real cradle slowly degrades
  into all balls swinging together; this should emerge on its own.
- **Ball orientation:** the eyelet screwed into the top of each ball points toward the midpoint of
  its two anchors (rigidly attached), so the ball visibly rotates as it swings, like a real one.
- **Scale:** pick ball diameter and string length so the cradle reads as a substantial gallery
  object and the swing period feels right on screen. Period comes from real physics
  (`T ~ 2*pi*sqrt(L/g)`), so tune L, not time. Start with diameter 60-70 mm and an effective
  length of 0.5-0.9 m, then judge against reference footage/recordings.
- **Drag interaction:** on pointer down over a ball, add a compliant XPBD "hand" constraint from
  the ball to the pointer's intersection with the swing plane. The strings still win, so a pointer
  beyond reach keeps the ball on its arc. Pulling one ball into its neighbours pushes them (real).
  Release keeps the ball's velocity (a flick works). Clamp to a sane maximum angle (~70 deg) only
  via the hand constraint's softness, never by teleporting.
- **Sleep:** when total kinetic energy stays under a threshold for ~2 s, the sim sleeps and the
  canvas switches to on-demand rendering. Wake on any input or choreography.
- **Idle state:** perfectly still on load (Lucas: "hanging perfectly still").

**Physics acceptance tests (Vitest, must all pass before Phase 01 merges):**
1. Single pendulum period matches `2*pi*sqrt(L/g) * (1 + theta0^2/16)` within 0.5% (5 deg and
   30 deg).
2. One ball released from 30 deg: after the first chain, the far ball leaves with >= 95% of the
   incoming speed; the middle balls' peak displacement < 1 deg.
3. Two balls lifted -> two balls leave. Three lifted -> three leave.
4. Horizontal momentum through each collision conserved within 1%; total energy never increases
   without input.
5. Slack test: lift a ball above its arc and release -> free fall, taut snap, no explosion,
   string constraint error < 0.1 mm at all times.
6. Torture test: 10,000 random drag/release steps -> no NaN, interpenetration < 0.05 mm.
7. Frame-rate independence: identical state hash after 10 s at simulated render rates 30/60/144.
8. Material independence: switching material/reveal/identity in the UI store does not change the
   physics state hash (the physics module must not import anything from scene/state).
9. Long run: after 60 s the motion has decayed toward the calibrated envelope and the middle balls
   have picked up motion (emergent, real-cradle behaviour).
10. Kinematic anchor move (choreography): moving anchors along a curve makes the ball lag and
    swing, then settle, with no constraint violation.

Also build `/lab/physics`: a 2D side-view debugger plotting each ball's angle and energy over time,
sliders for every constant, scenario buttons (1/2/3 balls, slack drop, anchor glide), and an
overlay of the real recording's onset times for calibration.

### 4.2 Strings (must look and move like real fishing line)
- **Two-tier simulation:** the bifilar constraints above are the physical truth. Each visible
  string is a **secondary rope simulation** (16-24 particles, XPBD inextensible segments, gravity,
  light air damping) pinned at the anchor and at the ball's eyelet. When the string is taut it is
  forced straight (its endpoints are exactly one rope-length apart); when the ball bounces or is
  lifted, the string goes **slack and sways** naturally; a hard collision sends a small transverse
  **wobble** up the line (inject a small impulse into the mid particles proportional to impact
  speed). The rope never feeds back into the ball (keeps physics clean).
- **Look:** clear nylon monofilament, ~0.3-0.5 mm real thickness. Render as a dynamic tube
  (Catmull-Rom through the particles, 6 radial segments) with a custom material: mostly
  transparent, a bright specular line from the environment, slight refraction/darkening of the wall
  behind it, fresnel edges. **Keep it at least ~1 device pixel wide**: if the projected width is
  under 1px, widen it to 1px and lower its opacity in proportion (prevents shimmer/aliasing). The
  string should read like Lucas's sketch (a thin line) until you look closely and see it is clear.
- **Attachment hardware:** each ball has a small chrome **screw eye** on top; each string ties
  through it with a tiny knot/crimp. Real cradles have this; it sells the realism.
- **Shadows:** strings cast faint, thin, soft shadows on the wall too.
- Lab comparison: clear nylon (default) vs thin dark thread vs silver wire.

### 4.3 Materials, light and wall (photographic realism)
- **Camera:** fixed, no orbit. Long-lens product-photography look (vertical FOV ~15-22 deg), very
  slightly above the balls' centre line so the V of the strings is barely perceptible.
- **Renderer:** WebGL2, physically correct lights, **AgX or ACES/Neutral tone mapping** (compare
  in lab), sRGB output, MSAA x4 or SMAA, DPR capped at 2. Colour-manage so the WebGL wall
  matches the CSS page background exactly at the canvas edges (sample pixels in a Playwright test).
- **Wall:** a large plane ~25-40 cm behind the balls, same colour as the page ground. Lit by a
  **museum spotlight** (key light from upper-front-left) creating a very subtle pool of light;
  the edges of the canvas must blend invisibly into the page.
- **Shadows on the wall:** soft, physically plausible (contact hardening: sharper near, softer
  far). Use PCSS (drei `SoftShadows`) or a high-res VSM spot shadow; compare in lab. This is
  Lucas's "drop shadow on the wall".
- **Chrome (primary, most effort):** metalness 1, roughness ~0.03-0.06, with an ambientCG
  fingerprint/smudge map modulating roughness very subtly. Reflections come from the chosen HDRI
  **plus a per-ball dynamic cube camera** (128-256 px, round-robin updates) so each ball reflects
  its neighbours, the strings and the wall. Balls reflecting each other is what makes a cradle look
  real. Slight clearcoat is not needed for metal.
- **Porcelain (compare):** warm white, roughness ~0.3, clearcoat 1 (roughness ~0.08) for a glaze,
  soft wrap lighting to fake subsurface softness.
- **Dark metal (compare):** gunmetal/blackened steel, metalness 1, roughness ~0.2-0.3, fine
  scratches map, gentle anisotropy.
- Reuse geometries and materials; one sphere geometry for all balls. No expensive screen-space
  reflections. Selective bloom only for emissive identity interiors, tiny intensity, if at all.
- **Realism review loop:** after each material change, capture the hero at 1440 / 768 / 390 and
  compare side-by-side with the real photos in `reference/realism/`. Write what still looks fake
  (edges, highlights, shadow softness, string brightness, scale) in DECISIONS.md and fix the top
  three each round. Minimum three rounds for chrome.

### 4.4 Sound
- Pipeline (`scripts/audio/`): download the CC0 recordings, detect onsets (ffmpeg `silencedetect`
  or numpy envelope; Python 3.12 + numpy + OpenCV are installed, ffmpeg 9 is installed), slice
  8-16 individual clacks, normalise, trim, export small `.webm/opus` + `.mp3` to `public/audio/`.
- Also measure **inter-clack intervals and the loudness decay** from the recordings and use them
  to calibrate physics (4.1).
- Runtime (`src/audio/clack.ts`): WebAudio, unlocked on the first pointer down. Physics emits
  collision events with impact speed. Collisions within a few milliseconds of each other in one
  chain play as **one** clack (that is what a real cradle sounds like). Gain ~ log of impact
  speed, so it gets quieter as the swing decays; random sample + playback rate 1 +/- 3%; gentle
  low-pass for soft hits; stereo pan by x position. Silence below a speed threshold.
- A small text toggle in the hero's bottom-right corner, Sam-style brackets: `[sound on]` /
  `[sound off]`. Default on after the first interaction (Lucas: "9c"). Respect a muted tab.

### 4.5 The four identities (remade in code)
Source images (Lucas owns them): `reference/identities/people-eye.jpg`, `idea-orb.jpg`,
`experiment-atom.png`, `product-flower.jpg`. Extract each image's palette with a script
(`scripts/palette.py`, k-means in OpenCV -> JSON) and use the real colours.

All identities are **inside the sphere, in object space**, so they rotate and swing with the ball:
ray-sphere intersection in the fragment shader, then a short volumetric march or layered shells
(24-48 steps). The black backgrounds of the images become depth/darkness inside the sphere, never
a square. Each is built and tuned in `/lab` against its source image side by side; at least three
compare-and-fix rounds each, with notes in DECISIONS.md.

- **People (eye):** an iris filling the sphere's face: radial fibres (polar FBM stretched along the
  radius), multi-hue palette (blues, cyan, magenta, warm yellow/orange from the image), crypts, a
  collarette ring, a dark limbal ring, a black pupil with a soft edge, a wet cornea dome with a
  specular highlight. **Life:** natural blinks every 3-7 s (two soft dark lids sweep closed and
  open, about 120 ms close and 180 ms open), pupil breathing, and micro-saccades that glance
  toward the cursor.
- **Ideas (light burst / AI orb):** a white-hot core with radial filaments and spectral dispersion
  (RGB offsets), slowly flowing through domain-warped FBM like the ChatGPT voice orb and other AI
  orbs (Devin's orb, weeeha/AI-Orb Plasma/Prism). Breathes; flows a little faster on hover.
- **Experiments (atom):** reference video `assets/20261103-0005-32.9774752.mp4` (458x384, 5 s,
  30 fps; move it to `reference/identities/atom-motion.mp4` in Phase 00). Extract frames
  (`ffmpeg -i <video> -vf fps=10 reference/video-frames/atom-%03d.png`) and match the motion:
  - 8-10 **comet-like electrons**: small, very bright, slightly elongated white-blue heads
    travelling along **tilted great-circle orbits** at different inclinations and speeds.
  - Each electron leaves a **glowing thin trail** that persists, so over a few seconds the trails
    **weave themselves into a full wireframe sphere** of crossing rings (begins sparse: a few
    arcs; ends dense: a complete lattice). Trails are crisp near the head and fade/thin with age.
  - Near the end a **nucleus flares** at the centre: a soft bright core with a subtle star-shaped
    glint, lighting the inside of the lattice.
  - Palette: cool white trails, blue-white heads, deep navy-to-black interior (matches
    `experiment-atom.png`).
  - In the sphere: loop seamlessly (trails decay as new ones are drawn so the lattice "breathes"
    between sparse and dense rather than resetting). On hover the reveal starts the weave from
    sparse, and the nucleus flare lands as the reveal completes.
  - Implementation: electrons as analytic orbits (no sim), trails as a ring buffer of past
    positions rendered as additive tapered ribbons (or a ping-pong trail texture in sphere space),
    nucleus as an additive sprite plus a faint 4-point glint, all inside the sphere in object space.
- **Products (flower in a bubble):** a thin-film iridescent soap-bubble shell (MeshPhysical
  `iridescence` or a custom thin-film term), a sky with **slowly drifting clouds** inside
  (volumetric FBM), and a **gladiolus** stem with ruffled pink florets and green buds built as real
  geometry (procedural stem curve, instanced petals with ruffled edges, soft translucency) that
  **sways side to side** gently inside the bubble.

### 4.6 The reveal (chrome -> identity) and its three variants
A `uReveal` uniform (0..1) per sphere, tweened by GSAP over ~0.6-0.9 s with the site ease on
hover/focus, reversed on leave. Physics is untouched.
- **A. Surface fade:** the chrome reflection dissolves into the identity as a surface finish.
- **B. Glass (expected favourite):** the metal turns into a clear glass/bubble shell (refraction,
  fresnel, the wall visible through the edges) and the identity glows from inside.
- **C. Ripple:** a liquid-metal ripple spreads from the cursor's hit point across the sphere,
  revealing the identity behind the wavefront (mercury-like, physical, no neon outline).
All three are selectable in `/lab` and via `?reveal=a|b|c` on preview builds. Default = the best
one after review (log the reason).

### 4.7 Click choreography implementation
- One GSAP timeline drives **kinematic anchor positions** (and only that) through the physics
  command API: dip (anchors -3 to -5% of length over ~140 ms, ease out), then rise (ease in,
  accelerating, "quicker at the end"). Non-selected anchors keep rising until their balls exit the
  top. The selected anchor returns to rest height. Then the selected anchor glides to the left
  third (~0.9-1.2 s, site drawer ease). Because the ball is simulated, it lags, swings and settles.
- Text column fades/rises in after the glide begins (staggered: title, description, sentences).
- The giant name translates down out of view in the selected state.
- Reverse timeline on back/Escape/empty-wall click. Interrupting mid-animation must be safe.
- Route sync: entering `/people` directly renders the selected state immediately (no intro
  animation), with correct metadata/OG tags per identity.

### 4.8 Identity copy (DRAFT; Lucas to edit; no em dashes)
- **People**: *Where every problem starts.*
  "I've always been curious about what makes people tick. I've run chess nights, taught cadet
  classes of seventy, and I still talk to strangers at every design event in Waterloo. The best
  problems I've solved were hiding inside someone else's story."
- **Ideas**: *The first push.*
  "Ideas are cheap until someone moves first. Six hackathon wins taught me to say 'what if' out
  loud and sketch it before the room moves on. Most of mine are bad; the good ones only showed up
  because I kept swinging."
- **Experiments**: *Built to find out.*
  "I'd rather build it than argue about it. When Figma couldn't show how a shuffle should feel, I
  coded it; when Google's song search annoyed me, I rebuilt it. Experiments are how I find out I'm
  wrong quickly and cheaply."
- **Products**: *The part you can hold.*
  "Products are where everything finally touches someone. At Maple Leaf Foods that meant moving
  $14M+ in penalties out of email chains and into an app people actually wanted to open. I care
  about the last five percent, the part nobody asks for and everybody notices."

---

## Part 5. Design system

- **Typeface:** Fraunces only (Sam uses one family; so do we). Weights 400 and 500, italic for
  wall-label titles. `font-optical-sizing: auto` so the giant name gets high-contrast display cuts
  and body text gets text cuts. Defaults `SOFT 0`, `WONK 0` (clean, museum); compare SOFT 0/50
  and WONK 0/1 in the lab.
- **Scale (few sizes):** giant name ~20-22vw (leading ~0.82, tracking -0.04em); page titles
  ~clamp(48px, 7vw, 112px); body/corner 16-18px (leading 1.45-1.55); small (dates, credits)
  14px in muted ink.
- **Colour:** gallery wall `#F3F1EC` (tune to match the lit WebGL wall), ink `#121212`, muted
  `#76736C`. No accent colour in the chrome UI; colour comes from the identities and project
  media only.
- **Space:** `--gutter: clamp(32px, 8vw, 128px)` (Sam). Sections 160-240px apart on desktop.
- **Motion:** `--ease-out: cubic-bezier(.23,1,.32,1)`, `--ease-drawer: cubic-bezier(.32,.72,0,1)`.
  Transform/opacity only. Every motion has a reduced-motion fallback.
- **Shape:** **no rounded corners anywhere** (cards, pills, buttons, images, video). The floating
  progress element on case studies is a square-cornered bar, not a pill.
- **Wall label** component (museum tombstone label), used for projects and About objects:
  **Title** (italic), year / medium (e.g. "Mobile app concept") / role / team / one-line credit.
  Sentence case, small, set beside the object, never on top of it.
- **Taste skill:** use its process (copy deck first, `lint.mjs`, `inspect.mjs`, screenshot
  critique rounds). Its house rules are overridden where this vision requires it; pass `--allow`
  for: the wall shadow (shadow at rest), the cradle overlapping the giant name, thin rules in the
  /work catalogue list, and `[bracket]` corner links. Everything else in its rules applies (no
  gradients in UI, no glass blur panels, no emoji, no tracked tiny caps, no em dashes in copy).

---

## Part 6. Pages

### 6.1 Home `/`
1. **Hero (100dvh):** top-left corner: "I like getting things moving. [more]" (`[more]` opens a
   small dialog with a two-sentence intro and a link to /about). Top-right corner: "Product Designer
   @ Digital Extremes / Systems Design Engineering @ Waterloo" (two lines). The cradle hangs from
   the top. "Lucas Vu" giant along the bottom, behind the cradle. `[sound on]` bottom-right.
   Hovering/focusing a sphere shows its identity name as a small caption under it (meaning never
   relies on colour alone).
2. **Work:** four full-viewport sticky stacked exhibits (Shufflr, Ripple, Maple Leaf Foods,
   Warframe). Each: one dominant project visual (real media from Lucas's repo; video loops muted
   with posters), a wall label, and "View case study". Each next card slides up over the previous
   one (CSS `position: sticky`; slight darkening of the covered card; no scaling gimmicks). A
   minimal position indicator ("2 of 4" in small type) is optional; decide in review.
3. **"View all work"** link to `/work`.
4. **Close:** one large line in Lucas's voice (e.g. "Let's get something moving."), contact links
   in running text (Sam style), the name returning at full width.

### 6.2 Identity routes `/people` etc.
The hero in the selected state (Part 1.3, 4.7). Back arrow top-left. Proper titles/OG images.

### 6.3 All work `/work` (the catalogue)
Sam-style list: large title, two-line description, date in muted ink, thin rules between rows,
preview media appearing on hover (desktop) or inline (mobile). Includes featured projects plus
Asper, Frictionless, We should go to Japan, SolarScore, Parrot, Creators Collective, Google song
search rebuild (only what has enough real information; skip the rest).

### 6.4 Case study `/work/[slug]`
Template (Sam layout + Caleb rhythm + Rachel Chen headlines):
1. Slim top line: back arrow, LinkedIn, X, Instagram, Email.
2. Title (large Fraunces), one-sentence claim, wall-label block: Role / Team / Timeline / Scope /
   link (prototype, Devpost, live site).
3. Hero media full width (square corners).
4. Sections, each opening with a **one-sentence first-person claim headline**: Context ->
   Problem -> Research / insights -> Solution -> Key features / design decisions -> Impact ->
   Reflection / learnings. Reading column ~600-680px; media breaks wider.
5. Square-cornered floating progress bar at the bottom showing the current section.
6. **"Next exhibit"** full-width card to the next featured project (Caleb).
- Content: port faithfully from the old repo's content files (Shufflr, Ripple, Maple Leaf),
  tightening copy and rewriting headlines into Rachel-style claims. Keep all real stats and quotes
  with their sources (Shufflr research stats link to their sources).
- **Warframe / Digital Extremes:** NDA status unknown. Build the exhibit card and a case-study page
  that says the work is under wraps and invites a conversation ("Ask me about it" -> email). No
  invented content. Flag in REPORT.md.

### 6.5 About `/about` (the museum room)
- Artist statement (wall text) with a portrait from Lucas's old assets.
- **Chronology:** the experience timeline (2.5), museum-style (year, role, place).
- **Selected objects:** personal artefacts as exhibits, each with a wall label: cadets, soccer
  (13-1-2), chess club, Socratica / UW/UX / Blueprint, solo Japan trip, fishing (hummingbird
  video), the volunteer speech. Use Lucas's real photos from the old repo.
- **Reading room:** the essay "Why I'm Finally Ready to Call Myself a Designer" (from the old
  repo), set beautifully.

### 6.6 Shared
- 404 page in the same voice. Favicon (a tiny chrome sphere). Metadata, OG images per page,
  sitemap, robots. Analytics: none for now.

---

## Part 7. Responsive, accessibility, performance, fallbacks

- **Desktop:** full 3D cradle, hover reveals, click opens the story state.
- **Mobile:** first tap reveals/selects (caption shows), second tap opens the story. In the story
  state the sphere sits top-centre (smaller) and the text flows below it like a bottom sheet.
  Dragging a ball captures touch only on the ball (the canvas uses `touch-action: pan-y` except
  while a ball is grabbed) so the page still scrolls.
- **Keyboard:** each sphere is a real `<button>` (projected over the ball each frame, visually
  hidden but focus-visible ring drawn around the sphere). Tab order People -> Products. Focus =
  hover reveal. Enter/Space = open story. Escape = close. Arrow Left/Right on a focused sphere gives
  it a gentle push (keyboard users can play too).
- **Accessible names:** "People: where every problem starts. Open story." etc.
- **Reduced motion:** no anticipation dip, no curtain travel (crossfade instead), no idle
  identity animation (still frame), physics only responds to direct drags.
- **Performance budgets:** 60 fps on a mid-range laptop; hero JS (three + scene) lazy-loaded with
  `next/dynamic({ ssr: false })`; the static still (6.7) is the LCP image and stays until the
  canvas has rendered its first frame, then crossfades. Pause rendering when the hero is off-screen
  (IntersectionObserver) and when the sim sleeps. HDRI at 1k, textures compressed (KTX2 where
  sensible), images AVIF/WebP via `next/image`, videos H.264 MP4 + poster, lazy.
- **Fallbacks:** no WebGL (or WebGL context lost) -> high-quality **pre-rendered stills of our own
  scene** (rendered by a Playwright script from the real scene, one per identity revealed) with the
  same buttons and the same story state as plain HTML.

---

## Part 8. Git workflow (Lucas wants to see and recover every version)

- `main` always builds and works.
- **One branch per phase:** `phase/00-foundation`, `phase/01-physics`, ... (see Part 10). Small,
  focused commits in Conventional Commit style (`feat(physics): add bifilar unilateral strings`,
  `fix(strings): keep 1px minimum width`, `test(physics): momentum transfer`, `chore: ...`).
  Commit after every meaningful working step (tests green), not in giant batches.
- At the end of each phase: run all gates (Part 9.3), merge into `main` with `--no-ff`, and create
  an **annotated tag** (`v0.1.0-physics`, etc.) with a one-paragraph message of what changed.
- **Experiments:** alternative approaches worth keeping get their own branch `exp/<topic>` (e.g.
  `exp/strings-tube-vs-line`, `exp/shadows-pcss-vs-vsm`) plus a tag `exp-<topic>-<variant>`.
  Never delete them. The `/lab` route also keeps every variant switchable in one build.
- **Never** force-push, rewrite history, or delete branches/tags.
- Remote: `origin = https://github.com/VuMadeIt/insaneportfolio.git` (currently empty). Push
  `main`, phase branches and tags after each phase if `git push` works non-interactively; if it
  asks for credentials, skip pushing and note it in REPORT.md.
- Commits use the repo's configured identity (Lucas Vu).
- Vercel (account lucasvu26@gmail.com) is set up by Lucas in the morning; every branch then gets a
  preview URL for side-by-side comparison. Do not attempt to log in.

---

## Part 9. Execution protocol for the autonomous run

### 9.1 Rules of engagement
- Do not wait for Lucas. When something is ambiguous, choose the option that best serves the
  vision (Part 1), write it in `DECISIONS.md` (date, decision, alternatives, why), and continue.
- Priority order when trading off: **1) physics correctness and feel, 2) physical realism of the
  object (materials, strings, light, shadow, sound), 3) interaction choreography, 4) identity
  shaders, 5) site pages, 6) polish.** If the run is cut short, phases must be completed in order so
  the best parts exist.
- Quality over speed. Iterate visual work with screenshots until it is genuinely convincing; do not
  stop at "works".
- Keep code clean, as if a senior developer wrote it: small modules, clear names, typed APIs, no
  dead code, no commented-out code, comments only where intent is non-obvious.
- Never introduce secrets. Never modify security settings. No destructive operations outside files
  you created in this run.
- After code exists, use Graphify (`graphify update .`) to keep the knowledge graph current, and
  `graphify query` for codebase questions in later phases.

### 9.2 Logs the agent maintains
- `DECISIONS.md`: every non-trivial decision and every realism review round.
- `CREDITS.md`: every external asset (HDRI, textures, sounds, references) with source and licence.
- `REPORT.md` (final): what was built per phase with tags, screenshots paths, what still falls
  short, open questions for Lucas, sample/draft content to confirm, and morning to-dos.

### 9.3 Gates (run before every phase merge)
`npm run typecheck`, `npm run lint`, `npm run test` (Vitest, incl. all physics acceptance tests),
`npm run build`, `npm run e2e` (Playwright: navigation, keyboard flow, reduced motion, no-WebGL
fallback, wall colour match), screenshots at 1440 / 768 / 390 saved to
`.artifacts/screens/<tag>/` (git-ignored) and reviewed by actually opening them. From Phase 06 on,
also run the Taste skill `lint.mjs` and `inspect.mjs` (with the allow-list in Part 5) on the
production build (`next build && next start`).

---

## Part 10. Phases

Each phase = branch -> commits -> gates -> merge `--no-ff` -> tag -> (push) -> short entry in
REPORT.md.

**Phase 00 - Foundation** (`v0.0.0-foundation`)
- Move references out of `assets/`: identity images -> `reference/identities/`, the atom video
  -> `reference/identities/atom-motion.mp4`, `example-reference.png` and `hover-reference.png`
  -> `reference/layout/`. Remove the empty `assets/` folder.
- Scaffold Next.js (TypeScript strict, App Router, Tailwind v4, ESLint, Prettier), Vitest,
  Playwright (msedge channel), scripts in package.json (`dev`, `build`, `start`, `typecheck`,
  `lint`, `test`, `e2e`). `.gitignore` incl. `.next`, `node_modules`, `.artifacts`, `.taste-skill`,
  `graphify-out/cache`.
- Tokens, Fraunces, the static hero composition in HTML/CSS (corner lines, giant name, wall colour)
  with a placeholder still where the cradle will go. Folder structure from 3.2. AGENTS.md updated
  with real commands.

**Phase 01 - Physics core** (`v0.1.0-physics`) *largest share of effort*
- `src/physics` per 4.1, the visual rope sim per 4.2, collision events, drag and anchor command API.
- All ten acceptance tests green. `/lab/physics` debugger.
- Audio analysis of the recordings (4.4) and calibration of restitution/damping/length. Log the
  calibrated numbers and the before/after plots in DECISIONS.md.

**Phase 02 - The real object** (`v0.2.0-object`) *second largest share of effort*
- Stage, camera, renderer, wall, museum light, soft wall shadows, HDRI candidates, chrome material
  with imperfections, dynamic reflections, screw eyes, clear nylon strings, porcelain and dark
  metal for comparison. `/lab` with material + HDRI + tone-mapping + shadow-technique switches.
- At least three realism review rounds against `reference/realism/` photos (4.3).
- Pre-rendered still for the LCP/fallback.

**Phase 03 - Interaction and sound** (`v0.3.0-interaction`)
- Pointer drag with the hand constraint, flicks, hover state, accessible projected buttons,
  keyboard push, sleep/wake, frameloop control, WebAudio clacks with chain grouping and decay.

**Phase 04 - Identities** (`v0.4.0-identities`)
- Palette extraction. One identity fully finished first (People), then Ideas, Experiments,
  Products. All animations (blink, flow, orbits, sway + clouds). Three reveal variants. Side-by-side
  comparison rounds in `/lab` against the source images and the atom video frames.

**Phase 05 - Story state** (`v0.5.0-story`)
- Click choreography (4.7), identity routes, text column, back arrow, Escape, empty-wall click,
  interruption safety, direct-load state, mobile two-tap behaviour, reduced-motion version.

**Phase 06 - Site shell and home** (`v0.6.0-home`)
- Corner `[more]` dialog, sticky stacked work exhibits with real media, wall labels, close/footer,
  inner-page slim nav, 404, metadata.

**Phase 07 - Case studies** (`v0.7.0-case-studies`)
- Port content and media from `VuMadeIt/updated-portfolioi` (clone into a temp folder outside the
  project; copy only what's used; optimise media). Template from 6.4. Shufflr, Ripple, Maple Leaf,
  Warframe (under-wraps version). Headline-only skim test: reading only headlines tells the story.

**Phase 08 - About and All work** (`v0.8.0-about`)
- Museum room About page and the /work catalogue (6.3, 6.5).

**Phase 09 - Polish** (`v0.9.0-polish`)
- Responsive passes at 1440/1024/768/390, accessibility audit (keyboard, screen-reader names,
  contrast), performance (bundle analysis, LCP, frame time), WebGL-off fallback, reduced motion,
  Taste skill inspect + critique rounds, final copy pass.

**Release candidate** (`v1.0.0-rc.1`) and REPORT.md.

---

## Part 11. Open questions for Lucas (do not block on these; defaults in brackets)
1. Warframe / Digital Extremes: under NDA? [assume yes; under-wraps exhibit + email CTA]
2. Atom reference video [received; see 4.5]
3. Higher-resolution identity images (2048px+) [current 1024px are enough as references]
4. Final identity copy (4.8) [drafts ship marked DRAFT]
5. Hack Canada vs Hackathons North America naming [use LinkedIn: Hackathons North America]
6. Domain name [none yet; Vercel URL]
7. Which reveal variant and which material win [chrome + best-reviewed variant; all kept in /lab]

---

## Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict

Answers from Lucas's Q&A on 2026-11-03. Everything not mentioned here stays as written above.
Physics (Part 4.1) is untouched; slow motion below is a playback-rate change only.

### 12.1 Typeface and style (from the old site, vumadeit.github.io/lucasvu, repo `VuMadeIt/lucasvu`)
- **Fraunces is removed everywhere.** Two families, as on the old site:
  - **General Sans** (variable 200-700): headings, page titles, the giant name. Old values: h1
    500 with -0.03em tracking; section titles 500, -0.03em; h3 600, -0.03em, leading 1.25.
    The hero name is weight ~350, uppercase **LUCAS VU**, tracking tight, leading 1.
  - **Cabinet Grotesk** (variable 100-900): body, nav, corner lines, labels. Body 400 at
    ~17.6-20.8px, leading 1.5; subtitles 300.
  - Self-host with `next/font/local`. Prefer woff2 from Fontshare; the old repo has the TTFs at
    `src/assets/fonts/{GeneralSans,CabinetGrotesk}-Variable.ttf`. Both are under the ITF Free Font
    License (free for commercial use); verify on fontshare.com and credit in `CREDITS.md`.
- **Colour:** ink and muted grey stay as in Part 5. The old site's olive/brown text colours
  (`#8C8C73`, `#AEAE9D`, `#D1D1C7`) are **not** brought back for text or titles.
- **Metallic grey accent (replaces the old gold/brown), for microanimations only:** link and nav
  underlines, the `say hi` underline, the hero scroll line, the case-study progress fill. Never
  used for titles or body text. It should read like the chrome balls: a narrow grey gradient
  sampled from a real screenshot of the rendered chrome (dark edge, mid grey, light highlight),
  optionally with a slow highlight sweep on hover. Define it once as `--metal` in tokens. This is
  a deliberate exception to the "no gradients in UI" rule (log in DECISIONS.md).
- **Rounded corners are now allowed across the whole site** (cards, buttons, media, the nav pill,
  the progress bar). Pick one radius scale (e.g. 8 / 16 / 24px) that matches the Taste skill and
  Lucas's references in `reference/inspo/`; record it in tokens and DECISIONS.md.
- Copy style follows the old site and the mock: **lowercase** nav and corner lines.

### 12.2 Hero (follow `reference/inspo/lucas-vu-hero-mock.png`)
- Top-left, three lowercase lines: `systems design eng @ uwaterloo` /
  `product designer @ warframe` (current role, not "prev") /
  `current product design lead of hack canada`.
- Right edge: the vertical tagline **"the person who gets things *moving*"** ("moving" in italic),
  rotated 90 degrees, with the old site's **scroll line** under it: a short metallic line inside a
  clipped box that sweeps in on a loop (old code: `gsap.timeline({repeat:-1, repeatDelay:0.5})
  .from(line, {x:-40, duration:1.5, ease:"power4.inOut"})`). This replaces the top-left
  "I like getting things moving. [more]" line; the `[more]` dialog goes.
- Giant **LUCAS VU** along the bottom (General Sans, uppercase), cradle hanging in front.
- **Letter stagger on load** (old Hero.jsx): once fonts are loaded, each letter rises from
  `y:100, opacity:0` over 1.5s, `power4.out`, stagger 0.1. Must not fight the LCP still or the
  story-state slide-down. Reduced motion: no stagger.
- `[sound on]` stays bottom-right.

### 12.3 Nav (old `NavBar.jsx`, adapted)
- **Home hero: links only, no logo**, top-right: `about`, `work`, and a rounded `say hi` pill
  (mailto). The status lines keep the top-left; the vertical tagline sits below the nav.
- **Inner pages:** the full old nav, with the `logo.png` ("i am vu", old repo
  `src/assets/icons/Navbar/logo.png`) on the left and the same links on the right. Identity routes
  (`/people` etc.) keep the back arrow for the story state.
- Fixed, slides down from `y:-100%` on load (`power4.inOut`, ~1.2s, delay 0.5s; the old 3s is too
  slow). Underline on hover grows from 0 to full width (300ms, ease-in-out), in `--metal`.
- No colour flip on dark sections.

### 12.4 Site-wide motion
- **Text rise on scroll** (old About.jsx): headings and paragraphs start at `y:40, opacity:0`
  and rise in when their section reaches ~`top 400px` (heading first, body 0.2s later, 1.25s,
  `power4.out`, plays once). GSAP ScrollTrigger (GSAP is installed).
- **Lenis smooth scroll** on the whole site (package `lenis`, pinned, a release at least 7 days
  old), driven from GSAP's ticker so ScrollTrigger stays in sync. Off for reduced motion. It must
  not break the sticky work stack, the canvas pointer capture, or `touch-action: pan-y` on mobile.

### 12.5 Work section: Folio Stack, cleaner
- Remove the "Selected work / Four exhibits: ..." intro; the section is the projects only.
- Keep the full-screen stacked cards, rebuilt after **Folio Stack** (framer.com/marketplace/
  components/folio-stack, demo `drab-flexibility-030161.framer.app/folio-stack`): full-bleed
  rounded cards that pin with a small top offset; as the next card slides over, the previous one
  **steps back, shrinks a little (~0.94-0.96) and dims**, and a thin **peek** of each earlier card's
  top edge stays visible so the stack reads as a pile. On each card: a big title bottom-left over
  the media (light shade on the media for legibility), a one-line caption under it, an index
  `01 / 04` top-left and a tag top-right (e.g. "mobile app concept"). Pure CSS sticky plus one
  scroll listener (or ScrollTrigger); reduced motion keeps the stack without scaling.
- Order: Shufflr, Ripple, Maple Leaf Foods, Warframe.
- **Warframe = card only. No case-study page.** Cover still (`apple-still.jpg`) that plays the
  **glitch on hover** (`apple-hover.gif` from `VuMadeIt/updated-portfolioi/public/images/`;
  6.5 MB, so convert it to a looping muted webm/mp4 with ffmpeg and play it on hover, falling back
  to the still). Tag/caption "coming soon"; the card isn't a link. Remove `/work/warframe` and its
  content file; leave it out of "Next" cards and the sitemap; in `/work` it's listed as coming soon
  without a link.

### 12.6 Case studies: Caleb Wu's RevisionDojo (calebwu.ca/RevisionDojo)
- **Shufflr and Ripple** follow Caleb's rhythm exactly: year, title, one-paragraph summary,
  Team block, hero images, then **The problem -> Insight #1 -> Insight #2 -> Solution ->
  Solution -> Design decision -> Design decision -> Research (context, pain points, consolidating
  data) -> Solution ideation (ideas with pros/cons, iterations, prototype, feedback) -> Final
  solution -> Key learnings -> Next project card**. Each block: small label, one-sentence headline,
  two lines of text, then large media with a small caption under it. Headlines keep the
  Rachel Chen skim test (headlines alone tell the story).
- **Media density like Caleb's:** a visual for almost every block. Use what already exists first
  (`public/media/{shufflr,ripple}`, plus anything still unused in `VuMadeIt/updated-portfolioi`
  `public/{images,videos}/{shufflr,ripple}`), then **coded visuals**: animated stat counters,
  diagrams that draw in, scroll-scrubbed video, before/after sliders, pros/cons cards. Don't record
  new media.
- **Study Caleb's microanimations first:** film the page in a real browser (as `scripts/story.mjs`
  does), list every microanimation in DECISIONS.md (reveals, hover states, sticky media, counters,
  the Next card), then rebuild the ones that suit this site.
- **Maple Leaf Foods follows the updated portfolio's format**
  (`src/components/project/maple-leaf/MapleLeafCaseStudy.tsx` + `mapleLeafContent.ts`): overview,
  then the three app blocks (Maple Leaf Market, Project Tracking App, Service Penalty App), each
  with its image and text, revealed on scroll.
- Accuracy rule (2.5) still applies: copy comes from the old content files; nothing invented.

### 12.7 Slow motion on hover (experimental, lab first)
- **What:** hovering a sphere while the cradle is moving eases the whole simulation into
  **0.1x speed** so it can be clicked; leaving the sphere eases back to 1x. It should feel like
  real film slow motion: inertia, arcs and collisions stay the same, just slower.
- **How (physics stays pure):** a `timeScale` (0.1..1) multiplies the real elapsed time fed to
  the fixed-step accumulator. It never touches dt, constants, mass or the solver, so trajectories
  in sim time are identical. Ease `timeScale` over ~300ms in and ~400ms out. The rope sim, the
  identity shader clocks and the clack scheduling all use the same scaled clock. Clacks pitch down
  with the slowdown (playbackRate floored around 0.4-0.5 so they stay recognisable). A click during
  slow motion restores 1x before the choreography starts.
- **Trigger:** only when the sim is awake and the hovered ball (or the cradle) has meaningful
  speed; hovering a still cradle does nothing new. Desktop hover only (no touch).
- **Sound:** a cinematic **whoosh down** on entry and a reversed **whoosh up** on exit, from a
  CC0 Freesound sample (licence checked, credited in CREDITS.md), sliced and loudness-matched
  with the existing audio pipeline, then played through the same WebAudio master and sound toggle.
- **Behind a flag:** on in `/lab` and with `?slowmo=1`; off in production until Lucas approves it.
- **Test:** a Vitest case showing that stepping with a varying timeScale gives the same state hash
  after N sim steps as normal stepping, and that physics never imports the flag.
- Reduced motion: disabled.

### 12.8 Phases for revision 2
Same protocol as Part 9 (branch, small commits, gates, `--no-ff` merge, annotated tag, REPORT).
Gates still include the Taste `inspect.mjs`; update its allow-list for the metal gradient and
rounded corners and log why.
- **Phase 10 - Slow motion lab** (`v1.1.0-slowmo`): 12.7.
- **Phase 11 - Type, nav and motion** (`v1.2.0-type-nav`): 12.1-12.4, the hero rework, AGENTS.md
  conventions updated.
- **Phase 12 - Work stack** (`v1.3.0-work-stack`): 12.5, including the Warframe glitch card and
  removing the Warframe page.
- **Phase 13 - Case studies v2** (`v1.4.0-case-studies`): 12.6.
- **Release candidate 2** (`v1.5.0-rc.2`): full sweep (`scripts/sweep.mjs`), screenshots,
  REPORT.md updated.

### 12.9 Revision 3 (Lucas, 2026-11-03). Overrides 12.2, 12.3, 12.5 and 6.1 where they conflict
- **Material:** dark metal ("black porcelain") balls everywhere; slow motion on in production;
  whoosh about 33% quieter; no sound toggle (sound always on).
- **Home:** the hero is only the four balls and LUCAS VU (no nav, no status lines, no tagline).
  Scrolling down shows the top four projects as catalogue rows (Ripple, Shufflr, We should go to
  Japan, Maple Leaf Foods) with accolades and the project video on hover, then "View more work"
  to `/work`. The Folio Stack cards are removed.
- **Dark half:** as it arrives, GSAP scrubs the page from the wall colour to `#0e0e0c`; the line
  "Let's get things moving." lights up word by word; then an about teaser (portrait, "Who's Vu?",
  the statement, "More about me" to `/about`), a strip of four photos that open their object on
  `/about#<id>`, and the contact close.
- **/work:** every project, the top three first, then the rest newest first. Every row is a link
  (case study, Devpost, live site, Framer case study, or an email for Warframe) and every row has a
  video.
- **/about:** the chronology is a pinned horizontal-scroll timeline, oldest first, with each
  company's logo; native sideways scroll on phones and under reduced motion.
- **Inner pages:** no nav bar and no "i am vu" logo, only a small "← Back to Site" link.
- **404:** the live hero with "404" in place of the name (no return link).

### 12.10 USE NOW refs (Lucas, 2026-11-03). Apply immediately; overrides 12.9 dark/contact copy and drag UI
Source files: `reference/inspo/USE-NOW-framer-dark-home.png`,
`reference/inspo/USE-NOW-drop-me-drag-hint.png` (see that folder's `SOURCES.md`).
- **Dark home / contact close:** follow the Framer screenshot. Black ground, cream lowercase type.
  Top-left stack: `email: lucasvu.work@gmail.com` / `based in: toronto ontario` /
  `available for: fall 2026 coops`. Top-right: two muted columns `pages` (home, about, work) and
  `socials` (instagram, medium, linkedin). Giant line **"i am lucas vu."** as the dark-half
  statement (can replace or sit with "Let's get things moving." — prefer this hierarchy).
  Bottom-left tagline: `to excel, all i need is wifi + good vibes.` Do **not** ship the
  "Made in Framer" badge.
- **Cradle drag hint:** the purple **"drop me"** chip (sharp top-left corner, other corners
  rounded, soft shadow). Show on an idle sphere as a first-visit drag affordance; dismiss after
  first drag or click. One vivid accent is allowed for this chip only.

---

## Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict

Lucas's verdict on Phase 14: rushed, too word-heavy, the Taste skill not really used, the
case-study graphics poor ("the lines aren't even connected"), the timeline not researched. Quality
over speed; take as long as needed. Answers from the Q&A are recorded inline.

### 13.1 Site-wide
- **Light mode only.** No scroll-driven colour change to black anywhere.
- **Underlines:** no metal gradient. A light grey underline (`--rule`-ish, ~#c9c6bf) that appears
  **only on hover/focus** for nav links and standalone links. Links inside running text keep a
  faint grey underline at rest (WCAG 1.4.1: links in text must not rely on colour alone) and darken
  on hover. `--metal` is retired from the UI.
- **Nav bar on every page, the same everywhere:** left `lucas vu` (home link, text wordmark, no
  "i am vu" image); right `work`, `about`, `say hi` (mailto), and a **sound icon button** that mutes
  and unmutes all site audio (persisted in localStorage, `aria-pressed`, label "Sound on/off").
  Replaces "Back to Site". Identity routes keep the story back arrow.
- **Custom cursor** (desktop, fine pointer only; native cursor hidden there): a small dark grey ball
  (~12px, the old GitHub site's cursor, `vumadeit.github.io/lucasvu` `Cursor.jsx`, coloured dark
  grey and shaded like the hero's dark metal balls). Over links/buttons it swells and fades (old
  site: nav hover scale 5, opacity 0). Over work rows it hides: the floating project video is the
  cursor. In the home footer it grows to ~96px with **"drop me" inside the ball** (Lucas's Framer
  "click to open" effect); near anything clickable it shrinks back and the label disappears.
  Touch and reduced motion: native behaviour, no custom cursor travel.
- **Taste skill for real:** run its process (argument, copy deck, inspect at 1440/768/390, look at
  every screenshot, critique in `references/critique.md` format, fix top three, re-run).

### 13.2 Slow motion (amends 12.7)
- Problem: a swinging ball leaves the pointer within a frame or two, so slow motion ended at once.
- Once the pointer touches a moving ball, slow motion **holds for at least 1.5 s of real time**
  after the last contact (about double what it was), eases out over ~0.8 s, and re-arms on every
  new contact. Clicking still restores 1x first. Physics untouched (time scale only).

### 13.3 Work rows (home and /work)
- Per row: **title**, **accolades** (metal-ball bullets), the **description**, and the **month**
  (`Mar` style month name; the year only when it is not the current year, e.g. `Jun 2025`). No
  event/medium/"Case study" meta line, no year column.
- **The video follows the cursor** (fixed-position, lerped, `pointer-events: none`), appears on
  pointer hover only, never on focus or after a click (that was the "stuck video" bug: the old
  preview showed on `:focus-within`, so after clicking an external link it stayed). Keyboard focus
  shows a static preview beside the row. Touch: inline video in the row.
- **Home shows Ripple and Shufflr only**, then "View more work". /work keeps everything (top three
  first, then newest first).

### 13.4 Home
- Hero (balls + name), nav on top, Ripple + Shufflr rows, then the about teaser **in light mode,
  no photos**: the line "Let's get things moving." and a short who-I-am paragraph with "More about
  me", then the physics footer.
- **Physics footer (home only):** primary layout ref `reference/inspo/footer-reference.png`
  (three columns: name + local time left; Work / About centre; “Let’s work together!” + email +
  social icons right). Keep contact hierarchy from `USE-NOW-framer-dark-home.png` where it still
  helps (`email` / `based in` / `available for`, pages + socials, giant `i am lucas vu.`,
  wifi tagline) in the site's light colours. Every text box is solid. It starts with **no balls**.
  Clicking empty space drops a dark-metal ball at the cursor; balls fall, bounce off the footer's
  walls and floor and off every word box, roll off edges, and collide with each other. Clicking a
  link never drops a ball. Soft clacks on impacts through the shared audio master (muted by the nav
  toggle). 2D solver is pure TypeScript (`src/footer-physics/`), tested, independent of the cradle.
  Inner pages get the same footer layout without physics.

### 13.5 About timeline (replaces 12.9's horizontal list)
- Research: Awwwards "Gantt chart with scroll" (Wallnut: staircase bars that overlap as you
  scroll, a playhead with a dot), "Work timeline: a scrolling gantt of ten years" (Bryan Oh: year
  axis, role bars with logos, an orange playhead), Blackbook "Career graph" (gantt lanes, a detail
  panel per role), Diego Sevilla (each experience gets its own scene with photos).
- Design: a pinned stage. **The time axis runs across the bottom centre** (months, Sep 2025 to
  now); each role is a bar above it in its own lane, so **overlaps are visible** (Jan-Apr 2026 has
  three at once). A small dark-metal ball is the playhead and rolls along the axis as you scroll.
  The role(s) under the playhead get **their own section above the axis**: logo, role, company,
  dates and one or two lines; concurrent roles sit side by side. Phones: the same gantt, scrubbed
  natively; reduced motion: all sections listed.
- Dates (LinkedIn, Lucas): UWaterloo Systems Design Engineering Sep 2025-now; The Local Charity
  May-Aug 2025; Waterloo Engineering Society Jan-Apr 2026; Maple Leaf Foods Jan-Apr 2026;
  Creators Collective Jan-Jun 2026; Hackathons North America May 2026-now; Parrot (YC F25)
  Jul-Aug 2026; Digital Extremes Sep 2026-now.

### 13.6 Case studies: Ripple and Shufflr rewritten as deep case studies
Facts from Lucas (Q&A): on both he did research, concept, UI design and the prototype/pitch
(Shufflr: interviews and research, product strategy, UI, the coded prototype). Shufflr: more than
20 people interviewed; Western PDS was 48 hours; 1st place and Most Practical. Ripple: desk
research, interviews/chats, competitor review; BLOOM was 8 hours; 3rd place; team Samuel Huang,
Jonathan Zhou, Grace Yu, Lucas. Outside research may be cited (always as context with a source,
never as the team's own findings). Nothing else may be invented.

**How a good case study is written (Rachel Chen + Caleb Wu; use this every time):**
1. Header: title, one-sentence claim, metadata (Role, Team, Timeline, Scope), the outcome.
2. Overview: what it is in one sentence, then the constraint (8 hours / 48 hours) and "My role"
   as its own block in the first person.
3. Every section opens with a **claim headline in the first person**; reading only the headlines
   tells the whole story (the skim test).
4. Problem as one bold sentence, then the opportunity as a "How might we".
5. Research with real numbers and their sources, then the insights (each one sentence + proof).
6. **Explorations that lost, and why** (Rachel's "This just wasn't possible", Caleb's pros/cons):
   at least two rejected directions with their trade-offs.
7. The solution, then design decisions, each with the reason and the trade-off accepted.
8. Outcome (placement, what judges reacted to only if known), then a reflection: what I'd change
   now, with hindsight from newer research.
9. Short paragraphs (2-3 sentences), a visual for nearly every block, captions under visuals.

**Graphics language (Caleb's RevisionDojo, studied at calebwu.ca/RevisionDojo):** each visual sits
on a light tone-step panel (rounded, no border, no shadow), is drawn precisely in HTML/SVG, uses
the ink plus **one accent from the product's own UI** (Ripple water blue, Shufflr its own pink),
and shows one idea: a branching tree whose connectors actually join (SVG paths computed from the
boxes), an annotated anatomy with numbered callouts, two circles for relevant vs irrelevant, a
pair of bars, floating chips for chaos, option cards with check/cross lists, a callout card for the
verdict. Every connector is computed from element positions so it always meets its boxes.

### 13.7 Verified outside sources (for the case studies)
- Li, Yang, Islam, Ren, "Making AI Less Thirsty" (arXiv 2304.03271): ~500 mL per 10-50 GPT-3
  responses; 4.2-6.6 billion m3 water withdrawal for AI by 2027.
- Google, "Measuring the environmental impact of delivering AI at Google scale" (arXiv
  2508.15734, Aug 2025): median Gemini Apps text prompt 0.24 Wh, 0.26 mL water, 0.03 gCO2e; 33x
  energy reduction in a year. Critics (The Verge) note indirect water from electricity is omitted.
- Sam Altman, "The Gentle Singularity" (10 June 2025): average ChatGPT query ~0.34 Wh and
  ~0.000085 gallons (~0.32 mL) of water; not peer reviewed.
- Axios / The Verge (July 2025): ChatGPT receives over 2.5 billion prompts a day.
- EPRI (2024): a ChatGPT request ~2.9 Wh vs ~0.3 Wh for a Google search (the old 10x claim).
- Gill et al., MeanCache (arXiv 2403.02694): ~31% of a user's ChatGPT queries are semantically
  similar to their earlier ones; ~33% of search queries are resubmitted (Markatos 2001).
- Li et al., SCALM (arXiv 2406.00025): in public chat logs only ~7.5% (LMSYS) / ~4.5% (MOSS) of
  questions could be answered from an earlier similar one; writing/brainstorming ~13%.
- Hall, "How many hours does it take to make a friend?" (JSPR 2019): ~50 h casual friend, ~90 h
  friend, 200+ h close friend (KU summary).
- US Surgeon General, "Our Epidemic of Loneliness and Isolation" (2023, ATUS data): 15-24 year
  olds spent ~70% less time with friends in person in 2020 than in 2003 (~150 to ~40 min/day).
- BJ Fogg, Behavior Model (B=MAP): behaviour happens when motivation, ability and a prompt meet;
  "activation energy" is the ability side.
- Existing: American Friendship Project (56% of college students find it hard to make friends),
  Statistics Canada (17% of 15-24 often/always lonely).

### 13.8 How 13 relates to 12.10
12.10's footer copy and hierarchy stand (contact block, pages + socials incl. Medium
`medium.com/@beinglucasvu`, giant "i am lucas vu.", the wifi tagline), but in the **light** palette
and as the home physics footer. "available for" follows LinkedIn: summer 2027 co-ops. The "drop me"
label lives in the footer cursor (13.1, 13.4), not as a chip on the cradle.

### 13.9 Phases for revision 4 (branch `phase/15-revision-4`)
1. Basics: light only, underlines, nav with sound, cursor, slow-motion hold.
2. Work rows and home.
3. Physics footer.
4. About timeline.
5. Case studies (research, copy deck, graphics), Ripple then Shufflr.
6. Gates (Taste lint + inspect + critique rounds, Vitest, Playwright, sweep), docs, merge and tag
   `v1.6.0-revision-4` only after Lucas has looked.

---

## Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict

Branch `phase/16-revision-5`. Answers from the Q&A are recorded inline.

### 14.1 Voice
- Everything on the site reads as if Lucas wrote it himself. No third person, no notes that
  explain the writing ("Added reading for this case study", "I read the finding through..."),
  no claims that outside research is his own finding. Outside numbers keep their source, plainly.

### 14.2 Type
- The heaviest weight anywhere is the hero name's (General Sans 350). Headings, project titles,
  the nav and the footer never go above it.

### 14.3 Nav (replaces 13.1's nav)
- Slim, sticky, page gutter on both sides. Left: a small static render of the four dark metal
  balls (home link, not interactive). Right: `about`, `work`, `contact` (scrolls to the footer)
  and the sound button.
- Hides while scrolling down, slides back in on any scroll up (~300 ms), always shown at the top
  of the page (NN/g "partially persistent header"; Lucas chose it over always visible).

### 14.4 Footer (replaces 13.4's physics footer and 12.10's layout)
- `reference/inspo/footer-reference.png`: a hairline rule, then three columns: `lucas vu` with
  the live Toronto time; Work / About; "Let's work together!", the email and LinkedIn /
  Instagram / GitHub icons. Same gutter as the rest of the site. Same on every page.
- The ball pit, its physics (`src/footer-physics`), its cursor state and "drop me" are removed.

### 14.5 Home
- Work rows: no accolade text, less height. Dates are month and year everywhere.
- "Let's get things moving." rises in from below; the "o" in "moving" is a small dark metal ball
  that drops from above into its place when the line scrolls in, with a clack. It shines on
  hover. It cannot be dragged.
- The about teaser: paragraph one in the left column, paragraph two in the right column with
  "More about me" under it.

### 14.6 Work
- No intro sentence. Two groups: hackathon wins, then selected projects.
- Accolades leave their own row. A realistic prize object (gold medal, bronze medal, a stack of
  cash, AirPods), rendered from our own 3D scene with a transparent background and all the same
  size, sits left of the project name, and the prize is written into the start of the
  description ("Winner of Hack the 6ix, $1,400 USD."). Home rows show the same object.
- New rows: Sweaterify (`VuMadeIt/sweatertexture`, sweaterify.vercel.app) and Liam Vu's urban
  planning portfolio (`VuMadeIt/urbanplanningportfolio`, liamvu.vercel.app).
- Reboot becomes a case study at `/work/reboot`, adapted from lucasvu.framer.website/projects/
  reboot into the house case-study style (13.6).

### 14.7 Case studies and About
- No date above case-study titles (the timeline is in the metadata).
- The About timeline drops the "At the same time" lists; the gantt already shows overlaps.

---

## Part 15. Revision 6 (Lucas, 2026-11-05). Overrides Parts 1-14 where they conflict

Branch `phase/16-revision-5` (continues it). Answers from the Q&A are recorded inline.

### 15.1 "Let's get things moving." (replaces 14.5's ball in the "o")
- Reverse-engineered from Kern Society's hero (shockingmike.github.io/kern-society, recording
  `reference/inspo/lets-get-moving-20261105-1530-27.5372907.mp4`): the line always fills the
  column; letters near the pointer swell to black and extended, the rest condense to hairlines,
  and one shared offset is solved every frame so the advances add up exactly. Their model, ported:
  a measured wght x wdth advance grid per glyph, a two-segment axis path through rest, Gaussian
  emphasis with a vertical falloff, a pulse through the line on entry, a ruler whose marker
  (here a small ball) follows the scroll on phones and drives the letters there.
- Typeface: **Roboto Flex** (OFL; Lucas chose it for its real width axis), this line only. It may
  go up to wght 1000: this line is the one exception to 14.2's weight ceiling.
- Driven from GSAP's ticker, stopped once settled. Reduced motion: the line rests.

### 15.2 Cursor (amends 13.1)
- The native cursor is always visible; the small dark ball follows it with a soft lag, everywhere,
  keeping its link / grab / hide states.

### 15.3 Nav and footer (amend 14.3, 14.4)
- One ball (not four) as the home link. `contact` opens an email instead of scrolling.
- Nav and footer set like the rest of the site: General Sans 350, body size, ink, lowercase.
- Bug: after clicking a nav link the bar stayed on screen while scrolling down (the clicked link
  kept focus across the client navigation, and `:focus-within` held the bar). Only
  `:focus-visible` keeps it out now.

### 15.4 Warm grade
- From `reference/inspo/hero-chrome-lucas-vu-grade.png` (temperature up, saturation down): wall
  `#f7f0df`, ink `#14120d`, warm muted/rule/panel tokens, and `sepia(0.12) saturate(0.94)` on
  images, video and the cradle canvas.

### 15.5 Home
- Work rows: Ripple, Shufflr, Reboot; no prize objects on home (they stay on /work).

### 15.6 Arrival
- Every arrival on the home page (first visit, reload, coming back from another page) drops the
  balls in from above, the same lowering as closing a story. The pre-rendered still is now only the
  no-WebGL / no-JavaScript fallback.

### 15.7 Nav lab (`/lab/nav`)
- The havenconstructions.com.au menu, in the site's palette, over the home page: a quiet pill that
  darkens on hover and opens into staggered rows with hairlines, a ball bullet for the current
  page, and the email + LinkedIn underneath. For Lucas to compare; the current nav stays live.

### 15.8 Type lab (`/lab/type`)
- The home page with a switcher: General Sans + Cabinet Grotesk (now), Fraunces (revision 1),
  General Sans only, Cabinet Grotesk only, Roboto Flex. `?font=<key>` for screenshots.

### 15.9 About
- The fishing object and the essay are removed. "Socratica's Create-a-thon / Socratica, UW/UX,
  Blueprint" becomes "To Socratica Sundays! / Socratica".

### 15.10 Follow-up (Lucas, 2026-11-05 evening)
- Nothing showed for Lucas (no drop, no hover videos, an invisible moving line, a dead menu): the
  preview proxy he used could not carry the dev server's hot-reload socket, so the page never
  hydrated. Previews are now served from production builds (site on :3100; labs on :3400 from a
  `LAB=1` build in `.artifacts/next-lab`).
- Every crucial animation must show in any circumstance. Measured and fixed: a cold first visit
  froze the page for 7-10 s compiling shaders (now compiled off the main thread, with plain balls
  first and the identities swapped in when ready: the drop starts at about 2 s); a smooth scroll
  still gliding across a page change buried the hero on Back; the still and the moving line have
  CSS timers so they show even if scripts never run.
- The live nav is the four balls again. `/lab/nav` compares three editions: four balls, one ball
  close to the edges, and the Haven menu, which now holds everything (home, work, about, contact,
  email, LinkedIn and a "sound on / sound off" switch) with no ball or links outside it.
- `scripts/user-test.mjs` checks every animation on desktop, through the preview proxy, on a
  throttled CPU and network, on a tablet and a phone, and the labs.
- Next (not done yet, Lucas will give feedback first): smaller home project rows and "View more",
  no ruler under the moving line, and the moving line in the site's own face, set denser.

### 15.11 Revision 6, part 3 (Lucas, 2026-11-05 night). Overrides 15.1-15.10 where they conflict
- **Nav:** from 768 px the bar with one ball at the left edge (padding clamp(20px, 2.5vw, 36px)
  both sides); below 768 px the Haven menu (15.7) is the whole nav. `/lab/nav` is retired (choice
  made). Both step aside while a story is open.
- **No back arrow** in the story state: a click anywhere (or Escape, or the browser's Back) closes it.
- **Moving line:** text only (no ruler, no marker). Set in General Sans: its weight axis (200-700,
  resting at the headings' 350) plus a horizontal scale of each letter in place of the missing
  width axis (55-150%, resting dense at 80%, tracking -0.02em). Phones still swell the letters
  along the scroll, with no visible marker.
- **Idle sway:** on the home page the balls swing together about 3 mm, kept going by a small
  nudge at the bottom of the swing when they have lost a third of their energy (same velocity for
  all four, so they never touch). Off in a story, after the first grab, and under reduced motion.
- **Footer:** a Devpost icon beside LinkedIn, Instagram and GitHub.
- **Performance, no effect removed:** string tubes no longer recompute a bounding sphere or a
  200-step arc-length table every frame (64 steps; the samples move by well under a micrometre),
  the cursor's loop stops when it has caught up, and while every ball is slow the reflection cubes
  refresh every third frame.
- **Cleanup:** removed the unused WallLabel component, dead CSS and tokens (award dots, back
  links, the dark-half colour), and the assets of removed features (hummingbird video, essay cover,
  four-ball nav render).

### 15.12 Revision 6, part 4 (Lucas, 2026-11-05 night)
- **Identity wall text** in Lucas's words (`src/content/identities.ts`, `paragraphs`), typos only
  fixed (apostrophes; "[or wish they spent]" set in parentheses).
- **Moving line** rests at exactly the case-study titles' General Sans 350, no horizontal squeeze,
  the headings' -0.03em tracking. The swell still goes 200-700 and 55-150%.
- **Tagline** "[a product design engineer who gets things moving]" on the home hero, above VU,
  right-aligned to its edge (`HOME_PLACEMENT`). `/lab/tagline` compares six spots: above VU left,
  centred or right; above LUCAS; the hero's top-left corner; under the name before the projects.
  It rises in after the name and slides away with it when a story opens; the 404 has none.
- **Selected objects** (About) as an editorial spread after the Tibetan-culture layouts: one
  object open at a time (context label, title, text, the photo at no more than ~38vw / 62vh since
  the photos are low resolution) over a strip of small prints; choosing a print wipes the photo up,
  raises the text and draws a hairline under the print. A real tab list (arrows, Home, End);
  `/about#<id>` opens that object. Patterns from Awwwards gallery/index elements: one image large
  at a time, the rest as an index, motion only on change.

### 15.14 Link preview
- Sharing a link shows one of the cradle's balls on its own, in close-up, swinging in and out of
  frame: `public/og/cover.mp4` (1200x630, H.264, 2.9 s seamless two-swing loop, ~50 KB) as
  `og:video`, and `public/og/cover.jpg` as `og:image` / the large Twitter card. iMessage plays the
  video muted and looping; Discord plays it on tap; X, Slack, LinkedIn and WhatsApp show the still.
  Filmed from the real scene, one exact 1/30 s frame at a time (`scripts/og.mjs`, `/lab/og`,
  `capture` in `src/scene/world.ts`). Case studies keep their own poster.
- `metadataBase` falls back to Vercel's production domain, so the preview URLs are absolute there.

### 15.15 About, part 2 (Lucas, 2026-11-05 night)
- Selected objects pins and turns as you scroll: each object holds the stage for 0.75 of a screen
  of scroll. The strip of prints is replaced by a section index on the left, after Caleb Wu's case
  studies (and docs sites like Stripe's): Cadets, Chess, Volunteer work, Hackathons, Socratica; the
  one on stage is in ink at weight 500, the rest muted at 350; clicking one glides there (Lenis).
  Phones: the index is one row under the title and keeps the current object in view.
- Copy: new cadet photo titled "Annual 2025 Ceremony"; chess ends "known as Chess Jesus"; the
  volunteer object is "Life Changing Memories with the Elderly"; the hackathon line drops "This one
  paid."
- Digital Extremes' white logo sits on an ink tile again (the tile's colour went with the removed
  dark-half token).

### 15.16 Case-study graphics and work order (Lucas, 2026-11-05 evening)
- Diagram wires only bend when they must: when two boxes face each other over 14 px or more the
  wire runs straight between them. Nothing scrolls sideways inside a component: below their width,
  diagrams stack as an indented tree with tree lines; the comparison table becomes one short list
  per product below 1024 px; the About timeline chart is drawn in percent and fits any width; the
  phone index on Selected objects wraps.
- Reboot's context cards carry their illustrations from the Framer case study.
- /work order is curated: Warframe after Parrot, Asper after Reboot. Shufflr is April 2026, Reboot
  February 2026.

### 15.17 Case-study graphics on phones and tablets, copy, arrival (Lucas, 2026-11-05 night)
- **Stacked diagrams read as paths.** Below their column width a diagram stacks top to bottom:
  boxes that follow each other get a straight arrow down (32 px apart); the sources of one merge
  sit in one tinted group with one arrow out (chips flow like words); when a box splits into
  paths of their own, each path is its own tinted group headed by its label ("a close match",
  "nothing fits"), side by side when each gets 240 px, else indented under a trunk with straight
  stubs into each path. A two-box path sits in a row when both boxes fit (tablet). On desktop a
  split or merge meets the boxes' middles (a fork), one box to one box runs straight, and wire
  labels sit centred over their own segment.
- **Visuals size to their container, not the screen** (container queries), so a visual in a pair
  of insights never squeezes into columns of one word per line.
- **Copy:** no notes about how a graphic was made ("Redrawn from our whiteboard map" is gone).
- **Arrival:** the balls wait just above the frame and come down in 1 s, so they land with the
  tagline (in view at ~1.4 s, settled at ~2.0 s on a warm load).

### 15.18 Revision 7 (Lucas, 2026-11-06)
- **Phones and tablets (touch):** the cradle renders at 1.5x (not 2x), with a 1024 px shadow map,
  128 px reflection cubes and 64x48 spheres, and has no idle sway, so the scene stops rendering
  once the balls hang still. Sound unlocks on any finger lift, click or key (phones do not count
  pointerdown as a gesture); a silent iPhone stays silent (Lucas's choice).
- **Phone menu:** slides away while scrolling down and comes back on any scroll up, like the bar.
  Its outside links carry a sharp, square-cut up-right arrow instead of the ↗ glyph.
- **About:** on phones the chronology is the list alone; the chart stays on desktop.
- **Work rows:** the month and year sit under the title. Home rows play their video in the row
  (where the date was), as high as the row less 14 px at each rule, in its own proportions, while
  on screen; no cursor preview on home. /work keeps the cursor preview.
- **SolarScore:** its row video is the product shots of the Devpost demo (37 s to 66 s, double
  speed, 16:9).
- **Link preview:** `public/og/balls.jpg` (Lucas's render of the four balls) is the image; the
  swinging video stays as `og:video` for the apps that play it.

### 15.20 Moving link previews (Lucas, 2026-11-07; branch `feat/og-discord-gif`). Amends 15.14
- Where an app can animate a preview it shows the swinging ball; where it cannot, `balls.jpg`.
- **iMessage:** autoplays `og:video` (`cover.mp4`, muted, looping) unless the phone has Reduce
  Motion, Auto-Play Video Previews off or Low Power Mode on; previews are cached per link on the
  sender's phone, so test with a fresh query (`?v=3`).
- **Discord:** plays a video only after a click, and only on a video-type page (which drops the
  description), but animates a GIF image. Its fetcher (`Discordbot`) is rewritten to
  `app/discord-card`, which serves the real page with `og/cover.gif` (800 px, made by
  `scripts/og.mjs`) in place of `balls.jpg`. Case studies keep their own image. Discord caches
  previews for about 30 minutes.
- **X, LinkedIn, Instagram, WhatsApp:** never animate a link preview (a GIF shows its first frame,
  or nothing on LinkedIn), so they keep `balls.jpg`.

### 15.21 One still link preview (Lucas, 2026-11-07; branch `fix/og-still-only`). Replaces 15.20
- Every app shows `balls.jpg`: no `og:video` (iMessage) and no Discord GIF. Case studies keep
  their own image. `cover.mp4` and `scripts/og.mjs` stay in the repo, unused, should a moving
  preview come back.

### 15.22 Passion Nails case study (Lucas, 2026-11-11; branch `feat/passion-nails-case-study`)
- A deep case study at `/work/passion-nails` for my mom's salon (passionnailstoronto.ca, repo
  `VuMadeIt/nailsalon`), first in "selected projects". Takeaway: I ship real products end to end,
  and I design for users unlike me (older Vietnamese techs, Hanoi register, small fingers, nobody to
  ask once my mom leaves for Vietnam in January).
- Answers from the Q&A: her stress, not a diagnosis; the techs were involved through my mom daily
  and by watching them in the salon; no metrics yet (about 30 customers a day).
- Every screen is a real build on fake bookings, never the live staff app (it holds real
  customers): the overnight build (`feat/08-polish`), the first fix round (`feat/11`) and today
  (`feat/36`), shot by `scripts/passion-nails-shots.mjs`.
- New visual `switch`: the same phone screens in two to five states (language, before and after,
  booking steps), cross-faded by a segmented control.

### 15.23 Revision 8 (Lucas, 2026-11-12; branch `phase/revision-8`)
- **Home:** Reboot, Passion Nails, Shufflr. Ripple stays first in /work's wins and joins the next-project
  chain (Reboot, Passion Nails, Shufflr, Ripple, Maple Leaf).
- **Passion Nails cover:** Lucas's walkthrough of the live site (`~/Videos/pnails.mp4`) cut to the
  highlights (dead air out, cursor-only stretches 2.5x, motion 1.5x) on a soft mauve frame like
  Reboot's (`scripts/passion-nails-cover.py`). Privacy: autofill popups patched, the typed number
  blurred, the browser link bar cropped. Used for the row and the case-study hero.
- **Shufflr:** the shuffle plays as a looping video (no scroll scrub), followed by its design decisions.
- **Switches** fit one screen with their tabs and note; while on screen the active tab fills and steps
  on until a tab is picked. No caption tells the reader to switch.
- **Passion Nails copy:** no overnight or one-day framing. It says I made a design system (Astryx's
  token architecture, two themes; specimen at `/design` in the salon repo) and a live product used
  daily, and about 4 hours a week back for my mom, given as her estimate.

### 15.24 Revision 9 (Lucas, 2026-11-12 night; branch `phase/revision-8`, salon `feat/37-design-system`)
Done in this session (see commits): switch has tabs only (no arrows); status bar and home indicator
are transparent overlays on the screen; annotations are a thin leader line (no ring); one version
title per group of phones instead of a pill on each; one phone size everywhere; the paired insights
share a height; the outcome stats are what 4 hours a week adds up to.

To do next (a fresh session; read this list as the brief):
1. **One look for both apps.** There is one real reason the staff app differs: the site's display
   font (Zalando Sans Expanded) is a Latin-only cut with no Vietnamese letters (measured), so the
   staff app uses system fonts. Everything else should match the site, above all the reviews
   section: sharp, square cards with a black hairline, soft pill buttons, black, white and the brown.
   Restyle the salon's staff theme to that (keep 17px, 48px+ targets, system type), re-shoot with
   `scripts/passion-nails-seed.mjs` + `scripts/passion-nails-shots.mjs`, and say the font reason
   explicitly on the case study. Astryx stays as the token architecture, not a second look.
2. **Write like Caleb Wu** (calebwu.ca/RevisionDojo): study how his figures carry the story with few
   words, his tone and sentence length, then cut the Passion Nails copy hard. Headlines carry the
   story, a line or two under each, the figure does the rest. Two or three examples per point, not
   six (the quotes, the Southern/Northern table, the anatomy points).
3. **Vietnamese the reader can follow:** every Vietnamese word on the page gets its English on hover
   or tap (a small popover), and the language story is told as it happened: the first build was
   machine-translated, so it came out Southern; walking the techs through the real MVP, again and
   again, showed the Hanoi words they use, and that nail words (manicure, pedicure, shellac) stay in
   English in either language, across the whole app.
4. **Video wherever a section is about doing something** (one video per section, not several at
   once), with play/pause and a scrubber, played slower than now so a reader can read the screen.
   Add a landscape phone filming the By-tech timeline with a full mock day for every tech.
5. **Design system section redone like a real company's docs**, with hierarchy: colour, type, shape
   (cards square, buttons soft), components, and the two-app rule above. Keep the "same components,
   same tokens" comparison. Cut anything that does not change a decision.
6. Think as the hiring manager reading 50 case studies: the gist in the first screen, figures that
   explain themselves, proof it shipped and is used.

### 15.25 Revision 9, done (2026-11-12 night; portfolio `phase/revision-8`, salon `feat/38-one-look` from `feat/37-design-system`)
- **The font reason in 15.24 was wrong.** Google Fonts ships a Vietnamese cut of both Zalando Sans
  Expanded and Hanken Grotesk; only the salon's own files were subset to Latin. So there was no real
  reason for a second look. The salon now serves each face's 9 KB Vietnamese cut behind a
  `unicode-range` (the English site never fetches it) and the staff app uses the site's fonts,
  colours and shapes. The staff theme changes only sizes (17 px, 48 px+) and button case.
- **Shape rule, both apps:** what you read is square with an ink hairline (cards, sheets, notices,
  badges, like the reviews), what you tap is round (pill buttons, chips, segmented; 12 px fields and
  tiles). No card shadows.
- **Screens** are shot full height (393 x 852) with the iPhone safe areas emulated
  (`Emulation.setSafeAreaInsetsOverride`), so the status bar and home indicator lie see-through on
  the screen (`Phone` `full`). The first builds keep their 390 x 756 shots between drawn bars. Media
  URLs carry `?v=9` (`mediaRev.ts`, allowed in `next.config.ts`): re-shooting under the same names had
  left old screens in Next's image cache, the real cause of the "white status bar".
- **Films** (`Film`): play while on screen, pause and a scrubber, a tap dot, about half the old pace.
  One per section: adding a walk-in, booking online, and the sideways By-tech day (a 28-booking seed).
- **Copy** in Caleb's economy: 27 blocks to 20, headlines of 13 words or fewer, bodies of 60 or fewer
  (a test holds both), two or three examples per point. Vietnamese words are `[[vi|en]]` and show
  their English on hover, focus or tap (`Gloss`).
- **Design system** is a docs figure (`System`): colour, type (the Latin cut against the Vietnamese
  cut, missing letters in burgundy), shape; then the side-by-side specimen.

### 15.26 Revision 10 (Lucas, 2026-11-12 night; same branches)
- Every staff screen and film has an English twin, behind Tiếng Việt / English tabs on each figure
  (one page-wide setting, Vietnamese first). The anatomy and the language switch stay as they are:
  they are about the Vietnamese itself.
- Films are encoded as tagged BT.709, so the app's cream (#f4ebdf) matches the stills (the old
  full-range encode washed it to pale yellow). Films get a full-screen button; figures a phone
  can't read get "Zoom in" (full screen at desktop width, − / + and pinch).
- Copy says who the techs are (mostly over 40, immigrants, new to smartphones) and that this is why
  their controls are bigger than the customer site's.
- The design system measures its components the way Figma does (red lines, red value pills, red
  tinted padding): each one as built beside the same one measured, a spacing scale, and a switch to
  hide the measurements.

### 15.27 Case-study playbook (from Lucas's Passion Nails reviews, 15.23 to 15.26). Apply to Shufflr, Ripple and Reboot next
Shared components already carry some of this to every case study: film controls (pause, scrubber,
full screen) on any video, "Zoom in" on figures for phones, glosses, the phone frame. The rest is
per study. Work through it in this order, then screenshot every section at 1440 and 390
(`PORT=3100 node scripts/sections.mjs <slug>`, `VIEW=390x844`) and look at each one.

**Reading time (the hiring manager reads 50 of these)**
1. The gist is on the first screen: a two-sentence summary, the meta row, the hero film.
2. Caleb Wu's economy: headlines of 13 words or fewer, a body of one or two sentences (60 words or
   fewer), captions of 3 to 6 words, numbers inline. Extend the Passion Nails length test to the study.
3. Two or three examples per point, never six (quotes, tables, annotated points, lists).
4. Cut any block that doesn't change a decision. Fold "My role" and "The brief" into the header meta.
5. Sound like a person: not every headline starts with "I"; casual where it's true; no em dashes.

**Truth**
6. Check a reason before writing it (the Passion Nails font story was wrong until it was checked).
7. Say the user facts that drive the design, plainly, next to the decision they drive.
8. Outcomes mean something: what the number adds up to (hours over five years, the wage it would
   cost), never vanity counts (tests written, tabs removed).

**Figures**
9. One idea per figure; the figure makes the point alone. Paired figures end level.
10. Video wherever a section is about doing something: one per section, never two side by side,
    paced to read (about half real speed of a rushed demo), with a tap dot when it's a phone.
    Encode BT.709 tagged (see `scripts/passion-nails-shots.mjs`) so colours match the page.
11. Show a view that sells a feature better (the sideways By-tech day).
12. Phones: one size on the page, a real iPhone frame, the status bar see-through on a full-height
    screen. Version: one quiet title per group of phones, never a pill on each.
13. Switches are tabs only: no arrows, no timers, no "tap to switch" caption.
14. Annotations: a 1 px leader line, no ring, ending at the edge of its target; check each one on a
    screenshot (measure the target in the image, don't guess).
15. A product in another language gets twins and Tiếng Việt / English-style tabs.
16. No off-palette colour anywhere, including inside videos.
17. A design system is docs, with hierarchy: colour, type, shape, components measured Figma-style
    (as built beside measured, a hide switch), spacing; then the side-by-side.

**Phones and caches**
18. At 390 nothing wraps inside a pill or chip, nothing scrolls sideways, every diagram has Zoom in.
19. Re-shot media under the same names gets a new `?v=` (`mediaRev.ts` and `next.config.ts`), or
    Next's image cache and browsers keep showing the old files.

**Per study, as a starting list**
- Shufflr: cut to Caleb's lengths; the shuffle film gets controls already; say who the 20+
  interviewees were where it drives a decision; outcome as meaning (1st place, Most Practical).
- Ripple: cut the water numbers to the two that drive the idea; Zoom in on the diagrams; check
  every annotation; the Figma embed stays click-to-load.
- Reboot: cut to the economy; one film per "doing" section if the Framer material has them; check
  phone sizes against the rest of the site.

### 15.28 Home order (Lucas, 2026-11-12 night)
- Passion Nails leads: home shows Passion Nails, Reboot, Shufflr, and the next-project chain runs
  Passion Nails, Reboot, Shufflr, Ripple, Maple Leaf (and back). Home titles size to their column
  (container units) and never wrap, so no row grows taller than the others.
