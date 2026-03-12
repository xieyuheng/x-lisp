#!/usr/bin/env bash

set -e

bin="node"

$bin src/main.ts project:test-by-interpreter --config lisp/test-suite/project.json
