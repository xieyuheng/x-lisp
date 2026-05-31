#!/usr/bin/env bash

set -e

./scripts/build.sh
./scripts/self-build.sh
git diff --no-index expected/dump/ self-expected/dump/
