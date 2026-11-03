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
- `npm run dev` (dev server), `npm run build`, `npm run start`
- `npm run typecheck` (tsc), `npm run lint` (eslint + prettier check), `npm run format`
- `npm run test` (Vitest, physics acceptance tests in `src/physics/*.test.ts`)
- `npm run e2e` (Playwright on Edge against `next start -p 3100`; build first)
- `bash scripts/serve.sh` rebuilds and restarts the prod server on :3100 (kills stale listeners;
  `SKIP_BUILD=1` to only restart). Killing a shell on Windows does not kill `next start`.
- `node scripts/screens.mjs <tag> [route ...]` saves 1440/768/390 screenshots to
  `.artifacts/screens/<tag>/`. Routes have no leading slash (`home`, `people`, `work/shufflr`)
  because Git Bash rewrites `/x` arguments. `SETTLE=ms`, `FULL=1` for full page.
- Installs need `legacy-peer-deps` (set in `.npmrc`; npm 10.9 peer-set bug).

## Conventions
- Physics in `src/physics` is pure TypeScript: no three.js, React, or UI-state imports.
- Visual changes never alter physics (mass, collider, string length).
- No rounded corners, one typeface (Fraunces), no em dashes in site copy.
- Conventional Commits; one branch per phase; annotated tag per merged phase.
