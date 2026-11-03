# Graph Report - insaneportfolio  (2026-11-02)

## Corpus Check
- 35 files · ~16,521 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 283 nodes · 458 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0e8b098b`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- cradle.ts
- layout.tsx
- page.tsx
- cradle.test.ts
- scripts
- AGENTS.md
- Credits
- Lucas Vu Portfolio: Master Plan
- calibrate.ts
- Decisions
- postcss.config.mjs
- .prettierrc.json
- serve.sh
- Cradle
- analyse.py

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 35 edges
2. `Vec3` - 21 edges
3. `compilerOptions` - 17 edges
4. `copy()` - 13 edges
5. `Lucas Vu Portfolio: Master Plan` - 12 edges
6. `Rope` - 9 edges
7. `lerp()` - 9 edges
8. `distance()` - 9 edges
9. `Part 4. The hero object in detail (highest priority)` - 9 edges
10. `scripts` - 9 edges

## Surprising Connections (you probably didn't know these)
- `simulate()` --calls--> `Cradle`  [EXTRACTED]
  scripts/physics/calibrate.ts → src/physics/cradle.ts
- `simulate()` --calls--> `withConfig()`  [EXTRACTED]
  scripts/physics/calibrate.ts → src/physics/config.ts
- `HomePage()` --calls--> `CradleStill()`  [EXTRACTED]
  app/(site)/page.tsx → src/components/CradleStill.tsx
- `HomePage()` --calls--> `Hero()`  [EXTRACTED]
  app/(site)/page.tsx → src/components/Hero.tsx
- `Cradle` --references--> `Body`  [EXTRACTED]
  src/physics/cradle.ts → src/physics/body.ts

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.05
Nodes (46): config, dependencies, gsap@3.15.0, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0 (+38 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "cradle.ts"
Cohesion: 0.14
Nodes (20): Body, solveContacts(), clampTarget(), createHand(), Hand, solveHand(), CollisionEvent, Rope (+12 more)

### Community 3 - "layout.tsx"
Cohesion: 0.20
Nodes (6): fraunces, metadata, viewport, nextConfig, next@16.4.3, next

### Community 4 - "page.tsx"
Cohesion: 0.39
Nodes (5): HomePage(), BALLS, CradleStill(), GiantName(), Hero()

### Community 5 - "cradle.test.ts"
Cohesion: 0.09
Nodes (14): zustand@5.0.16, zustand, [tag = "dev", ...paths], widths, maxPenetration(), lossless, measurePeriod(), runChain() (+6 more)

### Community 6 - "scripts"
Cohesion: 0.22
Nodes (9): scripts, build, dev, e2e, format, lint, start, test (+1 more)

### Community 7 - "AGENTS.md"
Cohesion: 0.33
Nodes (4): Commands, Conventions, Environment, Installed agent tools

### Community 8 - "Credits"
Cohesion: 0.50
Nodes (3): Credits, Lucas's own material, Type

### Community 9 - "Lucas Vu Portfolio: Master Plan"
Cohesion: 0.05
Nodes (42): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth) (+34 more)

### Community 10 - "calibrate.ts"
Cohesion: 0.09
Nodes (22): Analysis, chains, deg(), first, pairMean(), recIntervals, recLevels, recPairs (+14 more)

### Community 16 - "analyse.py"
Cohesion: 0.31
Nodes (3): analyse(), decode(), onsets()

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `package.json` to `cradle.ts`, `cradle.test.ts`?**
  _High betweenness centrality (0.172) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.05279034690799397 - nodes in this community are weakly interconnected._
- **Why does `Cradle` connect `Cradle` to `calibrate.ts`, `cradle.ts`, `cradle.test.ts`?**
  _High betweenness centrality (0.098) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `cradle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14439946018893388 - nodes in this community are weakly interconnected._
- **Should `cradle.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.09420289855072464 - nodes in this community are weakly interconnected._