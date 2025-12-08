#!/usr/bin/env bash

set -e

make --directory projects/helpers.c clean
make --directory projects/runtime.c clean
make --directory projects/cmd.c clean
make --directory projects/x-forth.c clean

pnpm run -r --parallel --aggregate-output clean
