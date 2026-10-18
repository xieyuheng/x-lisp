#!/usr/bin/env bash

set -e

for asm in $(find lib -name "*.xvm.asm" | sort); do
  exe="${asm%.xvm.asm}.xvm.exe"
  ./bin/xvm-lisp.ts assemble "$asm" "$exe"
  ./bin/xvm test "$exe"
done
