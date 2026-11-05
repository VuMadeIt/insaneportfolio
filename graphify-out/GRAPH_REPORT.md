# Graph Report - insaneportfolio  (2026-11-05)

## Corpus Check
- 160 files · ~90,279 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 16 file(s) not represented in the graph (top: .hdr 8, (none) 3, .woff2 3)

## Summary
- 921 nodes · 1906 edges · 61 communities (49 shown, 12 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 51 edges (avg confidence: 0.89)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `cbdd871c`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- choreography.ts
- compilerOptions
- PhysicsLab.tsx
- next
- material.ts
- @playwright/test
- Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict
- dependencies
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
- clack.ts
- fetch.sh
- SOURCES.md
- story.mjs
- vec.ts
- Part 9. Execution protocol for the autonomous run
- lab-shots.mjs
- scripts
- media.sh
- Visual inspo (not shipped)
- Timeline.tsx
- projects.ts
- Cradle.tsx
- HeroStage.tsx
- cradle.ts
- eslint-config-next
- cradle.test.ts
- slowmo.mjs
- sweep.mjs
- Cradle
- Visual.tsx
- Part 3. Technical architecture
- MovingLine.tsx
- Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict
- menu-film.mjs
- Part 15. Revision 6 (Lucas, 2026-11-05). Overrides Parts 1-14 where they conflict
- [slug]/page.tsx
- probe.ts
- scroll.mjs
- timeline-shots.mjs
- og.mjs
- types.ts
- package.json
- prettier@3.9.10
- StillStage.tsx
- @types/react-dom@19.3.0
- @types/three@0.186.0

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 42 edges
2. `react` - 37 edges
3. `@playwright/test` - 32 edges
4. `next` - 31 edges
5. `Vec3` - 26 edges
6. `Decisions` - 22 edges
7. `vec()` - 19 edges
8. `Phases` - 18 edges
9. `compilerOptions` - 17 edges
10. `CradleModel()` - 16 edges

## Surprising Connections (you probably didn't know these)
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`)` --references--> `ExhibitMedia()`  [INFERRED]
  DECISIONS.md → src/components/ExhibitMedia.tsx
- `About, part 2 (2026-11-05 night)` --references--> `scrollToY()`  [INFERRED]
  DECISIONS.md → src/components/ScrollMotion.tsx
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx

## Import Cycles
- None detected.

## Communities (61 total, 12 thin omitted)

### Community 0 - "choreography.ts"
Cohesion: 0.13
Nodes (23): dynamicParams, IdentityPage(), About, part 2 (2026-11-05 night), Revision 6 (2026-11-05), Revision 6 follow-up: making sure every animation shows (2026-11-05 evening), Revision 6, part 3 (2026-11-05 night), Revision 6, part 4 (2026-11-05 night), app (+15 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "PhysicsLab.tsx"
Cohesion: 0.13
Nodes (15): metadata, PhysicsLabPage(), COLORS, deg(), DESK, initial, Params, PhysicsLab() (+7 more)

### Community 3 - "next"
Cohesion: 0.22
Nodes (4): metadata, nextConfig, next, HomeAbout()

### Community 4 - "material.ts"
Cohesion: 0.11
Nodes (26): ObjectStage(), Scene, metadata, ObjectPage(), AirPods(), Balls(), canvasTexture(), Cash() (+18 more)

### Community 5 - "@playwright/test"
Cohesion: 0.17
Nodes (4): WALL, port, @playwright/test, [url, ms = "6000"]

### Community 6 - "Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict"
Cohesion: 0.18
Nodes (11): 12.10 USE NOW refs (Lucas, 2026-11-03). Apply immediately; overrides 12.9 dark/contact copy and drag UI, 12.1 Typeface and style (from the old site, vumadeit.github.io/lucasvu, repo `VuMadeIt/lucasvu`), 12.2 Hero (follow `reference/inspo/lucas-vu-hero-mock.png`), 12.3 Nav (old `NavBar.jsx`, adapted), 12.4 Site-wide motion, 12.5 Work section: Folio Stack, cleaner, 12.6 Case studies: Caleb Wu's RevisionDojo (calebwu.ca/RevisionDojo), 12.7 Slow motion on hover (experimental, lab first) (+3 more)

### Community 7 - "dependencies"
Cohesion: 0.15
Nodes (13): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+5 more)

### Community 8 - "Credits"
Cohesion: 0.22
Nodes (8): Credits, Light and surfaces, Lucas's own material, Physics references, Revision 5, Revision 6, Sound (calibration and samples), Type

### Community 9 - "Part 2. Research findings (do not redo; use)"
Cohesion: 0.25
Nodes (8): 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth), 2.6 Physics research, 2.7 Reference assets found (use these, verify licences when downloading), Part 2. Research findings (do not redo; use)

