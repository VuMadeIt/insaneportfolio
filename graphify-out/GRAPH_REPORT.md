# Graph Report - insaneportfolio  (2026-11-03)

## Corpus Check
- 78 files · ~30,510 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 12 file(s) not represented in the graph (top: .hdr 8, (none) 3, .css 1)

## Summary
- 452 nodes · 862 edges · 28 communities (19 shown, 9 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 25 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `fe8fe3ae`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- cradle.ts
- HeroStage.tsx
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
- index.ts
- eslint-config-next
- tailwindcss@4.3.3
- @types/react@19.3.0
- @types/react-dom@19.3.0
- typescript@6.0.3
- fetch.sh
- SOURCES.md
- Cradle.tsx

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 38 edges
2. `Vec3` - 24 edges
3. `compilerOptions` - 17 edges
4. `@playwright/test` - 15 edges
5. `react` - 14 edges
6. `copy()` - 13 edges
7. `CradleModel()` - 13 edges
8. `useLook` - 13 edges
9. `three` - 12 edges
10. `vec()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Part 10. Phases` --references--> `build()`  [INFERRED]
  PLAN.md → app/lab/physics/PhysicsLab.tsx
- `Phase 03: interaction and sound (2026-11-03)` --references--> `requestRender()`  [INFERRED]
  DECISIONS.md → src/scene/world.ts
- `Phase 02: the real object (2026-11-02)` --references--> `frameFor()`  [INFERRED]
  DECISIONS.md → src/scene/framing.ts
- `3.3 The three layers (strict separation)` --references--> `BallSpec`  [INFERRED]
  PLAN.md → src/physics/config.ts
- `4.1 Physics (the most important part of the whole project)` --references--> `BallSpec`  [INFERRED]
  PLAN.md → src/physics/config.ts

## Import Cycles
- None detected.

## Communities (28 total, 9 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.15
Nodes (13): dependencies, gsap@3.15.0, next@16.4.3, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+5 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "cradle.ts"
Cohesion: 0.08
Nodes (30): build(), Body, CradleConfig, derive(), maxPenetration(), solveContacts(), Cradle, lossless (+22 more)

### Community 3 - "HeroStage.tsx"
Cohesion: 0.12
Nodes (14): metadata, fraunces, metadata, viewport, HomePage(), nextConfig, next, CradleStill() (+6 more)

### Community 4 - "Stage.tsx"
Cohesion: 0.09
Nodes (37): applyQuery(), deg(), ObjectLab(), Stage, metadata, ObjectLabPage(), metadata, StillPage() (+29 more)

### Community 5 - "@playwright/test"
Cohesion: 0.07
Nodes (11): WALL, port, @playwright/test, sizes, [url, ms = "6000"], [dir, ...variants], [width, height], [tag = "dev", ...paths] (+3 more)

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
Cohesion: 0.06
Nodes (33): metadata, PhysicsLabPage(), COLORS, deg(), DESK, initial, Params, PhysicsLab() (+25 more)

### Community 11 - "Decisions"
Cohesion: 0.29
Nodes (6): Decisions, Phase 00 (2026-11-02), Phase 01: physics (2026-11-02), Phase 02: the real object (2026-11-02), Phase 03: interaction and sound (2026-11-03), Realism review rounds (chrome)

### Community 15 - "package.json"
Cohesion: 0.22
Nodes (8): prettier@3.9.10, @types/node@22.19.0, name, private, type, version, prettier, @types/node

### Community 16 - "analyse.py"
Cohesion: 0.18
Nodes (3): analyse(), decode(), onsets()

### Community 17 - "devDependencies"
Cohesion: 0.17
Nodes (12): devDependencies, eslint@9.39.4, leva@0.10.1, @playwright/test@1.64.1, @tailwindcss/postcss@4.3.3, @types/three@0.186.0, vitest@4.1.12, eslint (+4 more)

### Community 18 - "Phases"
Cohesion: 0.29
Nodes (6): Phase 00: foundation (`v0.0.0-foundation`), Phase 01: physics (`v0.1.0-physics`), Phase 02: the real object (`v0.2.0-object`), Phase 03: interaction and sound (`v0.3.0-interaction`), Phases, Report

### Community 19 - "index.ts"
Cohesion: 0.36
Nodes (7): imperfectionMap(), withImperfections(), chrome(), CHROMIUM, darkMetal(), materialFactories, porcelain()

### Community 20 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

### Community 27 - "Cradle.tsx"
Cohesion: 0.10
Nodes (29): chainClacks(), clack(), playImpacts(), unlockAudio(), AccessibleTargets(), SoundToggle(), identities, Identity (+21 more)

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `Stage.tsx` to `package.json`, `HeroStage.tsx`, `calibrate.ts`, `package.json`, `Cradle.tsx`?**
  _High betweenness centrality (0.127) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `Cradle` connect `cradle.ts` to `calibrate.ts`, `Cradle.tsx`?**
  _High betweenness centrality (0.120) - this node is a cross-community bridge._
- **Should `cradle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.07552758237689744 - nodes in this community are weakly interconnected._
- **Why does `build()` connect `cradle.ts` to `Lucas Vu Portfolio: Master Plan`, `calibrate.ts`?**
  _High betweenness centrality (0.115) - this node is a cross-community bridge._
- **Should `HeroStage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.12 - nodes in this community are weakly interconnected._
- **Should `Stage.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.09308510638297872 - nodes in this community are weakly interconnected._