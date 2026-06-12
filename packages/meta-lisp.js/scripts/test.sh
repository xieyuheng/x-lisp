#!/usr/bin/env bash

set -e

node --test src/**/*.test.ts

./scripts/test-x86-flat.sh
