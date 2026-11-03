# Decisions

Every non-trivial decision and every realism review round. Newest entries at the bottom of each
phase. Format: decision, alternatives, why.

## Phase 00 (2026-11-02)

- **Dependency versions.** Pinned exact versions published at least 7 days before the run:
  next 16.4.3 (16.4.4 was published today), react 19.3.1, three 0.186.0 (0.187.0 is 3 days old),
  @react-three/fiber 9.8.2, drei 10.7.9, gsap 3.15.0, zustand 5.0.16, tailwindcss 4.3.3,
  @playwright/test 1.64.1, leva 0.10.1.
- **TypeScript 6.0.3, not 7.x.** typescript-eslint (used by eslint-config-next) supports
  `typescript <6.1.0`; TS 7 (native port) would break lint.
- **ESLint 9.39.4, not 10.** eslint-plugin-react 7.37.5 (pulled by eslint-config-next) declares
  `eslint ^9.7` as its ceiling. ESLint 9 is marked deprecated on npm but is what the Next config
  supports today. Upgrade when eslint-config-next moves to ESLint 10.
- **Vitest 4.1.12, not 5.0.5.** npm 10.9 crashes (`Cannot read properties of null (reading
  'edgesOut')`) resolving Vitest 5.0.5's optional peer set (`@vitest/browser-playwright` resolves to
  5.1.0). Vitest 4.1.12 installs with `legacy-peer-deps`; `.npmrc` sets `legacy-peer-deps=true` so
  Vercel and fresh clones resolve the same tree.
- **Manual scaffold instead of `create-next-app`.** create-next-app would pull `next@latest`
  (16.4.4, released today) and its own template files. A hand-written scaffold matches the folder
  structure in PLAN 3.2 exactly and pins versions.
- **App Router lives at `app/` (root), everything else in `src/`.** Matches PLAN 3.2. `@/*` maps to
  `src/*`.
- **Physics import boundary is enforced by ESLint** (`no-restricted-imports` on `src/physics/**`),
  not only by convention, so acceptance test 8 has a structural guarantee.
- **Giant name size 30.5vw** (PLAN says ~20-22vw). Sam Cheng's "Sam Cheng" has nine letters;
  "Lucas Vu" has seven plus a space, so 20vw only covers ~65% of the width. The vision says edge to
  edge, so the size is derived from the width, not copied from Sam.
- **Mobile corners stack.** At < 640px the two corner lines collide, so the second line drops under
  the tagline in muted ink.
- **Screenshot script takes routes without a leading slash** (`home`, `work/shufflr`) because Git
  Bash rewrites `/foo` arguments into Windows paths.

## Phase 01: physics (2026-11-02)

- **Model.** Each ball is a point mass hung from two unilateral distance constraints (front and back
  anchor, the bifilar V). Ball orientation is not simulated: the screw eye is rigidly fixed and
  both strings meet at it, so the ball's up axis points at the anchor midpoint (PLAN 4.1). The
  rotational mode of a real ball about its eyelet is stiff and barely excited by central impacts,
  so leaving it out costs nothing visible and keeps momentum transfer exact.
- **Integrator.** XPBD, fixed step 1/240 s, 20 substeps (4800 Hz), one string iteration per
  substep. Order per substep: forces (gravity, quadratic air drag, hysteresis), predict, hand
  constraint, string projection, velocity from positions, contacts. Worst string stretch in a
  60 s run: 0.0004 mm (budget 0.1 mm).
- **Contacts: impulses after the velocity update, not XPBD position contacts.** I first planned
  Müller's position pass plus restitution velocity pass, but in a chain a position correction
  pushes ball 2 into ball 3 inside the same substep while their pre-substep relative velocity is
  zero, so the velocity pass glues them together (perfectly inelastic). The fix is the scheme
  Müller himself uses in Ten Minute Physics 05: remove overlap by moving positions only (no
  velocity injected), then apply a normal impulse that sets the relative normal velocity to
  `-e * v_n` using the *current* velocities, sweeping pairs until no approaching overlap is left.
  Chains then resolve as sequential pairwise impacts within one substep or across a few.
- **Resting contact.** Impacts slower than 2 mm/s are perfectly inelastic, which stops micro
  chatter between balls that drift into contact. Such impacts emit no sound event.
- **Hand.** XPBD zero-rest-length constraint with damping (Macklin et al. 2016, eq. 26),
  7 Hz, critically damped, solved before the strings so the strings always win. The target (not
  the ball) is clamped to 70 degrees from straight down, so nothing teleports.
- **Sleep.** The world starts asleep ("hanging perfectly still"); any command wakes it; it sleeps
  again after kinetic energy stays under 2e-6 J for 2 s with no hand and no anchor motion.
- **Geometry.** Ball diameter 65 mm (1.129 kg of steel), string 470 mm, anchor half spread 110 mm,
  eyelet 8 mm, rest gap 0.1 mm. Pendulum length 497 mm, small-angle period 1.415 s, so one clack
  every 0.72 s. 0.9 m felt too slow on screen and a 30 degree swing would leave the viewport; a
  0.5 m pendulum reads as a heavy gallery object and still swings briskly. Re-judge in Phase 02
  against the framing.
