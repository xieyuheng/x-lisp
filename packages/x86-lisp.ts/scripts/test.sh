#!/usr/bin/env bash

set -e

node --test src/**/*.test.ts

./scripts/test-encoding.sh
./scripts/test-semantics.sh
