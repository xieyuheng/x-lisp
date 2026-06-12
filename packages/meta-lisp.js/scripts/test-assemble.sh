#!/usr/bin/env bash
set -e

META_RUNTIME="../meta-runtime.c/src/meta.exe"

assemble_and_run() {
  local asm="$1"
  local flat="${asm%.x86.asm}.x86.flat"
  echo "assembling $asm -> $flat"
  node src/main.ts assemble-x86-flat "$asm" "$flat"
  echo "running $flat"
  "$META_RUNTIME" run-x86 "$flat"
  echo "OK: $asm"
}

assemble_and_run lib/x86/return42.x86.asm
assemble_and_run lib/x86/add.x86.asm
assemble_and_run lib/x86/labels.x86.asm
assemble_and_run lib/x86/call-ret.x86.asm
assemble_and_run lib/x86/conditional.x86.asm
assemble_and_run lib/x86/stack.x86.asm
assemble_and_run lib/x86/xor.x86.asm
assemble_and_run lib/x86/bitwise.x86.asm
assemble_and_run lib/x86/extended-regs.x86.asm

echo ""
echo "all x86 assembly tests passed"
