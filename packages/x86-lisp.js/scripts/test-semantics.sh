#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

gcc -c -nostdlib -fno-pie -fno-stack-protector -o lib/runtime/start.o lib/runtime/start.S
gcc -c -nostdlib -fno-pie -fno-stack-protector -o lib/runtime/print.o lib/runtime/print.c

find lib/semantics -name "*.x86.asm" | $parallel ./bin/x86-lisp.js assemble {} {.}.o
find lib/semantics -name "*.x86.o" | $parallel gcc -nostdlib -nostartfiles -no-pie -o {.}.run lib/runtime/start.o lib/runtime/print.o {}
find lib/semantics -name "*.x86.run" | $parallel bash -c '{} > {.}.out'
find lib/semantics -name "*.x86.run" | $parallel objcopy -O binary --only-section=.text {.}.o {.}.text
find lib/semantics -name "*.x86.text" | $parallel xxd {} ">" {.}.xxd
find lib/semantics -name "*.x86.text" | $parallel ndisasm -b 64 {} ">" {.}.ndisasm
