// Intel Group 1 opcodes: ADD / OR / AND / SUB / XOR / CMP
//
// All six share the same encoding shapes:
//   mr / mr8 — op r/m, reg     (opcode families 01/00, 09/08, ...)
//   rm / rm8 — op reg, r/m     (opcode families 03/02, 0B/0A, ...)
//   imm      — op r/m, imm8 (83), op r/m, imm (81), op r/m8, imm8 (80)
// The immediate forms differ only in the /digit extension:
//   add=0  or=1  and=4  sub=5  xor=6  cmp=7
//
// The r/m operand may be a register or a memory location (RegMem / RipMem).
// dest and src must not both be memory locations — x86 allows at most one
// memory operand per instruction; the final fallthrough rejects that.

import type { Instr } from "../instr/index.ts"
import type { Operand } from "../operand/index.ts"
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
  or: { mr: 0x09, rm: 0x0b, mr8: 0x08, rm8: 0x0a, immExt: 1 },
  and: { mr: 0x21, rm: 0x23, mr8: 0x20, rm8: 0x22, immExt: 4 },
  sub: { mr: 0x29, rm: 0x2b, mr8: 0x28, rm8: 0x2a, immExt: 5 },
  xor: { mr: 0x31, rm: 0x33, mr8: 0x30, rm8: 0x32, immExt: 6 },
  cmp: { mr: 0x39, rm: 0x3b, mr8: 0x38, rm8: 0x3a, immExt: 7 },
}

export function encodeGroup1(instr: Instr): Array<EncodedInstruction> {
  const dest = instr.operands[0]
  const src = instr.operands[1]
  const map = OPCODE_MAP[instr.op]
  if (!map) {
    let message = `unknown group-1 op: ${instr.op}`
    throw new Error(message)
  }

  if (dest.kind === "RegOperand") {
    if (src.kind === "RegOperand") {
      return [encodeRegReg(dest.name, src.name, map, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeRegImm(dest.name, src.value, map, deriveOpSize(instr))]
    }
  }

  if (isMemOperand(dest)) {
    if (src.kind === "RegOperand") {
      return [encodeMemReg(dest, src.name, map, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeMemImm(dest, src.value, map, deriveOpSize(instr))]
    }
  }

  if (dest.kind === "RegOperand" && isMemOperand(src)) {
    return [encodeRegMem(dest.name, src, map, deriveOpSize(instr))]
  }

  let message = `[${instr.op}] unsupported operands: dest=${dest.kind} src=${src.kind}`
  throw new Error(message)
}

function isMemOperand(op: Operand): boolean {
  return op.kind === "RegMemOperand" || op.kind === "RipMemOperand"
}

function encodeRegReg(
  destReg: string,
  srcReg: string,
  map: { rm: number; rm8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, destReg, null, srcReg),
    opcode: [size === 1 ? map.rm8 : map.rm],
    modRM: modRM(MOD_REG, regCode(destReg), regCode(srcReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeRegImm(
  destReg: string,
  value: bigint,
  map: { immExt: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  if (size === 1) {
    checkImm8(value)
    return {
      prefixes: [],
      rex: computeRex(false, null, null, destReg),
      opcode: [0x80],
      modRM: modRM(MOD_REG, map.immExt, regCode(destReg)),
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }
  if (isImm8(value)) {
    return {
      prefixes: sizePrefix(size),
      rex: computeRex(size === 8, null, null, destReg),
      opcode: [0x83],
      modRM: modRM(MOD_REG, map.immExt, regCode(destReg)),
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, null, null, destReg),
    opcode: [0x81],
    modRM: modRM(MOD_REG, map.immExt, regCode(destReg)),
    sib: null,
    displacement: null,
    immediate: { size: size === 2 ? 2 : 4, value },
  }
}

function encodeRegMem(
  destReg: string,
  src: Operand,
  map: { rm: number; rm8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  return {
    prefixes: sizePrefix(size),
    rex: computeRex(size === 8, destReg, rexIndex, rexRm),
    opcode: [size === 1 ? map.rm8 : map.rm],
    modRM: modrm.codeForReg(regCode(destReg)),
    sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMemReg(
  dest: Operand,
  srcReg: string,
  map: { mr: number; mr8: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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

function encodeMemImm(
  dest: Operand,
  value: bigint,
  map: { immExt: number },
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
