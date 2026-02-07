#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="./src/basic-lisp bytecode"
flags=""

find basic/tests -name "*.basic" | $parallel $bin {} $flags ">" {}.asm
