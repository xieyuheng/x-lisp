import type { Instr } from "../instr/index.ts"
import { encodeRegMem } from "./mem.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeStack(instr: Instr): Array<EncodedInstruction> {
  const op = instr.operands[0]

  if (instr.op === "push") {
    if (op.kind === "RegOperand") {
      return [encodePushReg(op.name)]
    }
    if (op.kind === "RegMemOperand") {
      return [encodePushRegMem(op)]
    }
  }

  if (instr.op === "pop") {
    if (op.kind === "RegOperand") {
      return [encodePopReg(op.name)]
    }
  }

  let message = `[${instr.op}] unsupported operand: ${op.kind}`
  throw new Error(message)
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

function encodePushRegMem(
  op: import("../operand/index.ts").RegMemOperand,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegMem(op)
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
