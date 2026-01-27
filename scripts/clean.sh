#!/usr/bin/env bash

set -e

make --directory projects/helpers.c clean
make --directory projects/x-lisp-runtime.c clean
make --directory projects/cmd.c clean
make --directory projects/x-forth.c clean
make --directory projects/basic-lisp.c clean

pnpm run -r clean
