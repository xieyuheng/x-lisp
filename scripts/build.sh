#!/usr/bin/env bash

set -e

make --directory projects/helpers.c build -j
make --directory projects/cli.c build -j
make --directory projects/xvm.c build -j

pnpm run -r build
