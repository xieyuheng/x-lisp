// Shift group (Group 2): SHL / SHR / SAR
//
// Extension digits: /4 = SHL/SAL, /5 = SHR, /7 = SAR
//
//   D0 /ext — op r/m8, 1        (shift-by-1 short encoding)
//   D1 /ext — op r/m16/32/64, 1
//   C0 /ext — op r/m8, imm8
//   C1 /ext — op r/m16/32/64, imm8
//   D2 /ext — op r/m8, CL
//   D3 /ext — op r/m16/32/64, CL
//
// The r/m operand may be a register or a memory location (RegMem / RipMem).
// The shift count is either the CL register (`(reg rcx)`) or an imm8 in 0..255.

import type { Instr } from "../instr/index.ts"
import type { Operand } from "../operand/index.ts"
import { encodeMem } from "./mem.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

const EXT: Record<string, number> = {
  shl: 4,
  shr: 5,
  sar: 7,
}

export function encodeShift(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const ext = EXT[instr.op]
  if (ext === undefined) {
    let message = `unknown shift op: ${instr.op}`
    throw new Error(message)
  }

  if (dst.kind !== "RegOperand" && !isMemOperand(dst)) {
    let message = `[${instr.op}] unsupported dst operand: ${dst.kind}`
    throw new Error(message)
  }

  const size = deriveOpSize(instr)

  if (src.kind === "RegOperand" && src.name === "rcx") {
    return dst.kind === "RegOperand"
      ? [encodeShiftCl(dst.name, ext, size)]
      : [encodeShiftMemCl(dst, ext, size)]
  }

  if (src.kind === "ImmOperand") {
    checkShiftCount(instr.op, src.value)
    return dst.kind === "RegOperand"
      ? [encodeShiftImm(dst.name, src.value, ext, size)]
      : [encodeShiftMemImm(dst, src.value, ext, size)]
  }

  let message = `[${instr.op}] unsupported src operand: ${src.kind}`
  throw new Error(message)
}

function isMemOperand(op: Operand): boolean {
  return op.kind === "RegMemOperand" || op.kind === "RipMemOperand"
}

function checkShiftCount(op: string, value: bigint): void {
  if (value < 0n || value > 255n) {
    let message =
      `[${op}] shift count ${value} does not fit in an 8-bit ` +
      `unsigned immediate (0..255)`
    throw new Error(message)
  }
}

function encodeShiftCl(
  dstReg: string,
  ext: number,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, null, dstReg),
    opcode: [size === 1 ? 0xd2 : 0xd3],
    modRM: modRM(MOD_REG, ext, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeShiftImm(
  dstReg: string,
  value: bigint,
  ext: number,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  if (value === 1n) {
    return {
      prefixes: sizePrefix(size),
      rex: computeRex(size === 8, null, null, dstReg),
      opcode: [size === 1 ? 0xd0 : 0xd1],
      modRM: modRM(MOD_REG, ext, regCode(dstReg)),
      sib: null,
      displacement: null,
      immediate: null,
    }
  }
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, null, dstReg),
    opcode: [size === 1 ? 0xc0 : 0xc1],
    modRM: modRM(MOD_REG, ext, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size: 1, value },
  }
}

function encodeShiftMemCl(
  dstMem: Operand,
  ext: number,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dstMem)
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, rexIndex, rexRm),
    opcode: [size === 1 ? 0xd2 : 0xd3],
    modRM: modrm.codeForOpExt(ext),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeShiftMemImm(
  dstMem: Operand,
  value: bigint,
  ext: number,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dstMem)
  if (value === 1n) {
    return {
      prefixes: sizePrefix(size),
      rex: computeRex(size === 8, null, rexIndex, rexRm),
      opcode: [size === 1 ? 0xd0 : 0xd1],
      modRM: modrm.codeForOpExt(ext),
      sib,
      displacement: disp,
      immediate: null,
    }
  }
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, rexIndex, rexRm),
    opcode: [size === 1 ? 0xc0 : 0xc1],
    modRM: modrm.codeForOpExt(ext),
    sib,
    displacement: disp,
    immediate: { size: 1, value },
  }
}
