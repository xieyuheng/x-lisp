import type { Instr } from "../instr/index.ts"
import type {
  AddressOperand,
  DerefOperand,
  ExternOperand,
  MemOperand,
  RelocationOperand,
} from "../operand/index.ts"
import { MOD_DISP0, MOD_REG, modRM } from "./modrm.ts"
import { isExtendedReg, regCode } from "./reg.ts"
import { encodeMem } from "./regderef.ts"
import { computeRex } from "./rex.ts"
import { checkImm8, deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMov(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind === "RegOperand") {
    const dstReg = dst.name

    if (src.kind === "RegOperand") {
      return [encodeMovRegReg(dstReg, src.name, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeMovRegImm(dstReg, src.value, deriveOpSize(instr))]
    }

    if (src.kind === "FloatOperand") {
      return [encodeMovRegFloat(dstReg, src.value)]
    }

    if (src.kind === "AddressOperand") {
      return [encodeMovRegAddress(dstReg, src)]
    }

    if (src.kind === "DerefOperand") {
      return [encodeMovRegDeref(dstReg, src, deriveOpSize(instr))]
    }

    if (src.kind === "RegDerefOperand") {
      return [encodeMovRegRegDeref(dstReg, src, deriveOpSize(instr))]
    }

    if (src.kind === "ExternOperand") {
      return [encodeMovRegExtern(dstReg, src)]
    }

    if (src.kind === "RelocationOperand") {
      return [encodeMovRelocation(dstReg, src)]
    }
  }

  if (dst.kind === "RegDerefOperand" || dst.kind === "DerefOperand") {
    if (src.kind === "RegOperand") {
      return [encodeMovMemReg(dst, src.name, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      const result = encodeMovMemImm(dst, src.value, deriveOpSize(instr))
      return Array.isArray(result) ? result : [result]
    }

    if (src.kind === "AddressOperand") {
      return encodeMovMemAddress(dst, src)
    }
  }

  let message = `[mov] unsupported operand combination: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}

function encodeMovRegReg(
  dstReg: string,
  srcReg: string,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const rex = computeRex(size === 8, dstReg, null, srcReg)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modRM(MOD_REG, regCode(dstReg), regCode(srcReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeMovRegImm(
  dstReg: string,
  value: bigint,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const code = regCode(dstReg)
  const ext = isExtendedReg(dstReg)

  if (size === 1) {
    checkImm8(value)
    return {
      prefixes: [],
      rex: computeRex(false, null, null, dstReg),
      opcode: [0xb0 + code],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: { size: 1, value },
    }
  }

  if (size === 2) {
    return {
      prefixes: [0x66],
      rex: computeRex(false, null, null, dstReg),
      opcode: [0xb8 + code],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: { size: 2, value },
    }
  }

  if (size === 4) {
    return {
      prefixes: [],
      rex: computeRex(false, null, null, dstReg),
      opcode: [0xb8 + code],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: { size: 4, value },
    }
  }

  if (value < -(1n << 31n) || value > 0xffffffffn) {
    return {
      prefixes: [],
      rex: ext ? 0x49 : 0x48,
      opcode: [0xb8 + (ext ? code - 8 : code)],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: { size: 8, value },
    }
  }
  const rex = computeRex(true, null, null, dstReg)
  return {
    prefixes: [],
    rex,
    opcode: [0xc7],
    modRM: modRM(MOD_REG, 0, regCode(dstReg)),
    sib: null,
    displacement: null,
    immediate: { size: 4, value },
  }
}

function encodeMovRegFloat(dstReg: string, value: number): EncodedInstruction {
  const buf = new ArrayBuffer(8)
  new DataView(buf).setFloat64(0, value, true)
  const bitPattern = new DataView(buf).getBigUint64(0, true)
  return encodeMovRegImm(dstReg, bitPattern, 8)
}

function encodeMovRegAddress(
  dstReg: string,
  _src: AddressOperand,
): EncodedInstruction {
  const rex = computeRex(true, dstReg, null, null)
  return {
    prefixes: [],
    rex,
    opcode: [0x8d],
    modRM: modRM(MOD_DISP0, regCode(dstReg), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
}

function encodeMovRegDeref(
  dstReg: string,
  src: DerefOperand,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  const rex = computeRex(size === 8, dstReg, rexIndex, rexRm)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovRegRegDeref(
  dstReg: string,
  src: MemOperand,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  const rex = computeRex(size === 8, dstReg, rexIndex, rexRm)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovMemReg(
  dst: MemOperand,
  srcReg: string,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
  const rex = computeRex(size === 8, srcReg, rexIndex, rexRm)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x88 : 0x89],
    modRM: modrm.codeForReg(regCode(srcReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovMemImm(
  dst: MemOperand,
  value: bigint,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction | Array<EncodedInstruction> {
  if (size === 1) {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
    checkImm8(value)
    return {
      prefixes: [],
      rex: computeRex(false, null, rexIndex, rexRm),
      opcode: [0xc6],
      modRM: modrm.codeForOpExt(0),
      sib: sib,
      displacement: disp,
      immediate: { size: 1, value },
    }
  }

  if (size === 2) {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
    return {
      prefixes: [0x66],
      rex: computeRex(false, null, rexIndex, rexRm),
      opcode: [0xc7],
      modRM: modrm.codeForOpExt(0),
      sib: sib,
      displacement: disp,
      immediate: { size: 2, value },
    }
  }

  if (size === 4) {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
    return {
      prefixes: [],
      rex: computeRex(false, null, rexIndex, rexRm),
      opcode: [0xc7],
      modRM: modrm.codeForOpExt(0),
      sib: sib,
      displacement: disp,
      immediate: { size: 4, value },
    }
  }

  if (value < -(1n << 31n) || value > 0xffffffffn) {
    const raxMov = encodeMovRegImm("rax", value, 8)
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
    const mov: EncodedInstruction = {
      prefixes: [],
      rex: computeRex(true, null, rexIndex, rexRm),
      opcode: [0x89],
      modRM: modrm.codeForReg(regCode("rax")),
      sib: sib,
      displacement: disp,
      immediate: null,
    }
    return [raxMov, mov]
  }
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
  const rex = computeRex(true, null, rexIndex, rexRm)
  return {
    prefixes: [],
    rex,
    opcode: [0xc7],
    modRM: modrm.codeForOpExt(0),
    sib: sib,
    displacement: disp,
    immediate: { size: 4, value },
  }
}

function encodeMovMemAddress(
  dst: MemOperand,
  _src: AddressOperand,
): Array<EncodedInstruction> {
  const lea: EncodedInstruction = {
    prefixes: [],
    rex: computeRex(true, "rax", null, null),
    opcode: [0x8d],
    modRM: modRM(MOD_DISP0, regCode("rax"), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dst)
  const mov: EncodedInstruction = {
    prefixes: [],
    rex: computeRex(true, null, rexIndex, rexRm),
    opcode: [0x89],
    modRM: modrm.codeForReg(regCode("rax")),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
  return [lea, mov]
}

function encodeMovRegExtern(
  dstReg: string,
  src: ExternOperand,
): EncodedInstruction {
  const code = regCode(dstReg)
  const ext = isExtendedReg(dstReg)
  return {
    prefixes: [],
    rex: ext ? 0x49 : 0x48,
    opcode: [0xb8 + (ext ? code - 8 : code)],
    modRM: null,
    sib: null,
    displacement: null,
    immediate: { size: 8, value: 0n },
  }
}

function encodeMovRelocation(
  dstReg: string,
  _src: RelocationOperand,
): EncodedInstruction {
  const code = regCode(dstReg)
  const ext = isExtendedReg(dstReg)
  return {
    prefixes: [],
    rex: ext ? 0x49 : 0x48,
    opcode: [0xb8 + (ext ? code - 8 : code)],
    modRM: null,
    sib: null,
    displacement: null,
    immediate: { size: 8, value: 0n },
  }
}