- **Calibration against a real recording** (`scripts/audio/analyse.py`, `scripts/physics/calibrate.ts`).
  Onsets and peak levels of four Freesound recordings were measured. LoafDV 131596 is the only
  clean single decay (23 clacks, 0.345 s falling to 0.301 s apart). Its desk-cradle geometry was
  simulated (5 balls, 19 mm, string length fitted from the interval: 0.10 m, interval RMSE 12 ms),
  and restitution and hysteresis were grid-fitted on loudness, assuming level = 24 log10(v)
  (Hertz: peak force ~ v^1.2), excluding clipped clacks and pair-averaging the left/right
  microphone asymmetry.
  - Best fit e = 0.965 to 0.97, hysteresis 0 to 0.1 /s (weakly constrained), level RMSE 2.9 to 3.1 dB.
  - Shipped: **e = 0.975, hysteresis = 0.03 /s.** A precision steel cradle is a little more elastic
    than a desk toy, and PLAN test 2 (far ball leaves with >= 95%) needs e >= 0.972 for four balls
    ((1+e)/2)^3. Hysteresis 0.03 /s gives a lone pendulum Q of about 150, plausible for nylon.
  - Before (first guess e 0.985, hysteresis 0.004) vs after, against the recording:
    `docs/physics/calibration.svg`.
  - Result in our cradle: 30 degree release, energy 30% after 10 s, 3% after 60 s; the middle balls
    pick up motion and by about 50 s all four swing together, in phase. Emergent, not scripted.
  - **Known limitation:** the recording decays faster towards the end and its clack interval shrinks
    13%; our sequential-impact model decays log-linearly with a constant interval. Both point to
    faster synchronisation in the real toy, likely wave dispersion through touching balls, which
    only a Hertzian contact model with microsecond substeps during impacts would capture. Logged
    for REPORT.md as a possible upgrade.
- **Test 9 envelope.** Viscous hysteresis alone leaves exp(-gamma t) of the energy; the test
  asserts the 60 s energy is below that envelope (impacts remove more), still visibly swinging,
  and that the four balls end up swinging as one (spread under 0.5 degree).
- **Visual rope.** 20 segments, Verlet + 12 projection iterations per 1/600 s substep. When the ends
  are a full length apart the line is under tension: its own weight is ignored (real sag is
  microns) and interior points relax toward the chord with a 35 ms time constant, so a hit (a
  transverse kick proportional to impact speed) shows as a brief shiver and the line straightens.
  Slack, it hangs as a chain and sways.
- **Recordings are not committed** (git-ignored, `scripts/audio/fetch.sh` restores them). The first
  physics commit contains them; they are credited in CREDITS.md, which their licences allow.
