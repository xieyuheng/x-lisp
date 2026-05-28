#!/usr/bin/env bash

set -e

make --directory packages/helpers.c build -j
make --directory packages/cli.c build -j
make --directory packages/xvm.c build -j

pnpm run -r build
