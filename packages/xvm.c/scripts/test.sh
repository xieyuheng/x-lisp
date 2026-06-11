#!/usr/bin/env bash

set -e

make test

./scripts/test-xasm.sh
./scripts/test-xexe.sh
./scripts/test-x86.sh
