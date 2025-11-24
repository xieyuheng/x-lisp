#!/usr/bin/env bash

set -e

bash scripts/test-run-prelude.sh
bash scripts/test-run-std.sh
bash scripts/test-run-tests.sh
