#!/usr/bin/env bash

set -e

make --directory packages/helpers.c clean
make --directory packages/cli.c clean
make --directory packages/xvm.c clean

pnpm run -r --parallel clean
