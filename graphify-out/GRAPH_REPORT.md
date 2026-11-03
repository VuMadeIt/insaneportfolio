# Graph Report - insaneportfolio  (2026-11-03)

## Corpus Check
- 123 files · ~49,680 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: .hdr 8, (none) 3, .css 1)

## Summary
- 615 nodes · 1262 edges · 30 communities (21 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 27 edges (avg confidence: 0.88)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `f2f54fd7`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [slug]/page.tsx
- compilerOptions
- Cradle
- next
- Stage.tsx
- @playwright/test
- StillStage.tsx
- AGENTS.md
- Credits
- Lucas Vu Portfolio: Master Plan
- calibrate.ts
- Decisions
- postcss.config.mjs
- .prettierrc.json
- serve.sh
- dependencies
- analyse.py
- devDependencies
- Phases
- material.ts
- package.json
- scripts
- eslint-config-next
- tailwindcss@4.3.3
- @types/three@0.186.0
- fetch.sh
- SOURCES.md
- @types/react-dom@19.3.0
- media.sh
- clack.ts

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 39 edges
2. `Vec3` - 26 edges
3. `next` - 23 edges
4. `@playwright/test` - 23 edges
5. `react` - 21 edges
6. `vec()` - 17 edges
7. `compilerOptions` - 17 edges
8. `CradleModel()` - 15 edges
9. `useLook` - 15 edges
10. `three` - 15 edges

## Surprising Connections (you probably didn't know these)
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 05: story state (2026-11-03)` --references--> `StoryController()`  [INFERRED]
  DECISIONS.md → src/components/StoryController.tsx
- `Phase 04: identities (2026-11-03)` --references--> `withIdentity()`  [INFERRED]
  DECISIONS.md → src/scene/identities/material.ts
- `Phase 02: the real object (2026-11-02)` --references--> `frameFor()`  [INFERRED]
  DECISIONS.md → src/scene/framing.ts

## Import Cycles
- None detected.

## Communities (30 total, 9 thin omitted)

### Community 0 - "[slug]/page.tsx"
Cohesion: 0.08
Nodes (34): HomePage(), AboutPage(), metadata, metadata, Row(), WorkPage(), Block(), CaseStudyPage() (+26 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "Cradle"
Cohesion: 0.05
Nodes (48): metadata, PhysicsLabPage(), build(), COLORS, deg(), DESK, initial, Params (+40 more)

### Community 3 - "next"
Cohesion: 0.07
Nodes (33): metadata, fraunces, metadata, viewport, metadata, NotFound(), dynamicParams, IdentityPage() (+25 more)

### Community 4 - "Stage.tsx"
Cohesion: 0.07
Nodes (69): applyQuery(), deg(), ObjectLab(), metadata, ObjectLabPage(), gsap, react, @react-three/fiber (+61 more)

### Community 5 - "@playwright/test"
Cohesion: 0.05
Nodes (21): WALL, port, @playwright/test, sizes, [url, ms = "6000"], [name = "round", query = "t=3"], [dir, ...variants], [width, height] (+13 more)

### Community 6 - "StillStage.tsx"
Cohesion: 0.53
Nodes (4): metadata, StillPage(), Stage, StillStage()

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
Cohesion: 0.15
Nodes (14): Analysis, chains, deg(), first, pairMean(), recIntervals, recLevels, recPairs (+6 more)

### Community 11 - "Decisions"
Cohesion: 0.14
Nodes (13): Compare-and-fix rounds (`.artifacts/identity/r1..r4.png`, render above, reference below), Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03), Phase 04: identities (2026-11-03), Phase 05: story state (2026-11-03) (+5 more)

### Community 15 - "dependencies"
Cohesion: 0.17
Nodes (12): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+4 more)

### Community 16 - "analyse.py"
Cohesion: 0.16
Nodes (4): analyse(), decode(), onsets(), cluster()

### Community 17 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@9.39.4, @playwright/test@1.64.1, prettier@3.9.10, @tailwindcss/postcss@4.3.3, @types/react@19.3.0, typescript@6.0.3, eslint (+4 more)

### Community 18 - "Phases"
Cohesion: 0.11
Nodes (18): Draft or unconfirmed content to check, Git, Morning to-dos, Open questions for Lucas, Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`) (+10 more)

### Community 19 - "material.ts"
Cohesion: 0.12
Nodes (23): Ball(), IdentityLab(), IdentityLabPage(), metadata, experiments, ideas, identityCommon, people (+15 more)

### Community 20 - "package.json"
Cohesion: 0.22
Nodes (8): leva@0.10.1, @types/node@22.19.0, name, private, type, version, leva, @types/node

### Community 21 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 22 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

### Community 38 - "clack.ts"
Cohesion: 0.16
Nodes (6): vitest@4.1.12, vitest, [target, out, width = "1440", height = "900"], chainClacks(), clack(), playImpacts()

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `next` connect `next` to `[slug]/page.tsx`, `Stage.tsx`, `StillStage.tsx`, `dependencies`, `package.json`?**
  _High betweenness centrality (0.135) - this node is a cross-community bridge._
- **Should `[slug]/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.07966457023060797 - nodes in this community are weakly interconnected._
- **Why does `react` connect `Stage.tsx` to `[slug]/page.tsx`, `Cradle`, `next`, `StillStage.tsx`, `dependencies`, `material.ts`, `package.json`?**
  _High betweenness centrality (0.133) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `@playwright/test` connect `@playwright/test` to `devDependencies`, `package.json`, `clack.ts`?**
  _High betweenness centrality (0.095) - this node is a cross-community bridge._
- **Should `Cradle` be split into smaller, more focused modules?**
  _Cohesion score 0.05090909090909091 - nodes in this community are weakly interconnected._
- **Should `next` be split into smaller, more focused modules?**
  _Cohesion score 0.06533575317604355 - nodes in this community are weakly interconnected._