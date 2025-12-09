#!/usr/bin/env bash

set -e

bash scripts/run-prelude.sh
bash scripts/run-std.sh
bash scripts/run-tests.sh
