#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test
make --directory projects/runtime.c test
make --directory projects/cmd.c test
make --directory projects/x-forth.c test

pnpm run -r --parallel --aggregate-output test
pnpm run -r --parallel --aggregate-output test:cli

bash scripts/test-suite.sh
