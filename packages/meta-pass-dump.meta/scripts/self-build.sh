#!/usr/bin/env bash

set -e

./meta-lisp.meta build-xvm --config self-meta-package.json
./meta-lisp2.meta build-xvm2 --config self-meta-package.json

./scripts/sanitize-dump.sh self-build
