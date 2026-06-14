import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { encodeRegDeref } from "./regderef.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeStack(instr: Instr): Array<EncodedInstruction> {
  const op = instr.operands[0]

  if (instr.op === "push") {
    if (op.kind === "RegOperand") {
      return [encodePushReg(op.name)]
    }
    if (op.kind === "RegDerefOperand") {
      return [encodePushRegDeref(op)]
    }
  }

  if (instr.op === "pop") {
    if (op.kind === "RegOperand") {
      return [encodePopReg(op.name)]
    }
  }

  let message = `[${instr.op}] unsupported operand: ${op.kind}`
  throw new S.ErrorWithSourceLocation(message, instr.location)
}

function encodePushReg(reg: string): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(false, null, null, reg),
    opcode: [0x50 + regCode(reg)],
    modRM: null,
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodePushRegDeref(op: import("../operand/index.ts").RegDerefOperand): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(op)
  return {
    prefixes: [],
    rex: computeRex(false, null, rexIndex, rexRm),
    opcode: [0xff],
    modRM: modrm.codeForOpExt(6),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodePopReg(reg: string): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(false, null, null, reg),
    opcode: [0x58 + regCode(reg)],
    modRM: null,
    sib: null,
    displacement: null,
    immediate: null,
  }
}
