#!/usr/bin/env bash

set -e

bash scripts/format.sh
bash scripts/clean.sh
bash scripts/build.sh
bash scripts/test-c.sh
bash scripts/test-js.sh
bash scripts/test-suite.sh
