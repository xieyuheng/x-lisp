#!/usr/bin/env bash

set -e

bash scripts/run-tests.sh
bash scripts/bytecode-tests.sh
