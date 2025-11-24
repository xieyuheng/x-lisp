#!/usr/bin/env bash

set -e

bash scripts/test-c.sh
bash scripts/test-js.sh
bash scripts/test-suite.sh
