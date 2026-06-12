#!/usr/bin/env bash
set -e

parallel="parallel -v --halt now,fail=1"
ASM_DIR="lib/x86/semantics"

find "$ASM_DIR" -name "*.x86.asm" | $parallel ./meta-lisp.js assemble-x86-flat {} {.}.flat
find "$ASM_DIR" -name "*.x86.flat" | $parallel ./meta run-x86-flat-and-print {} ">" {.}.out
find "$ASM_DIR" -name "*.x86.flat" | $parallel xxd {} ">" {.}.xxd
find "$ASM_DIR" -name "*.x86.flat" | $parallel ndisasm -b 64 {} ">" {.}.ndisasm
