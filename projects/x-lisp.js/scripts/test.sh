#!/usr/bin/env bash

set -e

bash scripts/check-test-suite.sh
bash scripts/snapshot-type-error.sh
bash scripts/interpret-test-suite.sh
bash scripts/test-test-suite.sh
