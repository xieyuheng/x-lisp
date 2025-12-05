#!/usr/bin/env bash

set -e

bin="node"
# bin="bun"

$bin \
    projects/x-lisp-boot.js/src/main.ts project:test \
    --config projects/x-lisp-test-suite/project.json
