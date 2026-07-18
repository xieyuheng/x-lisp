#!/usr/bin/env bash
set -e

parallel="parallel -v --halt now,fail=1"
ASM_DIR="lib/x86/exe"

find "$ASM_DIR" -name "*.x86.asm" | $parallel ./meta-lisp.js assemble-x86-xexe {} {.}.xexe
find "$ASM_DIR" -name "*.x86.xexe" | $parallel ./meta run-x86-xexe-and-print {} ">" {.}.out
find "$ASM_DIR" -name "*.x86.xexe" | $parallel ndisasm -b 64 -e 120 {} ">" {.}.ndisasm
find "$ASM_DIR" -name "*.x86.xexe" | $parallel xxd {} ">" {.}.xxd
