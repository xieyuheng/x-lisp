#!/usr/bin/env sh

set -e

sh scripts/test-interpret-prelude.sh
sh scripts/test-interpret-std.sh
sh scripts/test-interpret-tests.sh
