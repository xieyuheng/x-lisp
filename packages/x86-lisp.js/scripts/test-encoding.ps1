#!/usr/bin/env pwsh
#Requires -Version 7.3

# x86-lisp.js emits ELF objects and uses Linux-only tooling
# (objcopy / ndisasm / native ELF execution).
# Windows keeps the Node-level tests and skips these script-level tests.

Write-Host 'skip x86-lisp encoding tests on Windows'
exit 0
