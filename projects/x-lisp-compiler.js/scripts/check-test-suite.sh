#!/usr/bin/env bash

set -e

bin="node"
# bin="bun

$bin src/main.ts project:check --config lisp/test-suite/project.json
