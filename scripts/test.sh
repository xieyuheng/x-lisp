#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test -j
make --directory projects/runtime.c test -j
make --directory projects/cmd.c test -j
make --directory projects/x-lisp-forth.c test -j

pnpm run -r test
pnpm run -r test:cli
