#!/usr/bin/env bash

set -e

# stage2 -- meta-lisp code build

parallel="parallel -v --halt now,fail=1"

# meta build

$parallel ./scripts/run-in.sh {} build.sh ::: meta-builtin.meta meta-math.meta cli.meta meta-example.meta 元语数学 命令行 元语例子
