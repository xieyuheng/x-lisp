#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.x86.exe" | $parallel ./src/meta.exe run-x86 {}
