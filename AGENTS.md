# AGENTS.md

Lucas Vu's portfolio. **Read `PLAN.md` before doing anything.** It is the source of truth for the
vision, architecture, phases, git workflow and the autonomous execution protocol.

## Environment
- Windows, Git Bash. Node 22, npm, Python 3.12 (numpy, OpenCV), ffmpeg 9.
- Browsers for testing/screenshots: Edge `C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe`,
  Chrome `%LOCALAPPDATA%/Google/Chrome/Application/chrome.exe`. Headless Edge needs
  `--user-data-dir=<temp dir>`; for WebGL in headless use `--use-angle=swiftshader --enable-unsafe-swiftshader`.
- Git remote: `origin https://github.com/VuMadeIt/insaneportfolio.git`. Never force-push.

## Installed agent tools
- **Graphify** (project skill `.devin/skills/graphify`, rule `.windsurf/rules/graphify.md`, git hooks
  rebuild the graph on commit). Run `graphify update .` after code changes.
- **Taste Skill** plugin (`/taste-skill:taste-skill`): use its process and its `lint.mjs` / `inspect.mjs`
  scripts. Its house rules are overridden where PLAN.md Part 5 says so.
- **Ponytail** and **Caveman** plugins are always on. Ponytail's "smallest change" applies to code
  size and simplicity, never to skipping scope or quality required by PLAN.md. Caveman keeps chat
  terse; written files (PLAN, DECISIONS, REPORT, copy) stay in full sentences.

## Commands
To be filled in during Phase 00 (dev, build, start, typecheck, lint, test, e2e).

## Conventions
- Physics in `src/physics` is pure TypeScript: no three.js, React, or UI-state imports.
- Visual changes never alter physics (mass, collider, string length).
- No rounded corners, one typeface (Fraunces), no em dashes in site copy.
- Conventional Commits; one branch per phase; annotated tag per merged phase.
