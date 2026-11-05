# Graph Report - insaneportfolio  (2026-11-03)

## Corpus Check
- 142 files · ~76,236 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .hdr 8, (none) 3, .woff2 3)

## Summary
- 793 nodes · 1646 edges · 45 communities (37 shown, 8 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 47 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `6c2ae077`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- scroll.mjs
- compilerOptions
- slowmo.ts
- Timeline.tsx
- @playwright/test
- Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict
- AGENTS.md
- Credits
- Part 2. Research findings (do not redo; use)
- calibrate.ts
- Decisions
- postcss.config.mjs
- .prettierrc.json
- serve.sh
- ref_node_fs
- analyse.py
- devDependencies
- Phases
- Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict
- Part 4. The hero object in detail (highest priority)
- Lucas Vu Portfolio: Master Plan
- Part 6. Pages
- app/layout.tsx
- fetch.sh
- SOURCES.md
- story.mjs
- Part 1. The vision (non-negotiable)
- Part 9. Execution protocol for the autonomous run
- lab-shots.mjs
- clack.ts
- media.sh
- Visual inspo (not shipped)
- choreography.ts
- Cradle.tsx
- next
- Part 3. Technical architecture
- slowmo.mjs
- sweep.mjs
- Cradle
- [slug]/page.tsx
- dependencies
- scripts
- check-footer.mjs
- eslint-config-next

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 42 edges
2. `react` - 29 edges
3. `next` - 27 edges
4. `@playwright/test` - 27 edges
5. `Vec3` - 26 edges
6. `Decisions` - 19 edges
7. `Phases` - 18 edges
8. `vec()` - 17 edges
9. `Visual()` - 17 edges
10. `compilerOptions` - 17 edges

## Surprising Connections (you probably didn't know these)
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`)` --references--> `ExhibitMedia()`  [INFERRED]
  DECISIONS.md → src/components/ExhibitMedia.tsx
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Phase 02: the real object (2026-11-02)` --references--> `frameFor()`  [INFERRED]
  DECISIONS.md → src/scene/framing.ts

## Import Cycles
- None detected.

## Communities (45 total, 8 thin omitted)

### Community 0 - "scroll.mjs"
Cohesion: 0.50
Nodes (3): files, [route = "home", name = "scroll", steps = "8"], [width, height]

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "slowmo.ts"
Cohesion: 0.18
Nodes (12): vitest@4.1.12, vitest, [target, out, width = "1440", height = "900"], playWhoosh(), advanceClock(), HOLD, reducedMotion(), restoreTime() (+4 more)

### Community 3 - "Timeline.tsx"
Cohesion: 0.17
Nodes (21): AboutPage(), metadata, endOf(), FULL, label(), lanes(), Logo(), m() (+13 more)

### Community 5 - "@playwright/test"
Cohesion: 0.13
Nodes (6): WALL, port, @playwright/test, [url, ms = "6000"], [tag = "dev", ...paths], widths

### Community 6 - "Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict"
Cohesion: 0.18
Nodes (11): 12.10 USE NOW refs (Lucas, 2026-11-03). Apply immediately; overrides 12.9 dark/contact copy and drag UI, 12.1 Typeface and style (from the old site, vumadeit.github.io/lucasvu, repo `VuMadeIt/lucasvu`), 12.2 Hero (follow `reference/inspo/lucas-vu-hero-mock.png`), 12.3 Nav (old `NavBar.jsx`, adapted), 12.4 Site-wide motion, 12.5 Work section: Folio Stack, cleaner, 12.6 Case studies: Caleb Wu's RevisionDojo (calebwu.ca/RevisionDojo), 12.7 Slow motion on hover (experimental, lab first) (+3 more)

### Community 7 - "AGENTS.md"
Cohesion: 0.29
Nodes (5): Commands, Conventions, Environment, Installed agent tools, This is NOT the Next.js you know

### Community 8 - "Credits"
Cohesion: 0.29
Nodes (6): Credits, Light and surfaces, Lucas's own material, Physics references, Sound (calibration and samples), Type

### Community 9 - "Part 2. Research findings (do not redo; use)"
Cohesion: 0.25
Nodes (8): 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth), 2.6 Physics research, 2.7 Reference assets found (use these, verify licences when downloading), Part 2. Research findings (do not redo; use)

### Community 10 - "calibrate.ts"
Cohesion: 0.15
Nodes (14): Analysis, chains, deg(), first, pairMean(), recIntervals, recLevels, recPairs (+6 more)

### Community 11 - "Decisions"
Cohesion: 0.09
Nodes (21): Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`), Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below), Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03), Phase 04: identities (2026-11-03) (+13 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.17
Nodes (7): sizes, [name = "round", query = "t=3"], rate, stamps, shots, files, [width, height]

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "devDependencies"
Cohesion: 0.10
Nodes (26): devDependencies, eslint@9.39.4, leva@0.10.1, @playwright/test@1.64.1, prettier@3.9.10, tailwindcss@4.3.3, @tailwindcss/postcss@4.3.3, @types/node@22.19.0 (+18 more)

### Community 18 - "Phases"
Cohesion: 0.08
Nodes (25): Draft or unconfirmed content to check, Git, Morning to-dos, Open questions for Lucas, Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`) (+17 more)

### Community 19 - "Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict"
Cohesion: 0.20
Nodes (10): 13.1 Site-wide, 13.2 Slow motion (amends 12.7), 13.3 Work rows (home and /work), 13.4 Home, 13.5 About timeline (replaces 12.9's horizontal list), 13.6 Case studies: Ripple and Shufflr rewritten as deep case studies, 13.7 Verified outside sources (for the case studies), 13.8 How 13 relates to 12.10 (+2 more)

### Community 20 - "Part 4. The hero object in detail (highest priority)"
Cohesion: 0.25
Nodes (8): 4.2 Strings (must look and move like real fishing line), 4.3 Materials, light and wall (photographic realism), 4.4 Sound, 4.5 The four identities (remade in code), 4.6 The reveal (chrome -> identity) and its three variants, 4.7 Click choreography implementation, 4.8 Identity copy (DRAFT; Lucas to edit; no em dashes), Part 4. The hero object in detail (highest priority)

### Community 22 - "Lucas Vu Portfolio: Master Plan"
Cohesion: 0.29
Nodes (6): Lucas Vu Portfolio: Master Plan, Part 10. Phases, Part 11. Open questions for Lucas (do not block on these; defaults in brackets), Part 5. Design system, Part 7. Responsive, accessibility, performance, fallbacks, Part 8. Git workflow (Lucas wants to see and recover every version)

### Community 23 - "Part 6. Pages"
Cohesion: 0.29
Nodes (7): 6.1 Home `/`, 6.2 Identity routes `/people` etc., 6.3 All work `/work` (the catalogue), 6.4 Case study `/work/[slug]`, 6.5 About `/about` (the museum room), 6.6 Shared, Part 6. Pages

### Community 24 - "app/layout.tsx"
Cohesion: 0.23
Nodes (9): cabinetGrotesk, generalSans, metadata, RootLayout(), viewport, lenis@1.3.27, lenis, reducedMotion() (+1 more)

### Community 27 - "story.mjs"
Cohesion: 0.33
Nodes (5): frames, [name = "People", port = "3100"], t0, [width, height], [x, y]

### Community 28 - "Part 1. The vision (non-negotiable)"
Cohesion: 0.50
Nodes (4): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), Part 1. The vision (non-negotiable)

### Community 29 - "Part 9. Execution protocol for the autonomous run"
Cohesion: 0.50
Nodes (4): 9.1 Rules of engagement, 9.2 Logs the agent maintains, 9.3 Gates (run before every phase merge), Part 9. Execution protocol for the autonomous run

### Community 31 - "clack.ts"
Cohesion: 0.07
Nodes (35): PagesLayout(), Phase 15: revision 4 (2026-11-03 evening), chainClacks(), clack(), isMuted(), listeners, playClack(), playImpacts() (+27 more)

### Community 32 - "media.sh"
Cohesion: 0.80
Nodes (5): clip(), enc(), poster(), media.sh script, video()

### Community 33 - "Visual inspo (not shipped)"
Cohesion: 0.50
Nodes (3): Earlier inspo (still useful; lower priority than USE NOW), USE NOW (2026-11-03 afternoon) — apply immediately, Visual inspo (not shipped)

### Community 35 - "choreography.ts"
Cohesion: 0.10
Nodes (31): metadata, NotFound(), dynamicParams, IdentityPage(), HeroLayout(), Phase 14: home v3 (2026-11-03), CradleStill(), GiantName() (+23 more)

### Community 36 - "Cradle.tsx"
Cohesion: 0.05
Nodes (80): Ball(), IdentityLab(), IdentityLabPage(), metadata, applyQuery(), deg(), ObjectLab(), metadata (+72 more)

### Community 38 - "next"
Cohesion: 0.06
Nodes (37): metadata, metadata, StillPage(), Stage, StillStage(), HomePage(), metadata, WorkPage() (+29 more)

### Community 40 - "Part 3. Technical architecture"
Cohesion: 0.33
Nodes (6): 3.1 Stack (pin exact versions; prefer releases published at least 7 days ago), 3.2 Folder structure, 3.3 The three layers (strict separation), 4.1 Physics (the most important part of the whole project), Part 3. Technical architecture, BallSpec

### Community 41 - "slowmo.mjs"
Cohesion: 0.67
Nodes (3): balls, centre(), speed()

### Community 43 - "Cradle"
Cohesion: 0.05
Nodes (49): metadata, PhysicsLabPage(), build(), COLORS, deg(), DESK, initial, Params (+41 more)

### Community 44 - "[slug]/page.tsx"
Cohesion: 0.11
Nodes (34): Anatomy(), Bars(), Brief(), Check(), Compare(), Dash(), fill, Fogg() (+26 more)

### Community 45 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+4 more)

### Community 50 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 52 - "check-footer.mjs"
Cohesion: 0.33
Nodes (5): before, email, footer, row, xs

### Community 54 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

## Knowledge Gaps
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Cradle.tsx` to `choreography.ts`, `Timeline.tsx`, `next`, `Cradle`, `[slug]/page.tsx`, `dependencies`, `devDependencies`, `app/layout.tsx`, `clack.ts`?**
  _High betweenness centrality (0.222) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `Lucas Vu Portfolio: Master Plan` connect `Lucas Vu Portfolio: Master Plan` to `Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict`, `Part 3. Technical architecture`, `Part 2. Research findings (do not redo; use)`, `Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict`, `Part 4. The hero object in detail (highest priority)`, `Part 6. Pages`, `Part 1. The vision (non-negotiable)`, `Part 9. Execution protocol for the autonomous run`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `@playwright/test` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `Cradle` to `Lucas Vu Portfolio: Master Plan`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `Decisions` be split into smaller, more focused modules?**
  _Cohesion score 0.09090909090909091 - nodes in this community are weakly interconnected._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.10256410256410256 - nodes in this community are weakly interconnected._