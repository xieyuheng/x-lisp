import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

const OPCODE_MAP: Record<string, { mr: number; rm: number; immExt: number }> = {
  and: { mr: 0x21, rm: 0x23, immExt: 4 },
  or: { mr: 0x09, rm: 0x0b, immExt: 1 },
  xor: { mr: 0x31, rm: 0x33, immExt: 6 },
}

export function encodeLogic(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const map = OPCODE_MAP[instr.op]
  if (!map) {
    let message = `unknown logic op: ${instr.op}`
    throw new S.ErrorWithSourceLocation(message, instr.location)
  }

  if (dst.kind === "RegOperand" && src.kind === "RegOperand") {
    return [encodeLogicRegReg(dst.name, src.name, map.rm)]
  }

  if (dst.kind === "RegOperand" && src.kind === "ImmOperand") {
    return [encodeLogicRegImm(dst.name, src.value, map)]
  }

  let message = `[${instr.op}] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new S.ErrorWithSourceLocation(message, instr.location)
}

function encodeLogicRegReg(
  dstReg: string,
  srcReg: string,
  opcode: number,
): EncodedInstruction {
  return {
    prefixes: [],
    rex: computeRex(true, dstReg, null, srcReg),
    opcode: [opcode],
    modRM: modRM(MOD_REG, regCode(dstReg), regCode(srcReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeLogicRegImm(
  dstReg: string,
  value: bigint,
  map: { immExt: number },
): EncodedInstruction {
  const size = isImm8(value) ? 1 : 4
  const opcode = size === 1 ? 0x83 : 0x81
  return {
    prefixes: [],
    rex: computeRex(true, null, null, dstReg),
    opcode: [opcode],
    modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size, value },
  }
}

function isImm8(value: bigint): boolean {
  return value >= -128n && value <= 127n
}
