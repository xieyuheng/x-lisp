#!/usr/bin/env bash

set -e

cd packages/std.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/cli.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
cd packages/meta-runtime.c; ./scripts/clean.sh; ./scripts/build.sh; cd ../..
