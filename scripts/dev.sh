#!/usr/bin/env bash

set -e

bash scripts/format.sh
bash scripts/clean.sh
bash scripts/build.sh
bash scripts/test-quick.sh
