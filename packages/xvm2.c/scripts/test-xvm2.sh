#!/usr/bin/env bash

set -e

for asm in $(find lib -name "*.xvm2.asm" | sort); do
  exe="${asm%.xvm2.asm}.xvm2.exe"
  ../meta-lisp.js/meta-lisp.js assemble-xvm2 "$asm" "$exe"
  ./xvm2 test "$exe"
done
