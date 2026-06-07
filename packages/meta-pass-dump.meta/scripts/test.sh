#!/usr/bin/env bash

set -e

./scripts/build.sh
./scripts/self-build.sh
./scripts/test-diff.sh
