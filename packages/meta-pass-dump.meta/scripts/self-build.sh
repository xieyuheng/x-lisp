#!/usr/bin/env bash

set -e

./meta-lisp.meta build --config self-meta-package.json
./scripts/sanitize-dump.sh self-expected
