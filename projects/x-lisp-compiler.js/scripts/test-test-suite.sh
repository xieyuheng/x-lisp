#!/usr/bin/env bash

set -e

bin="node"

$bin src/main.ts project:test --config lisp/test-suite/project.json
