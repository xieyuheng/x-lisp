#!/usr/bin/env bash

set -e

bash scripts/interpret-test-suite.sh
bash scripts/test-test-suite.sh
