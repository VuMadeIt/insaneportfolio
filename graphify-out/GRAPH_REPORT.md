# Graph Report - insaneportfolio  (2026-11-02)

## Corpus Check
- 36 files · ~16,599 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 285 nodes · 459 edges · 26 communities (17 shown, 9 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 11 edges (avg confidence: 0.85)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `c8c06af8`
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
- devDependencies
- @playwright/test
- Part 4. The hero object in detail (highest priority)
- eslint-config-next
- vitest
- @types/react@19.3.0
- @types/three@0.186.0
- typescript@6.0.3
- fetch.sh

## God Nodes (most connected - your core abstractions)
1. `Cradle` - 35 edges
2. `Vec3` - 21 edges
3. `compilerOptions` - 17 edges
4. `copy()` - 13 edges
5. `Lucas Vu Portfolio: Master Plan` - 12 edges
6. `Rope` - 9 edges
7. `distance()` - 9 edges
8. `lerp()` - 9 edges
9. `scripts` - 9 edges
10. `Part 4. The hero object in detail (highest priority)` - 9 edges

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

## Communities (26 total, 9 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.14
Nodes (19): dependencies, gsap@3.15.0, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0, zustand@5.0.16 (+11 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "cradle.ts"
Cohesion: 0.15
Nodes (18): Body, solveContacts(), createHand(), Hand, solveHand(), CollisionEvent, Rope, anchor (+10 more)

### Community 3 - "layout.tsx"
Cohesion: 0.20
Nodes (6): fraunces, metadata, viewport, nextConfig, next@16.4.3, next

### Community 4 - "page.tsx"
Cohesion: 0.39
Nodes (5): HomePage(), BALLS, CradleStill(), GiantName(), Hero()

### Community 5 - "cradle.test.ts"
Cohesion: 0.13
Nodes (10): maxPenetration(), lossless, measurePeriod(), runChain(), runFor(), untilImpact(), Material, Reveal (+2 more)

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
Cohesion: 0.06
Nodes (33): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth) (+25 more)

### Community 10 - "calibrate.ts"
Cohesion: 0.09
Nodes (22): Analysis, chains, deg(), first, pairMean(), recIntervals, recLevels, recPairs (+14 more)

### Community 15 - "Cradle"
Cohesion: 0.19
Nodes (3): Cradle, clampTarget(), copy()

### Community 16 - "analyse.py"
Cohesion: 0.31
Nodes (3): analyse(), decode(), onsets()

### Community 17 - "devDependencies"
Cohesion: 0.13
Nodes (15): devDependencies, eslint@9.39.4, leva@0.10.1, prettier@3.9.10, tailwindcss@4.3.3, @tailwindcss/postcss@4.3.3, @types/node@22.19.0, @types/react-dom@19.3.0 (+7 more)

### Community 18 - "@playwright/test"
Cohesion: 0.22
Nodes (5): @playwright/test@1.64.1, port, @playwright/test, [tag = "dev", ...paths], widths

### Community 19 - "Part 4. The hero object in detail (highest priority)"
Cohesion: 0.22
Nodes (9): 4.1 Physics (the most important part of the whole project), 4.2 Strings (must look and move like real fishing line), 4.3 Materials, light and wall (photographic realism), 4.4 Sound, 4.5 The four identities (remade in code), 4.6 The reveal (chrome -> identity) and its three variants, 4.7 Click choreography implementation, 4.8 Identity copy (DRAFT; Lucas to edit; no em dashes) (+1 more)

### Community 20 - "eslint-config-next"
Cohesion: 0.50
Nodes (3): config, eslint-config-next@16.4.3, eslint-config-next

## Knowledge Gaps
- **9 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `vitest` connect `vitest` to `package.json`, `cradle.ts`, `cradle.test.ts`?**
  _High betweenness centrality (0.170) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1368421052631579 - nodes in this community are weakly interconnected._
- **Why does `Cradle` connect `Cradle` to `calibrate.ts`, `cradle.ts`, `cradle.test.ts`?**
  _High betweenness centrality (0.096) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.037) - this node is a cross-community bridge._
- **Should `cradle.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.14564564564564564 - nodes in this community are weakly interconnected._
- **Should `cradle.test.ts` be split into smaller, more focused modules?**
  _Cohesion score 0.13071895424836602 - nodes in this community are weakly interconnected._