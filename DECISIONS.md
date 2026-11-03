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
