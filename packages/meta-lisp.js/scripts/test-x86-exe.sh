#!/usr/bin/env bash
set -e

parallel="parallel -v --halt now,fail=1"
ASM_DIR="lib/x86/exe"

find "$ASM_DIR" -name "*.x86.asm" | $parallel ./meta-lisp.js assemble-x86-exe {} {.}.exe
find "$ASM_DIR" -name "*.x86.exe" | $parallel ./meta run-x86-exe-and-print {} ">" {.}.out
find "$ASM_DIR" -name "*.x86.exe" | $parallel xxd {} ">" {.}.xxd
find "$ASM_DIR" -name "*.x86.exe" | $parallel ndisasm -b 64 -e 64 {} ">" {.}.ndisasm
