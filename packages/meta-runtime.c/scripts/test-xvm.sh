#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xvm.asm" | $parallel ./meta assemble-xvm {}
find lib -name "*.xvm.exe" | $parallel ./meta test-xvm {}
