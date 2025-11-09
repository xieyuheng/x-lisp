#!/usr/bin/env sh

set -e

sh scripts/test-compile-to-pass-log.sh
sh scripts/test-run-via-basic.sh
sh scripts/test-run-basic-tests.sh
