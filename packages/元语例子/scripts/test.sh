#!/usr/bin/env bash

set -e

./bin/xvm test build/bundle.xvm.exe
./scripts/test-cli.sh > scripts/test-cli.sh.out
