#!/bin/sh
# Format meta-lisp files using Emacs and meta-lisp-mode.
# Usage: meta-lisp-format.sh <file.meta> [file2.meta ...]

set -e

DIR="$(cd "$(dirname "$0")" && pwd)"

emacs -batch \
  -l "${DIR}/meta-lisp-syntax.el" \
  -l "${DIR}/meta-lisp-font-lock.el" \
  -l "${DIR}/meta-lisp-indent.el" \
  -l "${DIR}/meta-lisp-mode.el" \
  -l "${DIR}/meta-lisp-format.el" \
  --eval '(dolist (f command-line-args-left) (unless (string-prefix-p "-" f) (meta-lisp-format-file f)))' \
  -- "$@"
