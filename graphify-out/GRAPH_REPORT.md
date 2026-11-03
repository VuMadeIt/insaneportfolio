# Graph Report - insaneportfolio  (2026-11-03)

## Corpus Check
- 108 files · ~42,160 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: .hdr 8, (none) 3, .css 1)

## Summary
- 560 nodes · 1144 edges · 35 communities (25 shown, 10 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `ce9c45ac`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- Cradle
- next
- Stage.tsx
- @playwright/test
- scripts
- AGENTS.md
- Credits
- Lucas Vu Portfolio: Master Plan
- calibrate.ts
- Decisions
- postcss.config.mjs
- .prettierrc.json
- serve.sh
- package.json
- analyse.py
- devDependencies
- Phases
- material.ts
- eslint-config-next
- choreography.ts
- Hero.tsx
- @types/react-dom@19.3.0
- PhysicsLab.tsx
- fetch.sh
- SOURCES.md
- cradle.ts
- @types/three@0.186.0
- Rope
- cradle.test.ts
- probe.ts
- media.sh
- tailwindcss@4.3.3
- @types/node@22.19.0

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 39 edges
2. `Vec3` - 26 edges
3. `next` - 20 edges
4. `react` - 20 edges
5. `@playwright/test` - 20 edges
6. `vec()` - 17 edges
7. `compilerOptions` - 17 edges
8. `three` - 15 edges
9. `CradleModel()` - 15 edges
10. `useLook` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 02: the real object (2026-11-02)` --references--> `frameFor()`  [INFERRED]
  DECISIONS.md → src/scene/framing.ts
- `Phase 04: identities (2026-11-03)` --references--> `withIdentity()`  [INFERRED]
  DECISIONS.md → src/scene/identities/material.ts

## Import Cycles
- None detected.

## Communities (35 total, 10 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.18
Nodes (11): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+3 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Cradle"
Cohesion: 0.16
Nodes (4): Cradle, clampTarget(), createHand(), copy()

### Community 3 - "next"
Cohesion: 0.08
Nodes (24): metadata, metadata, StillPage(), Stage, StillStage(), fraunces, metadata, viewport (+16 more)

### Community 4 - "Stage.tsx"
Cohesion: 0.06
Nodes (62): applyQuery(), deg(), ObjectLab(), metadata, ObjectLabPage(), zustand@5.0.16, react, @react-three/fiber (+54 more)

### Community 5 - "@playwright/test"
Cohesion: 0.05
Nodes (20): WALL, port, @playwright/test, sizes, [url, ms = "6000"], [name = "round", query = "t=3"], [dir, ...variants], [width, height] (+12 more)

### Community 6 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 7 - "AGENTS.md"
Cohesion: 0.29
Nodes (5): Commands, Conventions, Environment, Installed agent tools, This is NOT the Next.js you know

### Community 8 - "Credits"
Cohesion: 0.29
Nodes (6): Credits, Light and surfaces, Lucas's own material, Physics references, Sound (calibration and samples), Type

### Community 9 - "Lucas Vu Portfolio: Master Plan"
Cohesion: 0.05
Nodes (43): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth) (+35 more)

### Community 10 - "calibrate.ts"
Cohesion: 0.16
Nodes (13): Analysis, chains, first, pairMean(), recIntervals, recLevels, recPairs, results (+5 more)

### Community 11 - "Decisions"
Cohesion: 0.18
Nodes (10): Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below), Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03), Phase 04: identities (2026-11-03), Phase 05: story state (2026-11-03) (+2 more)

### Community 15 - "package.json"
Cohesion: 0.22
Nodes (8): @types/react@19.3.0, vitest@4.1.12, name, private, type, version, @types/react, vitest

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@9.39.4, leva@0.10.1, @playwright/test@1.64.1, prettier@3.9.10, @tailwindcss/postcss@4.3.3, typescript@6.0.3, eslint (+4 more)

### Community 18 - "Phases"
Cohesion: 0.20
Nodes (9): Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`), Phase 04: identities (`v0.4.0-identities`), Phase 05: story state (`v0.5.0-story`), Phase 06: site shell and home (`v0.6.0-home`), Phases (+1 more)

### Community 19 - "material.ts"
Cohesion: 0.13
Nodes (21): Ball(), IdentityLab(), IdentityLabPage(), metadata, experiments, ideas, identityCommon, people (+13 more)

### Community 20 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

### Community 21 - "choreography.ts"
Cohesion: 0.16
Nodes (19): dynamicParams, IdentityPage(), app, StoryController(), StoryPanel(), identities, Identity, IdentitySlug (+11 more)

### Community 22 - "Hero.tsx"
Cohesion: 0.19
Nodes (14): HeroLayout(), CradleStill(), GiantName(), Hero(), HeroCorners(), HeroName(), useStoryOpen(), hasWebGL2() (+6 more)

### Community 24 - "PhysicsLab.tsx"
Cohesion: 0.13
Nodes (16): metadata, PhysicsLabPage(), build(), COLORS, deg(), DESK, initial, Params (+8 more)

### Community 27 - "cradle.ts"
Cohesion: 0.27
Nodes (9): Body, solveContacts(), Hand, solveHand(), CollisionEvent, addScaled(), set(), sub() (+1 more)

### Community 29 - "Rope"
Cohesion: 0.20
Nodes (8): Rope, anchor, ropeLength(), settle(), clone(), distance(), lerp(), ropes

### Community 30 - "cradle.test.ts"
Cohesion: 0.17
Nodes (9): deg(), simulate(), withConfig(), maxPenetration(), lossless, measurePeriod(), runChain(), runFor() (+1 more)

### Community 31 - "probe.ts"
Cohesion: 0.29
Nodes (4): c, chains, db, e0

## Knowledge Gaps
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Stage.tsx` to `package.json`, `next`, `package.json`, `material.ts`, `choreography.ts`, `Hero.tsx`, `PhysicsLab.tsx`?**
  _High betweenness centrality (0.128) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `next` connect `next` to `package.json`, `Stage.tsx`, `package.json`, `choreography.ts`, `Hero.tsx`?**
  _High betweenness centrality (0.112) - this node is a cross-community bridge._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.07505285412262157 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `PhysicsLab.tsx` to `Lucas Vu Portfolio: Master Plan`, `Cradle`, `choreography.ts`, `cradle.test.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Should `Stage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0642570281124498 - nodes in this community are weakly interconnected._
- **Should `@playwright/test` be split into smaller, more focused modules?**
  _Cohesion score 0.05319148936170213 - nodes in this community are weakly interconnected._