### Community 10 - "calibrate.ts"
Cohesion: 0.14
Nodes (16): Analysis, chains, deg(), first, pairMean(), recIntervals, recLevels, recPairs (+8 more)

### Community 11 - "Decisions"
Cohesion: 0.05
Nodes (35): Commands, Conventions, Environment, Installed agent tools, This is NOT the Next.js you know, 404 + footer reference (2026-11-03 evening), Caleb Wu's RevisionDojo, filmed first (`.artifacts/caleb/sheet1.png`, `sheet2.png`, `text.txt`), Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below) (+27 more)

### Community 15 - "ref_node_fs"
Cohesion: 0.13
Nodes (9): sizes, [name = "round", query = "t=3"], SIZES, RECIPES, rate, stamps, [tag = "dev", ...paths], widths (+1 more)

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@9.39.4, leva@0.10.1, @playwright/test@1.64.1, @tailwindcss/postcss@4.3.3, @types/react@19.3.0, typescript@6.0.3, eslint (+4 more)

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
Cohesion: 0.18
Nodes (10): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), Lucas Vu Portfolio: Master Plan, Part 10. Phases, Part 11. Open questions for Lucas (do not block on these; defaults in brackets), Part 1. The vision (non-negotiable), Part 5. Design system (+2 more)

### Community 23 - "Part 6. Pages"
Cohesion: 0.29
Nodes (7): 6.1 Home `/`, 6.2 Identity routes `/people` etc., 6.3 All work `/work` (the catalogue), 6.4 Case study `/work/[slug]`, 6.5 About `/about` (the museum room), 6.6 Shared, Part 6. Pages

### Community 24 - "clack.ts"
Cohesion: 0.07
Nodes (32): PagesLayout(), Phase 15: revision 4 (2026-11-03 evening), vitest@4.1.12, vitest, [target, out, width = "1440", height = "900"], chainClacks(), clack(), isMuted() (+24 more)

### Community 27 - "story.mjs"
Cohesion: 0.33
Nodes (5): frames, [name = "People", port = "3100"], t0, [width, height], [x, y]

### Community 28 - "vec.ts"
Cohesion: 0.23
Nodes (6): Rope, anchor, ropeLength(), settle(), distance(), lerp()

### Community 29 - "Part 9. Execution protocol for the autonomous run"
Cohesion: 0.50
Nodes (4): 9.1 Rules of engagement, 9.2 Logs the agent maintains, 9.3 Gates (run before every phase merge), Part 9. Execution protocol for the autonomous run

### Community 31 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 32 - "media.sh"
Cohesion: 0.80
Nodes (5): clip(), enc(), poster(), media.sh script, video()

### Community 33 - "Visual inspo (not shipped)"
Cohesion: 0.33
Nodes (5): Earlier inspo (still useful; lower priority than USE NOW), Footer reference (2026-11-03 evening) — USE for footer layout, Hero / grade (2026-11-05), USE NOW (2026-11-03 afternoon) — apply immediately, Visual inspo (not shipped)

### Community 34 - "Timeline.tsx"
Cohesion: 0.08
Nodes (38): cabinetGrotesk, generalSans, metadata, RootLayout(), viewport, AboutPage(), metadata, lenis@1.3.27 (+30 more)

### Community 35 - "projects.ts"
Cohesion: 0.18
Nodes (16): metadata, WorkPage(), ExhibitMedia(), previewMedia(), WorkList(), caseStudies, allText, homeProjects (+8 more)

### Community 36 - "Cradle.tsx"
Cohesion: 0.05
Nodes (82): Ball(), IdentityLab(), IdentityLabPage(), metadata, applyQuery(), deg(), ObjectLab(), BOX (+74 more)

### Community 37 - "HeroStage.tsx"
Cohesion: 0.08
Nodes (35): metadata, ObjectLabPage(), metadata, TaglineLabPage(), TaglineEditions(), flex, fraunces, metadata (+27 more)

### Community 38 - "cradle.ts"
Cohesion: 0.23
Nodes (11): Body, solveContacts(), clampTarget(), createHand(), Hand, solveHand(), CollisionEvent, addScaled() (+3 more)

### Community 39 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

### Community 40 - "cradle.test.ts"
Cohesion: 0.24
Nodes (6): maxPenetration(), lossless, measurePeriod(), runChain(), runFor(), untilImpact()

### Community 41 - "slowmo.mjs"
Cohesion: 0.67
Nodes (3): balls, centre(), speed()

### Community 43 - "Cradle"
Cohesion: 0.19
Nodes (5): build(), Cradle, copy(), Vec3, run()

### Community 44 - "Visual.tsx"
Cohesion: 0.16
Nodes (25): Anatomy(), Bars(), Brief(), Check(), Compare(), Dash(), fill, Of (+17 more)

