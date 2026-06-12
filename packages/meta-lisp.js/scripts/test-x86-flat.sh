#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib/x86/tests -name "*.x86.asm" | $parallel ./meta-lisp.js assemble-x86-flat {} {.}.flat
find lib/x86/tests -name "*.x86.flat" | $parallel ./meta run-x86-flat-and-print {} ">" {}.out
