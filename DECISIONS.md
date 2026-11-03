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
