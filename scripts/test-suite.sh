#!/usr/bin/env bash

set -e

bin="bun"
# bin="node"
# bin="node --stack-size=65536"

$bin \
    projects/x-lisp-boot.js/src/main.ts project:test \
    --config projects/x-lisp-test-suite/project.json
