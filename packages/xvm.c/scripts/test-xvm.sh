#!/usr/bin/env bash

set -e

for asm in $(find lib -name "*.xvm.asm" | sort); do
  exe="${asm%.xvm.asm}.xvm.exe"
  ../meta-lisp.js/meta-lisp.js assemble-xvm "$asm" "$exe"
  ./xvm test "$exe"
done
