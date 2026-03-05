#!/usr/bin/env bash

set -e

bin="node"

$bin src/main.ts project:interpret --config lisp/test-suite/project.json
