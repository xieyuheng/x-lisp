#!/usr/bin/env bash

set -e

make --directory projects/helpers.c test -j
make --directory projects/cmd.c test -j
make --directory projects/li.c test -j

pnpm run -r --parallel test
pnpm run -r --parallel test:cli

cd projects/meta-lisp.meta; bash scripts/test.sh; cd ../..
