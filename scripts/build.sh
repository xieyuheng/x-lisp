#!/usr/bin/env bash

set -e

make --directory projects/helpers.c build -j
make --directory projects/cmd.c build -j
make --directory projects/x-forth.c build -j
make --directory projects/basic-lisp.c build -j

pnpm run -r build
