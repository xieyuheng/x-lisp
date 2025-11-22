#!/usr/bin/env bash

set -e

sh scripts/test-run-prelude.sh
sh scripts/test-run-std.sh
sh scripts/test-run-tests.sh
