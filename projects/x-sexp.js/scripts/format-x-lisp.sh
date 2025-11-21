#!/usr/bin/env sh

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js format"
flags="--debug"

find x-lisp -name "*.lisp" | $parallel $bin {} $flags ">" {}.fmt
