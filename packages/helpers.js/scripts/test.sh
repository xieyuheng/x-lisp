#!/usr/bin/env bash

set -e

if ls src/**/*.test.ts >/dev/null 2>&1; then
  bun test
fi
