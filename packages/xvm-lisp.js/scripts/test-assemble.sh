#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xvm.asm" | $parallel ./bin/xvm-lisp.js format {} ">" {}.format
find lib -name "*.xvm.asm" | $parallel ./bin/xvm-lisp.js assemble {} {.}.exe
find lib -name "*.xvm.exe" | $parallel ./bin/xvm-lisp.js disassemble {} ">" {.}.exe.disasm
find lib -name "*.xvm.exe" | $parallel ./bin/xvm-lisp.js info {} ">" {.}.exe.info
