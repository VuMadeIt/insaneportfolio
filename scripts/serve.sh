#!/usr/bin/env bash
# Rebuild and (re)start the production server on $PORT (default 3100). Kills any old listener first,
# because a killed shell on Windows can leave `next start` running and serving a stale build.
# The lab build: PORT=3400 LAB=1 NEXT_DIST_DIR=.artifacts/next-lab bash scripts/serve.sh
set -euo pipefail
PORT="${PORT:-3100}"
for pid in $(netstat -ano | grep -E ":${PORT} .*LISTENING" | awk '{print $5}' | sort -u); do
  taskkill //F //PID "$pid" >/dev/null
done
[ "${SKIP_BUILD:-0}" = "1" ] || npx next build
nohup npx next start -p "$PORT" >".artifacts/server-${PORT}.log" 2>&1 &
for _ in $(seq 1 60); do curl -sf "http://localhost:${PORT}" >/dev/null && exit 0; sleep 1; done
echo "server did not start" >&2
exit 1
