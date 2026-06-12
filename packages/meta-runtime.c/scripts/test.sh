#!/usr/bin/env bash

set -e

make test

./scripts/test-xvm.sh
./scripts/test-x86-flat.sh
