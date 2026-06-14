#!/usr/bin/env bash

set -e

node --test src/**/*.test.ts

./scripts/test-x86-encoding.sh
./scripts/test-x86-semantics.sh
./scripts/test-x86-exe.sh