- **Lab tooling.** `/lab/physics` (2D side view, drag, scenarios, slow motion, angle and energy plots,
  impact ticks vs the recording's onsets on the desk preset). `/lab/*` 404s in production unless
  `LAB=1`. TypeScript scripts run with `npx jiti` (already in the tree via Tailwind).

## Phase 02: the real object (2026-11-02)

- **Transparent canvas, the page is the wall.** The canvas has no wall mesh the visitor sees; the
  page background shows through, so the canvas edges match the CSS colour exactly (e2e samples
  pixels along the edges, tolerance 2/255). The canvas draws only what the spotlight adds (a very
  faint pool, 3% white, fading to zero inside the frame) and takes away (shadows via a
  ShadowMaterial plane 30 cm behind the balls). A solid copy of the wall sits on a separate layer
  that only the reflection cameras see, so the chrome still reflects it.
- **Camera.** 18 degree vertical FOV, 35 mm above the ball line, looking straight ahead with a
  lens shift (setViewOffset) instead of a tilt, so the strings stay parallel like a shift-lens
  product photo. Landscape frames at least 0.8 x 0.48 m; portrait at least 0.36 m wide and at
  most 0.95 m tall so the anchors (0.5 m above the balls) never come into view.
- **HDRI.** Evaluated six Poly Haven studios plus two processed versions in /lab (sheets in
  `.artifacts/lab/hdri`). Studio HDRIs read as product renders (two softboxes, black studio).
  `sculpture_exhibition` is a real gallery and makes the chrome read as a photographed object, but
  it was shot under tungsten and turned the balls into brass. Shipped: **`gallery_neutral`**, a
  grey-world white-balanced, 15% saturation copy (`scripts/hdri_neutral.py`). All candidates stay
  switchable in /lab.
- **Chrome.** MeshPhysical, metalness 1, chromium F0 (0.549, 0.556, 0.554) linear, roughness
  0.035 plus up to +0.09 from an ambientCG fingerprint map. Per-ball cube camera (192 px,
  HalfFloat, PMREM refreshed) updated round-robin one per frame, each ball hidden while its own
  cube renders, so balls reflect each other, the strings and the wall.
- **Tone mapping: Khronos PBR Neutral.** AgX washed the chrome out to a flat grey; ACES shifted
  hue. Neutral keeps the measured metal colour.
- **Shadows: VSM, not PCSS.** drei's SoftShadows only works on three's Basic shadow path, which
  my own shadow-type effect was overriding; once fixed, PCSS was noisy at 20 samples on the
  string proxies. VSM with a blur radius computed from the physical penumbra (emitter 5 cm,
  blocker to wall 30 cm, light 3 m away: about 5 mm) looks like a museum spot and costs less.
- **String shadows are analytic.** A 0.4 mm line cannot be resolved by a shadow map (0.7 mm
  texels), and fattened proxies cast fake dark bands. Each string is projected onto the wall from
  the light, with the true penumbra width and darkness = fraction of the emitter it hides
  (w * D / (a * S)), times the ball umbra darkness. Physically, that is faint; it is faint.
- **Key light.** Spot at (-0.3, 0.45, 3) m: shadows fall a little down and right, about half a
  ball diameter, partly hidden behind the balls, like Sam Cheng's lanyard.
- **Strings.** 1 px minimum width rule in the vertex shader (coverage-weighted alpha below a
  pixel), Kajiya-Kay highlight, darker silhouette for refraction. Nylon default; thread and wire
  in /lab.
- **Lint: `react-hooks/immutability` is off for `src/scene/**`.** React Compiler's rule rejects
  every imperative three.js mutation (uniforms, scene.background), which is how R3F scenes work.
- **Lab hydration bug.** zustand returns the server snapshot during hydration, so leva started
  from defaults and its mount-time onChange reset query overrides. Leva now reads
  `useLook.getState()` directly.
- **Still.** `scripts/still.mjs` renders the real scene on a transparent page at two framings
  (landscape 0.8 x 0.8 m square, portrait 0.36 x 0.78 m) to WebP with alpha (127 KB, 82 KB).
  `.cradle-still` reproduces `frameFor()` in CSS; `scripts/align.mjs` blends live and still at four
  sizes: they coincide. It is the LCP image, fades out once the canvas has rendered its
  reflections, and stays as the cradle when WebGL2 is missing.
  Known gap: on phones taller than about 1:2.2 the portrait still ends a few pixels below the top.

### Realism review rounds (chrome)
- **Round 0** (`.artifacts/screens/p02-r0`): balls dark and samey (the lab bug), shadows hard
  grey discs a full diameter below, strings jagged double lines, string shadows heavy bands.
  Fix: lab bug, HDRI comparison, lower key light.
- **Round 1** (`.artifacts/lab/r1`): gallery HDRI makes the chrome believable; brass cast; PCSS
  hard and noisy. Fix: neutral HDRI, VSM, smaller offset.
- **Round 2** (`.artifacts/lab/r2`, `r3`): string shadows still too strong; pool shows a visible
  halo; mobile cradle too small. Fix: analytic string shadows, pool 0.03, portrait framing 0.36 m.
- **Round 3** (`.artifacts/lab/r4`, `.artifacts/screens/v0.2.0`): chrome reads as photographed
  steel (compare `reference/realism/steel-ball-60mm.jpg`: bright body, hard horizon, ceiling
  lights). Still fake: shadow core slightly heavy and uniform (opacity 0.3 to 0.24), porcelain flat
  (darker base, rougher, clearcoat), dark metal banded by anisotropy (removed). Remaining: the
  balls do not show the strings in their reflections at this size; acceptable.

## Phase 03: interaction and sound (2026-11-03)

- **Drag.** Pointer rays are intersected analytically with the four balls (no mesh raycast) and
  with the swing plane z = 0. The grab keeps the offset between the grab point and the ball
  centre, so the ball does not jump under the cursor. Release keeps velocity, so flicks throw.
- **Touch.** The canvas is `touch-action: pan-y`; a non-passive `touchstart` cancels scrolling
  only when the touch lands on a ball (touch-action cannot change mid-gesture).
- **Accessible targets.** Real buttons positioned every rendered frame from projected ball
  positions (`frame.screen`, written by the scene, read by the DOM layer through `afterFrame`).
  They are `pointer-events: none` so the canvas keeps mouse and touch; keyboard and screen readers
  use them. Focus ring is a square 1 px ink outline 8 px off the sphere (house rule: no rounded
  corners, even around a ball). Captions are one element per ball so they can fade out with their
  own text. Arrow keys push 0.32 m/s (about 9 degrees); disabled under reduced motion.
- **On-demand rendering.** `frameloop="demand"`. The scene keeps invalidating while the cradle is
  awake, for 1.5 s after it sleeps (strings settle), and for the first 8 frames (reflections). An
  IntersectionObserver stops it off-screen. Input from the DOM wakes it via `requestRender()`.
  Frame dt is clamped to 50 ms, so a tab that slept does not jump the swing.
- **Performance fix: cube cameras no longer re-render the shadow map.** three redraws shadow maps
  on every `render()` call, so each of the six cube faces redrew the 2048 VSM map and its blur.
  Disabling `shadowMap.autoUpdate` during cube renders took the hero from 38 fps to a vsync-locked
  60 fps on an Intel Arc 140V at 1440x900, DPR 2.
- **Tests run on the real GPU now.** SwiftShader managed 0.7 fps with this scene, which starved
  CSS transitions and made interaction tests meaningless. Playwright and all scripts use
  `--enable-gpu --ignore-gpu-blocklist`; `SWIFTSHADER=1` restores the software path.
- **VSM receiver bias -0.002.** On a real GPU the shadow-catcher plane shadowed itself (diagonal
  acne bands over the whole wall), because three renders VSM receivers into the map too.
  SwiftShader had hidden it.
- **Light size 8 cm** (was 5 cm): on the GPU path the VSM penumbra rendered crisper than in
  SwiftShader; 8 cm is a typical museum spot reflector and gives an 8 mm penumbra.
- **Sound.** 12 isolated, unclipped clacks sliced from the CC0 recording (drewtait 676377) into one
  sprite, 160 ms each with a squared 40 ms fade, peak -1 dBFS: `clacks.webm` (Opus, 28 KB) and
  `clacks.mp3` (27 KB) for Safari. The AudioContext is created on the first pointer down, key
  push, or toggle click. Impacts within 6 ms are one clack (unit-tested), level = (v / 1.4)^1.2
  (the Hertz exponent used in calibration), low-pass opening from 3.5 to 18 kHz with speed,
  rate 1 +/- 3%, pan by x. Below 1.5 cm/s silent. The context suspends while the tab is hidden.
  `[sound on]` sits at the right gutter just above the giant name, remembered in localStorage.
- **String shiver** on impact: both strings of both balls in an impact get a transverse kick of
  0.05 m/s per m/s of impact speed.

## Phase 04: identities (2026-11-03)

- **Rendering inside the ball, in the fragment shader.** Each ball's chrome material is patched
  (`withIdentity`) with a per-identity GLSL body that takes the ray entering the unit sphere in
  object space, so the identity swings and turns with the ball. No geometry inside the sphere,
  no transparency sorting, black is depth. Only uniforms change on reveal; physics untouched.
- **Palettes** from `scripts/palette.py` (k-means on all non-black pixels, plus a "vivid" pass on
  high-saturation pixels, because averaging washed the iris's cyan, magenta and salmon to grey).
  Shaders use the vivid colours, slightly pushed.
- **People.** Iris on a disc behind the cornea; fibres are noise around the ring at high frequency
  whose angle wanders with radius (hair, not spokes); hue per strand from a slow noise field
  (crimson and pink near the pupil, blues and cyans outward, salmon and cream sectors); collarette,
  crypts, white flecks, tufted feathery edge, limbal darkening. Life: blinks every 3 to 7 s (120 ms
  close, 180 ms open, two dark lids), pupil breathing, gaze toward the cursor with micro-saccades.
- **Ideas.** 10-step jittered march through domain-warped direction noise (it integrates into
  radial filaments), white-hot core, warm/cool whites with faint prismatic fringes, breathing,
  flows 1.8x faster when revealed. Cost-tuned: 3-octave warps and a 4-octave filament field.
- **Experiments.** 30 tilted great circles (9 bright with comet electrons, 21 faint). Instead of
  marching, each thin line glows where the ray crosses its orbit plane, divided by the crossing
  angle: crisp at any size and cheap. Trails fade with angular distance behind the head; `uWeave`
  restarts at 0 on reveal and grows over 4 s from sparse arcs to a full lattice; the nucleus
  flare (core plus four-point glint) lands as the reveal completes. Deep navy interior.
- **Products.** SDF gladiolus (bent stem swaying, five ruffled florets growing larger toward the
  bottom, three green buds), 48-step march, Lambert plus back-light translucency; sky gradient
  with drifting FBM clouds behind; thin-film soap interference (650/530/440 nm, film 320 to
  620 nm swirling) on the shell.
- **Reveal variants.** A: identity becomes the surface finish under a faint sheen. B: dielectric
  shell (Schlick F0 0.04 reflection) with the identity inside and the page showing through the
  clear rim (alpha falls where the fresnel is low). C: a liquid-metal ripple front from the hover
  point with mercury bands, revealing B behind it. **Default B**: it is the only one that reads
  as a physical object changing state (a chrome ball becoming glass) rather than a texture swap;
  A looks like a decal, C is striking once but busy at 60 px. All three in /lab and `?reveal=`.
- **Tween.** GSAP 0.8 s with the site ease as a CustomEase (cubic-bezier .23,1,.32,1); instant
  under reduced motion, where identities also hold a still frame.
- **Performance.** All four hover states hold 60 fps at 1440x900 DPR 2 on the integrated GPU.
  Reflection passes use `uDetail = 0` (fewer steps and orbits) because neighbours see the
  revealed ball at a few pixels.

### Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below)
- **Round 1.** Iris a rigid starburst; orb nearly black; atom thick blurry bands; flower good.
- **Round 2.** Wandering fibres and strand hues (iris now reads as hair); orb blown out to a white
  blob; atom switched to analytic plane crossings (crisp but busy); deeper sky.
- **Round 3.** Orb contrast up, too spiky and violet; atom calmer and closer to the reference's
  few bright rings over many faint strands; florets larger at the bottom.
- **Round 4.** Orb softened to warm and cool white wisps around a white core. Still short of the
  reference: the orb's prismatic dispersion is subtler than the photo's, and the florets are
  rounded blobs rather than open ruffled petals.

## Phase 05: story state (2026-11-03)

- **Routes are the source of truth.** `app/(site)/(hero)/layout.tsx` holds the hero and canvas;
  `/` and `/people`, `/ideas`, `/experiments`, `/products` are pages inside it, so the canvas never
  remounts. Taps, Enter, the back arrow, Escape and empty-wall clicks only navigate;
  `StoryController` turns route changes into choreography. Browser back works for free. Each
  identity page is statically generated with its own title, description, canonical and OG text,
  and server-renders the story text (readable without JavaScript or WebGL).
- **The choreography drives anchors only, on simulation time.** A paused GSAP timeline is seeked
  from `cradle.beforeStep(time)` (new physics hook, tested frame-rate independent), and its values
  go to `setAnchorOffset`. The balls are always simulated.
- **No anchor motion is faster than physics allows.** First pass: the rise ended at full speed and
  the hidden balls flew on slack strings and were still swinging when they came back; the dip and
  descent started with instant velocity. Now every phase starts and ends at rest or at matched
  velocity: dip `sine.inOut`; rise `power3.in` to 0.45 m (balls leave the frame accelerating, the
  "theatre curtain") then a matched-velocity `power2.out` brake off-screen to 0.75 m (deceleration
  under g, strings stay taut); return `power2.inOut` over 1.4 s, staggered 60 ms left to right.
- **The glide uses zero-vibration input shaping** (as on cranes): the move is split into two
  half moves (each 0.45 s, `power2.inOut`) half a pendulum period (0.71 s) apart. The ball visibly
  lags and swings while its anchor travels, and the second half cancels the swing the first
  started, so it arrives hanging still with no damping or scripting of the ball. Unit test: residual
  swing under a quarter of an unshaped move's. Total glide 1.16 s (PLAN: 0.9 to 1.2 s).
- **Target.** Wide screens: the selected ball's anchor goes to the left third of the visible width.
  Phones: top centre, 24% from the top, text below like a sheet; the sound toggle hides there.
- **Deep links and reduced motion** use `teleportAnchors` (new, tested): anchors and ball jump
  together and hang still, no intro animation. The story text animates only when mounted by a
  navigation (a flag set after hydration); a direct load shows it at once.
- **Mobile two-tap.** The first tap reveals and names the ball, the second opens the story.
  Bug found while filming it: touch pointers fire `pointerleave` after every `pointerup`, which
  cleared the hover the first tap had just set; only a mouse leaving now ends a hover.
- **Taps vs drags.** A press that moves under 6 px and lasts under 400 ms is a tap; anything else
  is a drag (the chosen ball can still be dragged in the story state). Pointer cancels never tap.

## Phase 06: site shell and home (2026-11-03)

- **Media pipeline** (`scripts/media.sh`): Lucas's old repo cloned outside the project; only used
  media copied. Videos re-encoded to H.264, max 1280 px, CRF 26, no audio, faststart (the 41 MB
  Shufflr reel is now 0.8 MB), WebP posters (Maple Leaf's from 2 s in: its first frame is white).
  Loops load nothing until visible (`preload="none"`), play only on screen, never under reduced
  motion.
- **Project facts** come from the old repo's content files and Devpost (event, team, prizes:
  fetched with a browser UA). Roles and years not stated anywhere are marked `draft` in
  `src/content/projects.ts` and listed in REPORT.md.
- **Stacked exhibits**: plain `position: sticky` full-height articles. The covered exhibit dims to
  12% ink, driven by the *next* exhibit's view timeline (`timeline-scope` on the section), CSS
  only; browsers without scroll timelines get the stack without the dim. No position indicator:
  four exhibits with their own titles read fine without "2 of 4", and it would be an eyebrow.
- **Warframe** gets an exhibit with no picture: a tone-step field reading "Currently under
  wraps.", the wall label, and "Ask me about it" (its case study page invites an email).
- **Entrances**: `.reveal` uses CSS `animation-timeline: view()` (rise 14 px plus fade, staggered by
  `--d`). Content is never hidden without JavaScript and is static under reduced motion.
- **The giant name is the h1** (was a visually hidden h1 plus an aria-hidden name). The Taste
  inspector flagged the hidden title; the visible name is the title.
- **Muted ink #68655e** (was #76736c): the original failed 4.5:1 on the wall at 14 to 15 px.
- **Taste gate**: `lint.mjs` on app and components (the WebGL shadow-map code in `src/scene` is the
  wall shadow PLAN Part 5 allows); `inspect.mjs --allow shadow,rules,covered-text,late-title`.
  `covered-text`: the stacking cards cover the previous exhibit by design (PLAN 6.1).
  `late-title`: the transparent canvas lies over the name because the cradle hangs in front of
  it (PLAN Part 5). Remaining warnings, defended: `palette-cream` (the museum wall #F3F1EC is the
  brief), `first-action` (Sam-style hero, the cradle is the action), `name-only-title` (the corner
  line says what Lucas does, at Sam's corner size), `size-count` at 390 px (revisit in Phase 09).
- **Close**: "Let's get something moving." (36 px floor on phones so it stays on two lines), the
  S27 co-op line from LinkedIn, contact in running text, the name returning at full width.
- **404** "Nothing hangs here." Favicon: one chrome ball cropped from the real render with a
  circular mask. Sitemap and robots (lab disallowed).

## Phase 07: case studies (2026-11-03)

- **One data-driven template** (`app/(site)/(pages)/work/[slug]/page.tsx`) fed by typed content
  (`src/content/caseStudies/*`): title, one-sentence claim, a wall-label block (Role, Team,
  Timeline, Scope), link, full-width hero media, then sections that each open with a short
  label and a first-person claim headline, a 660 px reading column, media breaking wider, stats
  with their sources, interview quotes, titled points, a square floating progress bar
  (section label, n / total, a 2 px fill) and a full-width "Next exhibit" card.
- **Story order** follows Caleb Wu's rhythm compressed to PLAN 6.4: Context, Problem (with
  research), Insight or Solution, Key features or design decisions, System or impact, Reflection.
- **Copy** is ported faithfully from the old repo; only headlines were rewritten as claims
  (Rachel Chen). Every real stat keeps its source link. A unit test enforces the skim rule
  (every claim and headline is first person), no em dashes anywhere in site copy, and that every
  case study links to a real next one. The test caught one headline that was not a claim.
- **Maple Leaf reflection** had no source copy: the section holds a DRAFT placeholder asking Lucas
  to write it, rather than an invented reflection.
- **Warframe**: one section ("I would rather show you this in person.") and a mailto "Ask me
  about it". No invented content.

## Phase 08: About and All work (2026-11-03)

- **About as a museum room**: wall-text statement (from the old About page) beside a portrait (the
  Senso-ji photo from the solo Japan trip, the only portrait in the old assets), a chronology as a
  plain ordered list (year, role, place; LinkedIn plus the old experience list), six "selected
  objects" with tombstone labels (title in italic, context, medium, one line), staggered in a
  three-column hang, and a reading room on a tone-step ground for the essay "Why I'm finally ready
  to call myself a designer", ported with only typographic fixes (no em dashes).
- **Accuracy correction**: PLAN 2.5 lists "soccer (TCDSB West-End, last season 13-1-2)", but the
  old site's own caption puts the 13-1-2 record in the TCDSB West-End *chess* division. The site
  follows Lucas's caption. Listed for him to confirm.
- **Catalogue `/work`**: Sam-style rows, thin rules (allowed by PLAN Part 5), large title, two-line
  description, medium and credit in muted ink, year at the right. Preview media appear beside the
  row on hover or focus on desktop and sit inline on phones. Case-study rows link to the study;
  others link to Devpost or GitHub; Parrot and Creators Collective have no public link.
- **Entrance timing bug fixed**: the `.reveal` range used `calc(% + ms)`, which is invalid, so
  browsers fell back to the whole cover range and text sat half-transparent mid-screen. Now one
  fixed range (`entry 5%` to `cover 22%`); the stagger comes from elements entering at different
  heights.

## Phase 09: polish (2026-11-03)

- **Sweep** (`scripts/sweep.mjs`): every route at 1440, 1024, 768 and 390: no console errors,
  no horizontal overflow.
- **Story layout follows the camera's aspect rule**, not a width breakpoint: at 768x1024 the ball
  goes top centre (portrait framing) but the text was still to the right. `.story-panel` and the
  sound toggle now use the same `max-aspect-ratio: 9/10` query as the framing and the still.
- **Deep links skip the still** when WebGL is available: the still shows four balls at rest and
  flashed the wrong state for ~1 s on `/people`.
- **No-WebGL fallback now has the same doors**: four captioned links positioned over the still's
  balls with the framing maths in CSS (captions staggered on phones, where names are wider than
  the ball pitch). They open the same server-rendered story pages. E2E-tested.
- **Taste second pass**: removed the section-label eyebrows from case studies (the labels live in
  the progress bar), moved the essay date and "Next exhibit" under their titles, put catalogue
  years inline on phones, kept catalogue previews inline below 1024 px (they overflowed at 768).
  Defended, not changed: case-study headlines run three lines on desktop and up to five on phones,
  because PLAN 6.4 requires first-person claim sentences (the skim test) and they are the story;
  thin rules in the catalogue (PLAN Part 5); `blank-gap`, which is the inspector stitching
  screenshots before scroll-driven entrances have run (its own stitched captures show the content).
- **Bundles**: leva is only referenced by `/lab`; three.js and the scene (975 KB raw) load after
  first paint via `next/dynamic` with the still as LCP.

## Phase 10: slow motion lab (2026-11-03)

- **Time scale outside the physics**: `src/scene/slowmo.ts` multiplies the real frame time before
  it reaches `cradle.advance`, the rope sim, the identity clocks (`slowmo.clock` replaces the R3F
  clock for blinks and the weave) and the clack pitch. `dt`, constants, mass and the solver are
  untouched, so the state after N fixed steps is bit-identical (Vitest, `slowmo.test.ts`). The
  physics files never mention the flag (same test).
- **Ramp**: smoothstep on a 0..1 ramp (300 ms in, 400 ms out), applied in log time
  (`scale = 0.1^s`), so the slowdown reads as an even film ramp instead of a brake. Alternatives:
  a linear lerp of the scale (spends most of the ramp near 1x, then drops abruptly) or an
  exponential approach (never quite arrives).
- **Trigger**: a mouse pointer on a ball while the sim is awake, no ball held, no choreography
  moving the anchors, and some ball faster than 0.05 m/s (a 30 degree release hits at ~1.15).
  Once slowed it stays slow while the pointer stays on a ball, even if that ball stops, so the
  user can aim the click. Keyboard focus and touch never trigger it (`slowmo.hover` is set only by
  mouse moves). Reduced motion disables it.
- **Click**: a press on the canvas or any choreography call snaps back to 1x first (with the up
  whoosh), so grabs and the curtain always run in real time. After a press, slow motion waits
  until the pointer has left that ball, otherwise a flick would slow down the moment it is thrown.
- **Sound**: "Woosh - Plastic Tray 5 Slowed" by Sadiquecat (Freesound 742946, CC0), a real swung
  object rather than a designed sci-fi whoosh. `scripts/audio/whoosh.py` runs it through a
  tape-stop (playback speed 1 to 0.45, so the pitch sinks like a film slowing), trims it to 0.95 s
  so the reversed "up" clip peaks soon after the pointer leaves, and loudness-normalises to
  -24 LUFS / -6 dBTP so it sits under the clacks. Clacks pitch down with the time scale, floored at
  0.45x so they still sound like steel.
- **Flag**: on in `/lab` (pathname) and with `?slowmo=1`; off in production. Browser check
  (`scripts/slowmo.mjs`, real GPU): outer balls move at 0.16x their speed while a middle ball is
  hovered (ramp included), 1.2x without the flag (sampling noise).

## Phase 11: type, nav and motion (2026-11-03)

- **Fonts**: General Sans (headings, the name, the tagline; roman and true italic) and Cabinet
  Grotesk (body, nav, corner lines) as Fontshare's official variable woff2 files through
  `next/font/local`. Not the old repo's TTFs: woff2 is a third of the size, and the ITF licence
  forbids converting or subsetting, so we ship the files exactly as Fontshare publishes them.
  Cabinet has no italic, so every Fraunces italic was re-cast: wall-label and object titles are
  plain headings, the story line is Cabinet 300 (the old site's subtitle weight), quotations use
  General Sans italic.
- **Giant name**: `LUCAS VU`, General Sans 350, -0.035em, 21.5vw so the ink runs edge to edge with
  ~40px margins at 1440 (measured in the browser). The line box is the cap height plus 0.09em under
  the baseline, so the letters sit off the bottom edge as in the mock.
- **Letter stagger, scroll line and nav slide in CSS, not GSAP**: the same values as the old
  GSAP code (power4 curves as cubic-beziers, `y:100`, 1.5 s, 0.1 s stagger; the scroll line's
  1.5 s sweep plus 0.5 s rest as a 2 s keyframe loop; the nav from -100% over 1.2 s after 0.5 s).
  CSS starts with the first paint, so it never waits for hydration, never fights the LCP still,
  and the name is never hidden if JavaScript fails. No font gating: the woff2 is preloaded by
  next/font and the first letter starts 150 ms in. Reduced motion: none of the three run.
- **Scroll line is vertical**, continuing the rotated tagline downward: Lucas's mock draws it that
  way (zoomed in), and so did the old site (a rotated box).
- **Hero nav is not fixed**: on the home hero the links sit top right inside the hero and scroll
  away with it. A fixed bar would need a wall-coloured background over the strings, which would
  cut them off below the top of the screen. Inner pages get the old site's fixed bar (logo left,
  links right, solid wall ground, no border, no colour flip).
- **`work` goes to `/work`** from every page (one predictable target) rather than an anchor on home.
- **Metal accent**: `--metal` is a five-stop grey gradient sampled from the live chrome (dark edge
  #474645, mid #8b8b8a, highlight darkened from #f1f0ee to #c4c3c0 so the middle of a 2 px line
  does not vanish on the wall). Used only for underlines (`.u-grow` draws in over 300 ms ease-in-out
  on hover; `.u-metal` is always present in running text and a highlight sweeps along it on hover),
  the scroll line and the case-study progress fill. A deliberate exception to the Taste "no
  gradients" rule, asked for in PLAN 12.1. The sound toggle carries it on an inner span, so the
  button itself keeps a flat fill.
- **Radius scale 8 / 16 / 24 px** (`rounded-sm/md/lg`), pills fully round. Media 16, the progress
  bar 16, the `say hi` pill round. The Taste skill warns against the 9-16 px "soft" radius on
  buttons, so buttons are either the pill or have no box at all; 16 px is for pictures, matching
  the rounded media in Lucas's inspo references.
- **Text rise**: GSAP ScrollTrigger `batch` on every `.reveal`: from y 40 and transparent to rest,
  1.25 s power4.out, 0.2 s stagger within a batch (heading first, then body), once. Trigger at
  `top 85%` rather than the old site's `top 400px`: with per-element triggers, 400 px would leave
  the lower half of every screen empty while scrolling. Elements already on screen at first paint
  are left alone (no flash of hidden text); after a client navigation everything rises (layout
  effect, so nothing paints before it is hidden). Without JavaScript nothing is hidden.
- **Lenis 1.3.27** (published 2026-10-15, the newest non-dev release older than 7 days), driven by
  `gsap.ticker` with `lagSmoothing(0)` and feeding `ScrollTrigger.update`. Touch keeps native
  scrolling (Lenis's default `syncTouch: false`), so the canvas's `touch-action: pan-y` and ball
  capture behave as before; the sticky work stack is native `position: sticky` and unaffected.
  Off under reduced motion. E2E: wheel-scrolls to the close and checks its heading has risen in.
- **Taste inspector**: `eyebrow` was the hidden hover caption "People" (opacity 0) sitting above
  the lowered name; captions are now `visibility: hidden` at rest. `button-fx` was the metal
  underline on the sound toggle; moved to an inner span. `lopsided` ("Selected work" intro) goes
  in Phase 12. `size-count` at 390 px is revisited after the work and case-study rebuilds.
- **Not a regression**: the live chrome shows a pale rim (the wall reflected at grazing angles);
  it was already there in Phase 04's captures. The v1.1.0 screenshot looked rimless only because
  it was taken before the still had crossfaded to the canvas.

## Phase 12: work stack (2026-11-03)

- **Folio Stack, studied first**: filmed the Framer demo (`.artifacts/folio/sheet.png`): wide
  rounded cards pinned near the top, each next one pinned about 12 px lower, earlier cards scaled
  down from their top edge and darkened so a sliver of each stays visible; big white title bottom
  left, one-line caption, `01 / 05` top left, a tag top right.
- **Rebuilt as CSS sticky plus one scroll handler**: each `<li>` is `position: sticky` at
  `inset + i * 14px`; a rAF-throttled scroll listener measures how far each card has slid over the
  one before (0 entering at the bottom, 1 pinned) and gives every earlier card
  `scale(1 - 0.04 * depth)` from its top edge and a dimming layer at `0.28 * depth` (max 0.6).
  Reduced motion keeps the stack without scale or dimming. No ScrollTrigger pin: sticky is native,
  survives Lenis untouched and costs nothing when idle.
- **Card size and hold**: `100svh` less the inset and the three peeks (svh, so phone toolbars do
  not resize cards mid-scroll). Each card gets a 45svh hold (a margin, plus an `::after` spacer
  after the last card so the pile stays together before it leaves); without it the next card
  started covering the title the moment a card pinned.
- **Legibility**: a neutral scrim at the bottom (black 65% to clear at 60%) and a lighter one at the
  top (35% to clear at 25%) for the index and tag: Ripple and Maple Leaf's media are white.
- **Order and copy**: Shufflr, Ripple, Maple Leaf Foods, Warframe. The intro ("Selected work / Four
  exhibits") is gone; the section keeps a visually hidden `h2` for its outline. Captions are cut
  from each project's existing description (accuracy rule). Tags are the medium, lowercase.
- **Warframe is a card only**: `/work/warframe` and its content file are removed (404, gone from
  the sitemap and the Next cards; Maple Leaf's Next is Shufflr again). The card is not a link
  (`role="group"`), shows `apple-still.jpg` (WebP) and plays the glitch on hover: the 6.5 MB GIF
  became a 0.66 MB H.264 loop (`scripts/media.sh`); a VP9 WebM came out twice the size, so it is
  not shipped. The catalogue lists Warframe as "Coming soon" without a link.
- **Taste inspector**, allowed with reasons: `numbering` (the `01 / 04` index is asked for in
  PLAN 12.5 and copies Folio Stack), `gradient` (the two neutral scrims under white type on the
  media, the one gradient the skill itself permits, plus the PLAN 12.1 metal underline),
  `button-fx` (the probe reads the metal underline on large links as a gradient-filled button).
  Defended warnings: `pinned-over-picture` and `long-pin` (the title belongs to its card and is
  covered by the next card, which the probe does not see), `palette-cream` (the museum wall).
  Fixed: `no-poster` (the glitch loop has the still as poster), `size-count` (card titles share
  the close's size; captions and the close's paragraph use the body size).
