#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib/encoding -name "*.x86.asm" | $parallel ./bin/x86-lisp.js assemble {} {.}.o
find lib/encoding -name "*.x86.o" | $parallel objcopy -O binary --only-section=.text {} {.}.text
find lib/encoding -name "*.x86.text" | $parallel xxd {} ">" {.}.xxd
find lib/encoding -name "*.x86.text" | $parallel ndisasm -b 64 {} ">" {.}.ndisasm
