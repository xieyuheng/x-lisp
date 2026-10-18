#!/usr/bin/env bash

set -euo pipefail

cd "$(dirname "$0")/.."
npx vitepress build . && npx wrangler deploy
