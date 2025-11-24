#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"
bin="node ./lib/main.js assemble-x86"

find lisp/tests -name "*.machine" | $parallel $bin {}
