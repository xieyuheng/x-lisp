#!/usr/bin/env bash

set -e

make --directory projects/helpers.c clean
make --directory projects/cmd.c clean
make --directory projects/stack-lisp.c clean

pnpm run -r --parallel clean
