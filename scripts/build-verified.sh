#!/usr/bin/env bash
set -euo pipefail

script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

if [[ "${SITES_ENV_READY:-}" != "1" ]]; then
  exec bash "${script_dir}/sites-env.sh" -- bash "$0" "$@"
fi

command -v timeout || {
  echo "build-verified.sh requires GNU timeout." >&2
  exit 69
}

if [[ "${VERCEL:-}" == "1" ]]; then
  builder="${SITES_PROJECT_ROOT}/node_modules/.bin/next"
  builder_name="Next.js"
else
  builder="${SITES_PROJECT_ROOT}/node_modules/.bin/vinext"
  builder_name="vinext"
fi

if [[ ! -x "${builder}" ]]; then
  echo "${builder_name} is unavailable. Install dependencies before building." >&2
  exit 69
fi

echo "Running bounded ${builder_name} build..."
timeout \
  --signal=TERM \
  --kill-after="${SITES_BUILD_KILL_AFTER:-10s}" \
  "${SITES_BUILD_TIMEOUT:-3m}" \
  "${builder}" build
