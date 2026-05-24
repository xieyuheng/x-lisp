#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib/tests -name "*.xasm" | $parallel ./src/xvm.exe assemble {}
find lib/tests -name "*.xexe" | $parallel ./src/xvm.exe test {}
