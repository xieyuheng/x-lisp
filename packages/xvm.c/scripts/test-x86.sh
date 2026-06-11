#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.x86" | $parallel ./src/xvm.exe run-x86 {}
