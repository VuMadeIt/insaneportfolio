# Graph Report - insaneportfolio  (2026-11-03)

## Corpus Check
- 129 files · ~54,844 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .hdr 8, (none) 3, .woff2 3)

## Summary
- 654 nodes · 1352 edges · 43 communities (34 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 31 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `68696398`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- compilerOptions
- Cradle
- choreography.ts
- Stage.tsx
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
- package.json
- Phases
- material.ts
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
- scroll.mjs
- media.sh
- Visual inspo (not shipped)
- screens.mjs
- HeroStage.tsx
- dependencies
- StillStage.tsx
- slowmo.ts
- scripts
- eslint-config-next
- slowmo.mjs
- Part 3. Technical architecture

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 42 edges
2. `Vec3` - 26 edges
3. `@playwright/test` - 24 edges
4. `next` - 23 edges
5. `react` - 21 edges
6. `vec()` - 17 edges
7. `compilerOptions` - 17 edges
8. `CradleModel()` - 16 edges
9. `three` - 15 edges
10. `useLook` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Phase 02: the real object (2026-11-02)` --references--> `frameFor()`  [INFERRED]
  DECISIONS.md → src/scene/framing.ts
- `Phase 04: identities (2026-11-03)` --references--> `withIdentity()`  [INFERRED]
  DECISIONS.md → src/scene/identities/material.ts

## Import Cycles
- None detected.

## Communities (43 total, 9 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.07
Nodes (37): metadata, HomePage(), AboutPage(), metadata, metadata, Row(), WorkPage(), Block() (+29 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Cradle"
Cohesion: 0.05
Nodes (49): metadata, PhysicsLabPage(), build(), COLORS, deg(), DESK, initial, Params (+41 more)

### Community 3 - "choreography.ts"
Cohesion: 0.19
Nodes (17): dynamicParams, IdentityPage(), app, StoryController(), StoryPanel(), Identity, IdentitySlug, vec() (+9 more)

### Community 4 - "Stage.tsx"
Cohesion: 0.07
Nodes (59): applyQuery(), deg(), ObjectLab(), react, @react-three/fiber, three, chainClacks(), clack() (+51 more)

### Community 5 - "@playwright/test"
Cohesion: 0.17
Nodes (4): WALL, port, @playwright/test, [url, ms = "6000"]

### Community 6 - "Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict"
Cohesion: 0.22
Nodes (9): 12.1 Typeface and style (from the old site, vumadeit.github.io/lucasvu, repo `VuMadeIt/lucasvu`), 12.2 Hero (follow `reference/inspo/lucas-vu-hero-mock.png`), 12.3 Nav (old `NavBar.jsx`, adapted), 12.4 Site-wide motion, 12.5 Work section: Folio Stack, cleaner, 12.6 Case studies: Caleb Wu's RevisionDojo (calebwu.ca/RevisionDojo), 12.7 Slow motion on hover (experimental, lab first), 12.8 Phases for revision 2 (+1 more)

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
Cohesion: 0.16
Nodes (13): Analysis, chains, first, pairMean(), recIntervals, recLevels, recPairs, results (+5 more)

### Community 11 - "Decisions"
Cohesion: 0.12
Nodes (15): Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below), Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03), Phase 04: identities (2026-11-03), Phase 05: story state (2026-11-03) (+7 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.28
Nodes (3): sizes, [name = "round", query = "t=3"], shots

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "package.json"
Cohesion: 0.10
Nodes (26): devDependencies, eslint@9.39.4, leva@0.10.1, @playwright/test@1.64.1, prettier@3.9.10, tailwindcss@4.3.3, @tailwindcss/postcss@4.3.3, @types/node@22.19.0 (+18 more)

### Community 18 - "Phases"
Cohesion: 0.10
Nodes (20): Draft or unconfirmed content to check, Git, Morning to-dos, Open questions for Lucas, Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`) (+12 more)

### Community 19 - "material.ts"
Cohesion: 0.12
Nodes (23): Ball(), IdentityLab(), IdentityLabPage(), metadata, experiments, ideas, identityCommon, people (+15 more)

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

### Community 31 - "scroll.mjs"
Cohesion: 0.50
Nodes (3): files, [route = "home", name = "scroll", steps = "8"], [width, height]

### Community 34 - "screens.mjs"
Cohesion: 0.27
Nodes (4): [tag = "dev", ...paths], widths, routes, widths

### Community 35 - "HeroStage.tsx"
Cohesion: 0.13
Nodes (22): metadata, ObjectLabPage(), metadata, NotFound(), HeroLayout(), PagesLayout(), A(), Close() (+14 more)

### Community 36 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+5 more)

### Community 37 - "StillStage.tsx"
Cohesion: 0.53
Nodes (4): metadata, StillPage(), Stage, StillStage()

### Community 38 - "slowmo.ts"
Cohesion: 0.18
Nodes (11): vitest@4.1.12, vitest, [target, out, width = "1440", height = "900"], playWhoosh(), advanceClock(), reducedMotion(), restoreTime(), SLOW (+3 more)

### Community 39 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 40 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

### Community 41 - "slowmo.mjs"
Cohesion: 0.67
Nodes (3): balls, centre(), speed()

### Community 42 - "Part 3. Technical architecture"
Cohesion: 0.33
Nodes (6): 3.1 Stack (pin exact versions; prefer releases published at least 7 days ago), 3.2 Folder structure, 3.3 The three layers (strict separation), 4.1 Physics (the most important part of the whole project), Part 3. Technical architecture, BallSpec

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Stage.tsx` to `[slug]/page.tsx`, `Cradle`, `HeroStage.tsx`, `dependencies`, `StillStage.tsx`, `choreography.ts`, `package.json`, `material.ts`, `app/layout.tsx`?**
  _High betweenness centrality (0.132) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.06502816180235535 - nodes in this community are weakly interconnected._
- **Why does `next` connect `[slug]/page.tsx` to `choreography.ts`, `HeroStage.tsx`, `StillStage.tsx`, `dependencies`, `Stage.tsx`, `package.json`, `app/layout.tsx`?**
  _High betweenness centrality (0.122) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `Cradle` to `choreography.ts`, `Lucas Vu Portfolio: Master Plan`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `Cradle` be split into smaller, more focused modules?**
  _Cohesion score 0.05090909090909091 - nodes in this community are weakly interconnected._
- **Should `Stage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0680517916290274 - nodes in this community are weakly interconnected._