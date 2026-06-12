import type { Instr } from "../instr/index.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeStack(instr: Instr): Array<EncodedInstruction> {
  const op = instr.operands[0]
  if (op.kind !== "RegOperand") {
    throw new Error(`[${instr.op}] operand must be register, got: ${op.kind}`)
  }

  if (instr.op === "push") {
    return [encodePushReg(op.name)]
  }

  if (instr.op === "pop") {
    return [encodePopReg(op.name)]
  }

  throw new Error(`unknown stack op: ${instr.op}`)
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
