#!/usr/bin/env bash

set -e

./bin/xvm test build/bundle.xvm.exe
./scripts/test-cli.sh > scripts/test-cli.sh.out
./scripts/test-x86.sh > scripts/test-x86.sh.out
./scripts/test-cli-x86.sh > scripts/test-cli-x86.sh.out
