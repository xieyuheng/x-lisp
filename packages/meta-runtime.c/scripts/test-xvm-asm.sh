#!/usr/bin/env bash

set -e

parallel="parallel -v --halt now,fail=1"

find lib -name "*.xvm.asm" | $parallel ./src/meta.exe assemble-xvm {}
