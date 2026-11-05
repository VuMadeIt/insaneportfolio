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
- Browser scripts use the real GPU (`--enable-gpu`); `SWIFTSHADER=1` for software (0.7 fps, too slow
  for interaction tests). Wait for `load`, not `networkidle` (video loops never go idle).
- Visual review helpers: `scripts/lab-shots.mjs` (lab variants via query), `scripts/identity-shots.mjs`
  (identities vs references), `scripts/story.mjs` (films the choreography), `scripts/scroll.mjs`
  (scrolling contact sheet), `scripts/slowmo.mjs` (slow-motion speed ratio, dev server URL),
  `scripts/sweep.mjs` (all routes x 4 widths, console errors, overflow),
  `scripts/align.mjs` (still vs live canvas), `scripts/still.mjs` (re-render fallback stills; needs a
  dev server because /lab 404s in production). `scripts/sheet.py` resizes tiles to a fixed size:
  check raw files before judging proportions.
- Revision 4 checks: `PORT=3300 node scripts/timeline-shots.mjs` (timeline frames). How case
  studies are written and drawn: PLAN.md Part 13.6.
- Revision 5 assets: `PORT=3200 node scripts/objects.mjs [kind ...]` renders the nav's four balls,
  the ball in "moving" and the prize objects (gold, bronze, cash, airpods) from `/lab/object` into
  `public/media/objects` (needs a dev server). `node scripts/record-sites.mjs [sweaterify|liam-vu]`
  films the hover videos from the live sites.
- Revision 6: `PORT=3200 node scripts/moving-shots.mjs` films "Let's get things moving." under a
  moving pointer (desktop) and a scroll (phone) into `.artifacts/moving/`. Labs: `/lab/nav` (Haven
  menu) and `/lab/type?font=current|fraunces|general|cabinet|flex` (dev server only).
- A stale `next dev` from an old session blocks a new one ("Another next dev server is already
  running"); if it stops answering, kill the PID it prints.
- Physics probes: `npx jiti scripts/physics/probe.ts`, `npx jiti scripts/physics/calibrate.ts`.
- Taste gate: `node <taste>/scripts/inspect.mjs http://localhost:3100/<route> --allow shadow,rules,hairline,covered-text,late-title,button-fx,numbering,gradient`
  (allow-list reasons in DECISIONS.md, Phases 06, 09, 11 and 12).
- Editing after Prettier: re-read the file first; scripted string replacements silently miss
  reformatted lines.

## Conventions
- Physics in `src/physics` is pure TypeScript: no three.js, React, or UI-state imports.
- Visual changes never alter physics (mass, collider, string length).
- No em dashes in site copy. Type, corners, nav and accent colour follow PLAN.md Part 12
  (General Sans + Cabinet Grotesk, rounded corners allowed, `--metal` accent for microanimations only).
- Conventional Commits; one branch per phase; annotated tag per merged phase.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
