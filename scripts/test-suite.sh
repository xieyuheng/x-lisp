#!/usr/bin/env bash

set -e

bun projects/x-lisp-boot.js/src/main.ts project:test --config projects/x-lisp-test-suite/project.json
# node --stack-size=65536 projects/x-lisp-boot.js/src/main.ts project:test --config projects/x-lisp-test-suite/project.json
# deno --allow-all --v8-flags='--stack-size=65536' projects/x-lisp-boot.js/src/main.ts project:test --config projects/x-lisp-test-suite/project.json
