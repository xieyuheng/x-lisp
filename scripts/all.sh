#!/usr/bin/env bash

set -e

./scripts/prepare.sh
./scripts/format.sh
./scripts/check.sh
./scripts/build.sh
./scripts/test.sh
