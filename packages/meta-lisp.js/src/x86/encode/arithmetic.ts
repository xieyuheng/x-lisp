import type { Instr } from "../instr/index.ts"
import { computeRex } from "./rex.ts"
import { modRM, MOD_REG } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { encodeRegDeref } from "./regderef.ts"
import type { EncodedInstruction } from "./types.ts"

const OPCODE_MAP: Record<string, { mr: number; rm: number; immExt: number }> = {
  add: { mr: 0x01, rm: 0x03, immExt: 0 },
  sub: { mr: 0x29, rm: 0x2b, immExt: 5 },
  cmp: { mr: 0x39, rm: 0x3b, immExt: 7 },
}

export function encodeArithmetic(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const map = OPCODE_MAP[instr.op]
  if (!map) throw new Error(`unknown arithmetic op: ${instr.op}`)

  if (dst.kind === "RegOperand") {
    const dstReg = dst.name

    if (src.kind === "RegOperand") {
      return [encodeArithRegReg(dstReg, src.name, map.rm)]
    }

    if (src.kind === "ImmOperand") {
      return [encodeArithRegImm(dstReg, src.value, map)]
    }
  }

  if (dst.kind === "RegDerefOperand") {
    if (src.kind === "RegOperand") {
      return [encodeArithMemReg(dst, src.name, map.mr)]
    }

    if (src.kind === "ImmOperand") {
      return [encodeArithMemImm(dst, src.value, map)]
    }
  }

  if (src.kind === "RegDerefOperand" && dst.kind === "RegOperand") {
    return [encodeArithRegMem(dst.name, src, map.rm)]
  }

  throw new Error(
    `[${instr.op}] unsupported operands: dst=${dst.kind} src=${src.kind}`,
  )
}

function encodeArithRegReg(
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

function encodeArithRegImm(
  dstReg: string,
  value: bigint,
  map: { immExt: number },
): EncodedInstruction {
  if (isImm8(value)) {
    return {
      prefixes: [],
      rex: computeRex(true, null, null, dstReg),
      opcode: [0x83],
      modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }
  return {
    prefixes: [],
    rex: computeRex(true, null, null, dstReg),
    opcode: [0x81],
    modRM: modRM(MOD_REG, map.immExt, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size: 4, value },
  }
}

function encodeArithRegMem(
  dstReg: string,
  src: import("../operand/index.ts").RegDerefOperand,
  opcode: number,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(src)
  return {
    prefixes: [],
    rex: computeRex(true, dstReg, rexIndex, rexRm),
    opcode: [opcode],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeArithMemReg(
  dst: import("../operand/index.ts").RegDerefOperand,
  srcReg: string,
  opcode: number,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
  return {
    prefixes: [],
    rex: computeRex(true, srcReg, rexIndex, rexRm),
    opcode: [opcode],
    modRM: modrm.codeForReg(regCode(srcReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeArithMemImm(
  dst: import("../operand/index.ts").RegDerefOperand,
  value: bigint,
  map: { immExt: number },
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
  if (isImm8(value)) {
    return {
      prefixes: [],
      rex: computeRex(true, null, rexIndex, rexRm),
      opcode: [0x83],
      modRM: modrm.codeForOpExt(map.immExt),
      sib,
      displacement: disp,
      immediate: { size: 1, value },
    }
  }
  return {
    prefixes: [],
    rex: computeRex(true, null, rexIndex, rexRm),
    opcode: [0x81],
    modRM: modrm.codeForOpExt(map.immExt),
    sib,
    displacement: disp,
    immediate: { size: 4, value },
  }
}

function isImm8(value: bigint): boolean {
  return value >= -128n && value <= 127n
}
