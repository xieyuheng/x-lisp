#!/usr/bin/env bash

set -e

bin="node"

$bin src/main.ts project:build --config lisp/test-suite/project.json
