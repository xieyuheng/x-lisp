import { arrayGet } from "@xieyuheng/std.js/array"
import * as X86 from "../../x86/index.ts"

export function PatchInstructionsPass(mod: X86.Mod): void {
  for (const definition of mod.definitions.values()) {
    if (X86.isCodeDefinition(definition)) {
      definition.instrs = definition.instrs.flatMap((instr) =>
        patchInstr(instr),
      )
    }
  }
}

function patchInstr(instr: X86.Instr): Array<X86.Instr> {
  // remove self move instruction
  if (instr.op === "mov") {
    const dest = arrayGet(instr.operands, 0)
    const src = arrayGet(instr.operands, 1)
    if (X86.operandEqual(dest, src)) {
      return []
    }
  }

  // the dest operand of movzx must be register
  if (instr.op === "movzx") {
    const dest = arrayGet(instr.operands, 0)
    const src = arrayGet(instr.operands, 1)
    if (dest.kind !== "RegOperand") {
      return [
        X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
        X86.Instr("mov", [dest, X86.RegOperand("rax")]),
      ]
    }
  }

  // the dest operand of imul must be register
  if (instr.op === "imul") {
    const dest = arrayGet(instr.operands, 0)
    const src = arrayGet(instr.operands, 1)
    if (dest.kind !== "RegOperand") {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), dest]),
        X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
        X86.Instr("mov", [dest, X86.RegOperand("rax")]),
      ]
    }
  }

  // the dest operand of cmp must NOT be an immediate
  if (instr.op === "cmp") {
    const dest = arrayGet(instr.operands, 0)
    const src = arrayGet(instr.operands, 1)
    if (dest.kind === "ImmOperand") {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), dest]),
        X86.Instr(instr.op, [X86.RegOperand("rax"), src]),
        X86.Instr("mov", [dest, X86.RegOperand("rax")]),
      ]
    }
  }

  // fix two memory location operands
  if (instr.operands.length === 2) {
    const dest = arrayGet(instr.operands, 0)
    const src = arrayGet(instr.operands, 1)
    if (dest.kind === "RegMemOperand" && src.kind === "RegMemOperand") {
      return patchTwoMemory(instr, dest, src)
    }
  }

  return [instr]
}

function patchTwoMemory(
  instr: X86.Instr,
  dest: X86.RegMemOperand,
  src: X86.RegMemOperand,
): Array<X86.Instr> {
  switch (instr.op) {
    case "mov":
    case "add":
    case "sub":
    case "and":
    case "or":
    case "xor": {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), src]),
        X86.Instr(instr.op, [dest, X86.RegOperand("rax")]),
      ]
    }

    default: {
      let message = `[patchTwoMemory] unhandled instr: ${X86.formatInstr(instr)}`
      throw new Error(message)
    }
  }
}
