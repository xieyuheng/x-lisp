#!/usr/bin/env bash

set -e

make --directory projects/helpers.c build -j
make --directory projects/x-lisp-runtime.c build -j
make --directory projects/cmd.c build -j
make --directory projects/x-lisp-forth.c build -j

pnpm run -r build
