import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { MOD_DISP0, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { encodeRegDeref } from "./regderef.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeLea(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind !== "RegOperand") {
    let message = `[lea] dst must be register, got: ${dst.kind}`
    throw new S.ErrorWithSourceLocation(message, instr.location)
  }

  if (src.kind === "RegDerefOperand") {
    return [encodeLeaRegDeref(dst.name, src)]
  }

  if (src.kind === "AddressOperand") {
    return [encodeLeaAddress(dst.name)]
  }

  let message = `[lea] unsupported src operand: ${src.kind}`
  throw new S.ErrorWithSourceLocation(message, instr.location)
}

function encodeLeaRegDeref(
  dstReg: string,
  src: import("../operand/index.ts").RegDerefOperand,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(src)
  return {
    prefixes: [],
    rex: computeRex(true, dstReg, rexIndex, rexRm),
    opcode: [0x8d],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeLeaAddress(dstReg: string): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(true, dstReg, null, null),
    opcode: [0x8d],
    modRM: modRM(MOD_DISP0, regCode(dstReg), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
}
