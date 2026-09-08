#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib/encoding -name "*.x86.asm" | $parallel ./bin/x86-lisp.js assemble {} {.}.exe
find lib/encoding -name "*.x86.exe" | $parallel ./bin/x86 xxd {} ">" {.}.xxd
find lib/encoding -name "*.x86.exe" | $parallel ./bin/x86 disasm {} ">" {.}.ndisasm
