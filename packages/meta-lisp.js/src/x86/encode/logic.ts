import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { checkImm8, deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

const OPCODE_MAP: Record<
  string,
  { mr: number; rm: number; mr8: number; rm8: number; immExt: number }
> = {
  and: { mr: 0x21, rm: 0x23, mr8: 0x20, rm8: 0x22, immExt: 4 },
  or: { mr: 0x09, rm: 0x0b, mr8: 0x08, rm8: 0x0a, immExt: 1 },
  xor: { mr: 0x31, rm: 0x33, mr8: 0x30, rm8: 0x32, immExt: 6 },
}

export function encodeLogic(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const map = OPCODE_MAP[instr.op]
  if (!map) {
    let message = `unknown logic op: ${instr.op}`
    throw new Error(message)
  }

  if (dst.kind === "RegOperand" && src.kind === "RegOperand") {
    return [encodeLogicRegReg(dst.name, src.name, map, deriveOpSize(instr))]
  }

  if (dst.kind === "RegOperand" && src.kind === "ImmOperand") {
    return [encodeLogicRegImm(dst.name, src.value, map, deriveOpSize(instr))]
  }

  let message = `[${instr.op}] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}

function encodeLogicRegReg(
  dstReg: string,
  srcReg: string,
  map: { rm: number; rm8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, dstReg, null, srcReg),
    opcode: [size === 1 ? map.rm8 : map.rm],
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
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  if (size === 1) {
    checkImm8(value)
    return {
      prefixes: [],
      rex: computeRex(false, null, null, dstReg),
      opcode: [0x80],
      modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }
  if (isImm8(value)) {
    return {
      prefixes: sizePrefix(size),
      rex: computeRex(size === 8, null, null, dstReg),
      opcode: [0x83],
      modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, null, dstReg),
    opcode: [0x81],
    modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size: size === 2 ? 2 : 4, value },
  }
}

function isImm8(value: bigint): boolean {
  return value >= -128n && value <= 127n
}
