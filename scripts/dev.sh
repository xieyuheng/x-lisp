#!/usr/bin/env bash

set -e

# bash scripts/format.sh
# bash scripts/clean.sh
# bash scripts/build.sh
# bash scripts/test.sh

make --directory projects/helpers.c clean
make --directory projects/helpers.c -j
make --directory projects/helpers.c test

make --directory projects/cmd.c clean
make --directory projects/cmd.c -j
make --directory projects/cmd.c test

make --directory projects/x-forth.c clean
make --directory projects/x-forth.c -j
make --directory projects/x-forth.c test
