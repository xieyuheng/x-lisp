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

  // the dest operand of shl shr sar must be register
  // BUG this is a limit of assembler
  if (instr.op === "shl" || instr.op === "shr" || instr.op === "sar") {
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
    if (isMemLocation(dest) && isMemLocation(src)) {
      return [
        X86.Instr("mov", [X86.RegOperand("rax"), src]),
        X86.Instr(instr.op, [dest, X86.RegOperand("rax")]),
      ]
    }
  }

  return [instr]
}

function isMemLocation(operand: X86.Operand): boolean {
  return (
    operand.kind === "RegMemOperand" ||
    operand.kind === "RipMemOperand" ||
    operand.kind === "RelocationOperand"
  )
}