### Community 45 - "Part 3. Technical architecture"
Cohesion: 0.33
Nodes (6): 3.1 Stack (pin exact versions; prefer releases published at least 7 days ago), 3.2 Folder structure, 3.3 The three layers (strict separation), 4.1 Physics (the most important part of the whole project), Part 3. Technical architecture, BallSpec

### Community 46 - "MovingLine.tsx"
Cohesion: 0.16
Nodes (25): advance(), Axes, axesAt(), bisect(), bump(), cell(), clamp(), FILL (+17 more)

### Community 47 - "Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict"
Cohesion: 0.25
Nodes (8): 14.1 Voice, 14.2 Type, 14.3 Nav (replaces 13.1's nav), 14.4 Footer (replaces 13.4's physics footer and 12.10's layout), 14.5 Home, 14.6 Work, 14.7 Case studies and About, Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict

### Community 48 - "menu-film.mjs"
Cohesion: 0.40
Nodes (4): row, toggle, [url, tag, toggleSel = "button[aria-expanded], .NavigationBurger-button"], video

### Community 49 - "Part 15. Revision 6 (Lucas, 2026-11-05). Overrides Parts 1-14 where they conflict"
Cohesion: 0.13
Nodes (15): 15.10 Follow-up (Lucas, 2026-11-05 evening), 15.11 Revision 6, part 3 (Lucas, 2026-11-05 night). Overrides 15.1-15.10 where they conflict, 15.12 Revision 6, part 4 (Lucas, 2026-11-05 night), 15.14 Link preview, 15.15 About, part 2 (Lucas, 2026-11-05 night), 15.1 "Let's get things moving." (replaces 14.5's ball in the "o"), 15.2 Cursor (amends 13.1), 15.3 Nav and footer (amend 14.3, 14.4) (+7 more)

### Community 50 - "[slug]/page.tsx"
Cohesion: 0.23
Nodes (13): BlockView(), CaseStudyPage(), dynamicParams, Figure(), generateMetadata(), group(), grouped(), PANELLED (+5 more)

### Community 51 - "probe.ts"
Cohesion: 0.29
Nodes (4): c, chains, db, e0

### Community 52 - "scroll.mjs"
Cohesion: 0.50
Nodes (3): files, [route = "home", name = "scroll", steps = "8"], [width, height]

### Community 54 - "og.mjs"
Cohesion: 0.40
Nodes (4): angle, loop, peaks, xs

### Community 55 - "types.ts"
Cohesion: 0.25
Nodes (10): mapleLeaf, reboot, ripple, shufflr, Bar, Block, CaseStudy, DiagramNode (+2 more)

### Community 56 - "package.json"
Cohesion: 0.22
Nodes (8): tailwindcss@4.3.3, @types/node@22.19.0, name, private, type, version, tailwindcss, @types/node

### Community 58 - "StillStage.tsx"
Cohesion: 0.53
Nodes (4): metadata, StillPage(), Stage, StillStage()

## Knowledge Gaps
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Cradle.tsx` to `choreography.ts`, `PhysicsLab.tsx`, `Timeline.tsx`, `material.ts`, `HeroStage.tsx`, `projects.ts`, `dependencies`, `Visual.tsx`, `MovingLine.tsx`, `[slug]/page.tsx`, `package.json`, `clack.ts`, `StillStage.tsx`?**
  _High betweenness centrality (0.258) - this node is a cross-community bridge._
- **Should `choreography.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.12834224598930483 - nodes in this community are weakly interconnected._
- **Why does `Lucas Vu Portfolio: Master Plan` connect `Lucas Vu Portfolio: Master Plan` to `Part 12. Revision 2 (Lucas, 2026-11-03). Overrides Parts 1-11 where they conflict`, `Part 2. Research findings (do not redo; use)`, `Part 3. Technical architecture`, `Part 14. Revision 5 (Lucas, 2026-11-04). Overrides Parts 1-13 where they conflict`, `Part 15. Revision 6 (Lucas, 2026-11-05). Overrides Parts 1-14 where they conflict`, `Part 13. Revision 4 (Lucas, 2026-11-03 evening). Overrides Parts 1-12 where they conflict`, `Part 4. The hero object in detail (highest priority)`, `Part 6. Pages`, `Part 9. Execution protocol for the autonomous run`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `Cradle` to `choreography.ts`, `PhysicsLab.tsx`, `calibrate.ts`, `Lucas Vu Portfolio: Master Plan`?**
  _High betweenness centrality (0.137) - this node is a cross-community bridge._
- **Should `PhysicsLab.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13157894736842105 - nodes in this community are weakly interconnected._
- **Should `material.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.11174242424242424 - nodes in this community are weakly interconnected._