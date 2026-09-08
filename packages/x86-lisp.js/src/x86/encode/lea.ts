import type { Instr } from "../instr/index.ts"
import { encodeRegMem } from "./mem.ts"
import { MOD_DISP0, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeLea(instr: Instr): Array<EncodedInstruction> {
  const dest = instr.operands[0]
  const src = instr.operands[1]

  if (dest.kind !== "RegOperand") {
    let message = `[lea] dest must be register, got: ${dest.kind}`
    throw new Error(message)
  }

  if (src.kind === "RegMemOperand") {
    return [encodeLeaRegMem(dest.name, src)]
  }

  if (src.kind === "AddressOperand") {
    return [encodeLeaAddress(dest.name)]
  }

  let message = `[lea] unsupported src operand: ${src.kind}`
  throw new Error(message)
}

function encodeLeaRegMem(
  destReg: string,
  src: import("../operand/index.ts").RegMemOperand,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegMem(src)
  return {
    prefixes: [],
    rex: computeRex(true, destReg, rexIndex, rexRm),
    opcode: [0x8d],
    modRM: modrm.codeForReg(regCode(destReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeLeaAddress(destReg: string): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(true, destReg, null, null),
    opcode: [0x8d],
    modRM: modRM(MOD_DISP0, regCode(destReg), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
}
