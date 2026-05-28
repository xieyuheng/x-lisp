#!/usr/bin/env bash

set -e

./scripts/prepare.sh
./scripts/clean.sh
./scripts/format.sh
./scripts/build.sh
./scripts/test.sh
