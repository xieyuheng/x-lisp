#!/usr/bin/env sh

set -e

sh scripts/test-compile-passes.sh
sh scripts/test-interpret-basic.sh
sh scripts/test-interpret-prelude.sh
sh scripts/test-interpret-std.sh
sh scripts/test-interpret-tests.sh
