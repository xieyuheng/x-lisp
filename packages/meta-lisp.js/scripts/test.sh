#!/usr/bin/env bash

set -e

node --test src/**/*.test.ts

./scripts/test-basic2.sh
./scripts/test-x86-encoding.sh
# ./scripts/test-x86-semantics.sh  # TODO: xexe loader is WIP
# ./scripts/test-x86-exe.sh
