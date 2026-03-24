#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/stack-lisp bytecode"
flags=""

find lisp/tests -name "*.basic" | $parallel $bin {} $flags ">" {}.asm
