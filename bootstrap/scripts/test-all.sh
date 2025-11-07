#!/usr/bin/env sh

set -e

sh scripts/test-compile-passes.sh
sh scripts/test-interpret-via-basic.sh
sh scripts/test-interpret-basic.sh
