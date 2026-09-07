#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
XVM_DIR="lib/xvm"

find "$XVM_DIR" -name "*.xvm.asm" | $parallel ./bin/meta-lisp.js xvm:format {} ">" {}.format
find "$XVM_DIR" -name "*.xvm.asm" | $parallel ./bin/meta-lisp.js xvm:assemble {} {.}.exe
find "$XVM_DIR" -name "*.xvm.exe" | $parallel ./bin/meta-lisp.js xvm:disassemble {} ">" {.}.exe.disasm
find "$XVM_DIR" -name "*.xvm.exe" | $parallel ./bin/meta-lisp.js xvm:info {} ">" {.}.exe.info