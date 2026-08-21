import type { Instr } from "../instr/index.ts"
import type { MemOperand } from "../operand/index.ts"
import { encodeMem } from "./mem.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { checkImm8, deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

const OPCODE_MAP: Record<
  string,
  { mr: number; rm: number; mr8: number; rm8: number; immExt: number }
> = {
  add: { mr: 0x01, rm: 0x03, mr8: 0x00, rm8: 0x02, immExt: 0 },
  sub: { mr: 0x29, rm: 0x2b, mr8: 0x28, rm8: 0x2a, immExt: 5 },
  cmp: { mr: 0x39, rm: 0x3b, mr8: 0x38, rm8: 0x3a, immExt: 7 },
}

export function encodeArithmetic(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const map = OPCODE_MAP[instr.op]
  if (!map) {
    let message = `unknown arithmetic op: ${instr.op}`
    throw new Error(message)
  }

  if (dst.kind === "RegOperand") {
    const dstReg = dst.name

    if (src.kind === "RegOperand") {
      return [encodeArithRegReg(dstReg, src.name, map, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeArithRegImm(dstReg, src.value, map, deriveOpSize(instr))]
    }
  }

  if (dst.kind === "RegMemOperand" || dst.kind === "RipMemOperand") {
    if (src.kind === "RegOperand") {
      return [encodeArithMemReg(dst, src.name, map, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeArithMemImm(dst, src.value, map, deriveOpSize(instr))]
    }
  }

  if (
    (src.kind === "RegMemOperand" || src.kind === "RipMemOperand") &&
    dst.kind === "RegOperand"
  ) {
    return [encodeArithRegMem(dst.name, src, map, deriveOpSize(instr))]
  }

  let message = `[${instr.op}] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}

function encodeArithRegReg(
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

function encodeArithRegImm(
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

function encodeArithRegMem(
  dstReg: string,
  src: MemOperand,
  map: { rm: number; rm8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, dstReg, rexIndex, rexRm),
    opcode: [size === 1 ? map.rm8 : map.rm],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeArithMemReg(
  dst: MemOperand,
  srcReg: string,
  map: { mr: number; mr8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, srcReg, rexIndex, rexRm),
    opcode: [size === 1 ? map.mr8 : map.mr],
    modRM: modrm.codeForReg(regCode(srcReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeArithMemImm(
  dst: MemOperand,
  value: bigint,
  map: { immExt: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
  if (size === 1) {
    return {
      prefixes: [],
      rex: computeRex(false, null, rexIndex, rexRm),
      opcode: [0x80],
      modRM: modrm.codeForOpExt(map.immExt),
      sib,
      displacement: disp,
      immediate: { size: 1, value },
    }
  }
  if (isImm8(value)) {
    return {
      prefixes: sizePrefix(size),
      rex: computeRex(size === 8, null, rexIndex, rexRm),
      opcode: [0x83],
      modRM: modrm.codeForOpExt(map.immExt),
      sib,
      displacement: disp,
      immediate: { size: 1, value },
    }
  }
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, rexIndex, rexRm),
    opcode: [0x81],
    modRM: modrm.codeForOpExt(map.immExt),
    sib,
    displacement: disp,
    immediate: { size: size === 2 ? 2 : 4, value },
  }
}

function isImm8(value: bigint): boolean {
  return value >= -128n && value <= 127n
}
