#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xvm.asm" | $parallel ../../bin/xvm-lisp.ts format {} ">" {}.format
find lib -name "*.xvm.asm" | $parallel ../../bin/xvm-lisp.ts assemble {} {.}.exe
find lib -name "*.xvm.exe" | $parallel ../../bin/xvm-lisp.ts disassemble {} ">" {.}.exe.disasm
find lib -name "*.xvm.exe" | $parallel ../../bin/xvm-lisp.ts info {} ">" {.}.exe.info
