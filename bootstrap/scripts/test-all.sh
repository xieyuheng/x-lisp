#!/usr/bin/env sh

set -e

sh scripts/test-compile-passes.sh
sh scripts/test-run-via-basic.sh
sh scripts/test-run-basic-tests.sh
