#!/bin/sh
# Run meta-lisp-mode tests using Emacs batch mode.

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

emacs -batch \
  -l "${DIR}/meta-lisp-syntax.el" \
  -l "${DIR}/meta-lisp-font-lock.el" \
  -l "${DIR}/meta-lisp-indent.el" \
  -l "${DIR}/meta-lisp-mode.el" \
  -l "${DIR}/meta-lisp-test.el" \
  -f ert-run-tests-batch-and-exit
