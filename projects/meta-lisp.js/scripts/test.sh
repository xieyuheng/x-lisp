#!/usr/bin/env bash

set -e

bash scripts/check-test-suite.sh
bash scripts/interpret-test-suite.sh
bash scripts/dump-test-suite.sh
bash scripts/snapshot-syntax-errors.sh
