#!/bin/sh
# Run watch-mode tests using Emacs batch mode.

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

emacs -batch \
  -l "${DIR}/watch-mode.el" \
  -l "${DIR}/watch-mode-test.el" \
  -f ert-run-tests-batch-and-exit
