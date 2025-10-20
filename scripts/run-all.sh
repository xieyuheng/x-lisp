#!/usr/bin/env sh

set -e

sh scripts/run-basic.sh
sh scripts/run-prelude.sh
sh scripts/run-std.sh
sh scripts/run-examples.sh
