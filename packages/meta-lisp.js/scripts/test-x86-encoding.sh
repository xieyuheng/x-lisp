#!/usr/bin/env bash
set -e

parallel="parallel -v --halt now,fail=1"
ASM_DIR="lib/x86/encoding"

find "$ASM_DIR" -name "*.x86.asm" | $parallel ./meta-lisp.js assemble-x86-xexe {} {.}.xexe
find "$ASM_DIR" -name "*.x86.xexe" | $parallel ./xexe xexe-xxd {} ">" {.}.xxd
find "$ASM_DIR" -name "*.x86.xexe" | $parallel ./xexe xexe-disasm {} ">" {.}.ndisasm
