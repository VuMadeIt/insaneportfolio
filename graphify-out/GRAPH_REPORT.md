# Graph Report - insaneportfolio  (2026-11-02)

## Corpus Check
- 20 files · ~8,902 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 4 file(s) not represented in the graph (top: (none) 3, .css 1)

## Summary
- 168 nodes · 185 edges · 17 communities (12 shown, 5 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ce5cb88`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- package.json
- compilerOptions
- dependencies
- layout.tsx
- page.tsx
- @playwright/test
- scripts
- AGENTS.md
- Credits
- Lucas Vu Portfolio: Master Plan
- vitest
- Decisions
- postcss.config.mjs
- .prettierrc.json
- serve.sh
- Part 4. The hero object in detail (highest priority)
- Part 6. Pages

## God Nodes (most connected - your core abstractions)
1. `compilerOptions` - 17 edges
2. `Lucas Vu Portfolio: Master Plan` - 12 edges
3. `scripts` - 9 edges
4. `Part 4. The hero object in detail (highest priority)` - 9 edges
5. `Part 2. Research findings (do not redo; use)` - 8 edges
6. `Part 6. Pages` - 7 edges
7. `@playwright/test` - 5 edges
8. `next` - 4 edges
9. `Hero()` - 4 edges
10. `Part 1. The vision (non-negotiable)` - 4 edges

## Surprising Connections (you probably didn't know these)
- `HomePage()` --calls--> `CradleStill()`  [EXTRACTED]
  app/(site)/page.tsx → src/components/CradleStill.tsx
- `HomePage()` --calls--> `Hero()`  [EXTRACTED]
  app/(site)/page.tsx → src/components/Hero.tsx
- `Hero()` --calls--> `GiantName()`  [EXTRACTED]
  src/components/Hero.tsx → src/components/GiantName.tsx

## Import Cycles
- None detected.

## Communities (17 total, 5 thin omitted)

### Community 0 - "package.json"
Cohesion: 0.09
Nodes (28): config, devDependencies, eslint@9.39.4, eslint-config-next@16.4.3, leva@0.10.1, prettier@3.9.10, tailwindcss@4.3.3, @tailwindcss/postcss@4.3.3 (+20 more)

### Community 1 - "compilerOptions"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 2 - "dependencies"
Cohesion: 0.13
Nodes (15): dependencies, gsap@3.15.0, react@19.3.1, react-dom@19.3.1, @react-three/drei@10.7.9, @react-three/fiber@9.8.2, three@0.186.0, zustand@5.0.16 (+7 more)

### Community 3 - "layout.tsx"
Cohesion: 0.20
Nodes (6): fraunces, metadata, viewport, nextConfig, next@16.4.3, next

### Community 4 - "page.tsx"
Cohesion: 0.39
Nodes (5): HomePage(), BALLS, CradleStill(), GiantName(), Hero()

### Community 5 - "@playwright/test"
Cohesion: 0.22
Nodes (5): @playwright/test@1.64.1, port, @playwright/test, [tag = "dev", ...paths], widths

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
Cohesion: 0.07
Nodes (26): 1.1 The feeling, 1.2 What Lucas asked for, verbatim decisions, 1.3 The click choreography (Lucas's own description, refined), 2.1 samfcheng.com, 2.2 calebwu.ca, 2.3 cathyyin.ca, 2.4 Rachel Chen (rachelchen.tech), case study framework, 2.5 Lucas's own material (the content source of truth) (+18 more)

### Community 15 - "Part 4. The hero object in detail (highest priority)"
Cohesion: 0.22
Nodes (9): 4.1 Physics (the most important part of the whole project), 4.2 Strings (must look and move like real fishing line), 4.3 Materials, light and wall (photographic realism), 4.4 Sound, 4.5 The four identities (remade in code), 4.6 The reveal (chrome -> identity) and its three variants, 4.7 Click choreography implementation, 4.8 Identity copy (DRAFT; Lucas to edit; no em dashes) (+1 more)

### Community 16 - "Part 6. Pages"
Cohesion: 0.29
Nodes (7): 6.1 Home `/`, 6.2 Identity routes `/people` etc., 6.3 All work `/work` (the catalogue), 6.4 Case study `/work/[slug]`, 6.5 About `/about` (the museum room), 6.6 Shared, Part 6. Pages

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Lucas Vu Portfolio: Master Plan` connect `Lucas Vu Portfolio: Master Plan` to `Part 6. Pages`, `Part 4. The hero object in detail (highest priority)`?**
  _High betweenness centrality (0.055) - this node is a cross-community bridge._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.09195402298850575 - nodes in this community are weakly interconnected._
- **Why does `next` connect `layout.tsx` to `package.json`?**
  _High betweenness centrality (0.042) - this node is a cross-community bridge._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
- **Why does `scripts` connect `scripts` to `package.json`?**
  _High betweenness centrality (0.041) - this node is a cross-community bridge._
- **Should `dependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `Lucas Vu Portfolio: Master Plan` be split into smaller, more focused modules?**
  _Cohesion score 0.07407407407407407 - nodes in this community are weakly interconnected._