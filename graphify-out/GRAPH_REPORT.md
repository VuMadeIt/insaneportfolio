# Graph Report - insaneportfolio  (2026-11-04)

## Corpus Check
- 145 files · ~79,441 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 15 file(s) not represented in the graph (top: .hdr 8, (none) 3, .woff2 3)

## Summary
- 808 nodes · 1666 edges · 54 communities (41 shown, 13 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 42 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `790a08d4`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- cradle.ts
- compilerOptions
- config.ts
- Timeline.tsx
- material.ts
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
- package.json
- choreography.ts
- Cradle.tsx
- Rope
- projects.ts
- PhysicsLab.tsx
- cradle.test.ts
- slowmo.mjs
- sweep.mjs
- Cradle
- [slug]/page.tsx
- dependencies
- @types/react-dom@19.3.0
- Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict
- record-song.mjs
- screens.mjs
- scripts
- leva
- prettier@3.9.10
- eslint-config-next

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 42 edges
2. `react` - 32 edges
3. `next` - 28 edges
4. `@playwright/test` - 28 edges
5. `Vec3` - 26 edges
6. `Decisions` - 21 edges
7. `Phases` - 18 edges
8. `vec()` - 17 edges
9. `compilerOptions` - 17 edges
10. `three` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`)` --references--> `ExhibitMedia()`  [INFERRED]
  DECISIONS.md → src/components/ExhibitMedia.tsx
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 14: home v3 (2026-11-03)` --references--> `Hero()`  [INFERRED]
  DECISIONS.md → src/components/Hero.tsx

## Import Cycles
- None detected.

## Communities (54 total, 13 thin omitted)

### Community 0 - "cradle.ts"
Cohesion: 0.29
Nodes (9): Body, solveContacts(), Hand, solveHand(), CollisionEvent, addScaled(), set(), sub() (+1 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "config.ts"
Cohesion: 0.14
Nodes (11): c, chains, db, e0, WORDS, ConfigOverrides, CradleConfig, defaultConfig (+3 more)

### Community 3 - "Timeline.tsx"
Cohesion: 0.16
Nodes (22): AboutPage(), metadata, MovingLine(), endOf(), FULL, label(), lanes(), Logo() (+14 more)

### Community 4 - "material.ts"
Cohesion: 0.06
Nodes (44): Ball(), IdentityLab(), IdentityLabPage(), metadata, ObjectStage(), Scene, metadata, ObjectPage() (+36 more)

### Community 5 - "@playwright/test"
Cohesion: 0.17
Nodes (4): WALL, port, @playwright/test, [url, ms = "6000"]

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
Cohesion: 0.08
Nodes (23): 404 + footer reference (2026-11-03 evening), Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`), Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below), Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03) (+15 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.13
Nodes (10): sizes, [name = "round", query = "t=3"], SIZES, RECIPES, files, [route = "home", name = "scroll", steps = "8"], [width, height], shots (+2 more)

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@9.39.4, @playwright/test@1.64.1, tailwindcss@4.3.3, @types/node@22.19.0, @types/three@0.186.0, typescript@6.0.3, eslint (+4 more)

### Community 18 - "Phases"
Cohesion: 0.08
Nodes (25): Draft or unconfirmed content to check, Git, Morning to-dos, Open questions for Lucas, Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`) (+17 more)

### Community 19 - "Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict"
Cohesion: 0.20
Nodes (10): 13.1 Site-wide, 13.2 Slow motion (amends 12.7), 13.3 Work rows (home and /work), 13.4 Home, 13.5 About timeline (replaces 12.9's horizontal list), 13.6 Case studies: Ripple and Shufflr rewritten as deep case studies, 13.7 Verified outside sources (for the case studies), 13.8 How 13 relates to 12.10 (+2 more)

### Community 20 - "Part 4. The hero object in detail (highest priority)"
Cohesion: 0.18
Nodes (11): 3.3 The three layers (strict separation), 4.1 Physics (the most important part of the whole project), 4.2 Strings (must look and move like real fishing line), 4.3 Materials, light and wall (photographic realism), 4.4 Sound, 4.5 The four identities (remade in code), 4.6 The reveal (chrome -> identity) and its three variants, 4.7 Click choreography implementation (+3 more)

### Community 22 - "Lucas Vu Portfolio: Master Plan"
Cohesion: 0.20
Nodes (9): 3.1 Stack (pin exact versions; prefer releases published at least 7 days ago), 3.2 Folder structure, Lucas Vu Portfolio: Master Plan, Part 10. Phases, Part 11. Open questions for Lucas (do not block on these; defaults in brackets), Part 3. Technical architecture, Part 5. Design system, Part 7. Responsive, accessibility, performance, fallbacks (+1 more)

### Community 23 - "Part 6. Pages"
Cohesion: 0.29
Nodes (7): 6.1 Home `/`, 6.2 Identity routes `/people` etc., 6.3 All work `/work` (the catalogue), 6.4 Case study `/work/[slug]`, 6.5 About `/about` (the museum room), 6.6 Shared, Part 6. Pages

### Community 24 - "app/layout.tsx"
Cohesion: 0.10
Nodes (18): metadata, metadata, StillPage(), Stage, StillStage(), cabinetGrotesk, generalSans, metadata (+10 more)

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
Cohesion: 0.10
Nodes (25): Phase 15: revision 4 (2026-11-03 evening), vitest@4.1.12, vitest, [target, out, width = "1440", height = "900"], chainClacks(), clack(), isMuted(), listeners (+17 more)

### Community 32 - "media.sh"
Cohesion: 0.80
Nodes (5): clip(), enc(), poster(), media.sh script, video()

### Community 33 - "Visual inspo (not shipped)"
Cohesion: 0.40
Nodes (4): Earlier inspo (still useful; lower priority than USE NOW), Footer reference (2026-11-03 evening) — USE for footer layout, USE NOW (2026-11-03 afternoon) — apply immediately, Visual inspo (not shipped)

### Community 34 - "package.json"
Cohesion: 0.22
Nodes (8): @tailwindcss/postcss@4.3.3, @types/react@19.3.0, name, private, type, version, @tailwindcss/postcss, @types/react

### Community 35 - "choreography.ts"
Cohesion: 0.09
Nodes (35): metadata, ObjectLabPage(), metadata, NotFound(), dynamicParams, IdentityPage(), HeroLayout(), Phase 14: home v3 (2026-11-03) (+27 more)

### Community 36 - "Cradle.tsx"
Cohesion: 0.08
Nodes (50): applyQuery(), deg(), ObjectLab(), @react-three/fiber, three, CradleModel(), UP, useHardware() (+42 more)

### Community 37 - "Rope"
Cohesion: 0.22
Nodes (7): Rope, anchor, ropeLength(), settle(), clone(), distance(), lerp()

### Community 38 - "projects.ts"
Cohesion: 0.09
Nodes (26): HomePage(), PagesLayout(), metadata, WorkPage(), Footer(), ICONS, HomeAbout(), format (+18 more)

### Community 39 - "PhysicsLab.tsx"
Cohesion: 0.20
Nodes (11): metadata, PhysicsLabPage(), build(), COLORS, deg(), DESK, initial, Params (+3 more)

### Community 40 - "cradle.test.ts"
Cohesion: 0.27
Nodes (6): maxPenetration(), lossless, measurePeriod(), runChain(), runFor(), untilImpact()

### Community 41 - "slowmo.mjs"
Cohesion: 0.67
Nodes (3): balls, centre(), speed()

### Community 43 - "Cradle"
Cohesion: 0.15
Nodes (6): simulate(), Cradle, clampTarget(), createHand(), copy(), run()

### Community 44 - "[slug]/page.tsx"
Cohesion: 0.07
Nodes (50): BlockView(), CaseStudyPage(), dynamicParams, Figure(), generateMetadata(), group(), grouped(), PANELLED (+42 more)

### Community 45 - "dependencies"
Cohesion: 0.14
Nodes (14): dependencies, gsap@3.15.0, lenis@1.3.27, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2 (+6 more)

### Community 47 - "Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict"
Cohesion: 0.25
Nodes (8): 14.1 Voice, 14.2 Type, 14.3 Nav (replaces 13.1's nav), 14.4 Footer (replaces 13.4's physics footer and 12.10's layout), 14.5 Home, 14.6 Work, 14.7 Case studies and About, Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict

### Community 50 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 54 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

## Knowledge Gaps
- **13 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `[slug]/page.tsx` to `package.json`, `choreography.ts`, `material.ts`, `Cradle.tsx`, `config.ts`, `PhysicsLab.tsx`, `Timeline.tsx`, `projects.ts`, `dependencies`, `app/layout.tsx`, `clack.ts`?**
  _High betweenness centrality (0.228) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `Lucas Vu Portfolio: Master Plan` connect `Lucas Vu Portfolio: Master Plan` to `Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict`, `Part 2. Research findings (do not redo; use)`, `Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict`, `Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict`, `Part 4. The hero object in detail (highest priority)`, `Part 6. Pages`, `Part 1. The vision (non-negotiable)`, `Part 9. Execution protocol for the autonomous run`?**
  _High betweenness centrality (0.123) - this node is a cross-community bridge._
- **Should `config.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13970588235294118 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `PhysicsLab.tsx` to `choreography.ts`, `config.ts`, `Cradle`, `Lucas Vu Portfolio: Master Plan`?**
  _High betweenness centrality (0.121) - this node is a cross-community bridge._
- **Should `material.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.06493506493506493 - nodes in this community are weakly interconnected._
- **Should `Decisions` be split into smaller, more focused modules?**
  _Cohesion score 0.08333333333333333 - nodes in this community are weakly interconnected._