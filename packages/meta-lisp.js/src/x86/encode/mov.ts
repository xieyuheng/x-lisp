import * as X86 from "../index.ts"
import type { Instr } from "../instr/index.ts"
import type {
  AddressOperand,
  ExternOperand,
  RelocationOperand,
  RipMemOperand,
} from "../operand/index.ts"
import { encodeMem } from "./mem.ts"
import { MOD_DISP0, MOD_REG, modRM } from "./modrm.ts"
import { isExtendedReg, regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { checkImm8, deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMov(instr: Instr): Array<EncodedInstruction> {
  const dest = instr.operands[0]
  const src = instr.operands[1]

  if (dest.kind === "RegOperand") {
    const destReg = dest.name

    if (src.kind === "RegOperand") {
      return [encodeMovRegReg(destReg, src.name, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      return [encodeMovRegImm(destReg, src.value, deriveOpSize(instr))]
    }

    if (src.kind === "FloatOperand") {
      return [encodeMovRegFloat(destReg, src.value)]
    }

    if (src.kind === "AddressOperand") {
      return [encodeMovRegAddress(destReg, src)]
    }

    if (src.kind === "RipMemOperand") {
      return [encodeMovRegMem(destReg, src, deriveOpSize(instr))]
    }

    if (src.kind === "RegMemOperand") {
      return [encodeMovRegRegMem(destReg, src, deriveOpSize(instr))]
    }

    if (src.kind === "ExternOperand") {
      return [encodeMovRegExtern(destReg, src)]
    }

    if (src.kind === "RelocationOperand") {
      return [encodeMovRelocation(destReg, src)]
    }
  }

  if (dest.kind === "RegMemOperand" || dest.kind === "RipMemOperand") {
    if (src.kind === "RegOperand") {
      return [encodeMovMemReg(dest, src.name, deriveOpSize(instr))]
    }

    if (src.kind === "ImmOperand") {
      const result = encodeMovMemImm(dest, src.value, deriveOpSize(instr))
      return Array.isArray(result) ? result : [result]
    }

    if (src.kind === "FloatOperand") {
      // a double literal is the raw 64-bit bit pattern (8 bytes)
      const result = encodeMovMemImm(dest, floatBits(src.value), 8)
      return Array.isArray(result) ? result : [result]
    }

    if (src.kind === "AddressOperand") {
      return encodeMovMemAddress(dest, src)
    }
  }

  let message = `[mov] unsupported operand combination: dest=${dest.kind} src=${src.kind}`
  throw new Error(message)
}

function encodeMovRegReg(
  destReg: string,
  srcReg: string,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const rex = computeRex(size === 8, destReg, null, srcReg)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modRM(MOD_REG, regCode(destReg), regCode(srcReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeMovRegImm(
  destReg: string,
  value: bigint,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const code = regCode(destReg)
  const ext = isExtendedReg(destReg)

  if (size === 1) {
    checkImm8(value)
    return {
      prefixes: [],
      rex: computeRex(false, null, null, destReg),
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
      rex: computeRex(false, null, null, destReg),
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
      rex: computeRex(false, null, null, destReg),
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
  const rex = computeRex(true, null, null, destReg)
  return {
    prefixes: [],
    rex,
    opcode: [0xc7],
    modRM: modRM(MOD_REG, 0, regCode(destReg)),
    sib: null,
    displacement: null,
    immediate: { size: 4, value },
  }
}

function encodeMovRegFloat(destReg: string, value: number): EncodedInstruction {
  return encodeMovRegImm(destReg, floatBits(value), 8)
}

function floatBits(value: number): bigint {
  const buf = new ArrayBuffer(8)
  new DataView(buf).setFloat64(0, value, true)
  return new DataView(buf).getBigUint64(0, true)
}

function encodeMovRegAddress(
  destReg: string,
  _src: AddressOperand,
): EncodedInstruction {
  const rex = computeRex(true, destReg, null, null)
  return {
    prefixes: [],
    rex,
    opcode: [0x8d],
    modRM: modRM(MOD_DISP0, regCode(destReg), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
}

function encodeMovRegMem(
  destReg: string,
  src: RipMemOperand,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  const rex = computeRex(size === 8, destReg, rexIndex, rexRm)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modrm.codeForReg(regCode(destReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovRegRegMem(
  destReg: string,
  src: X86.Operand,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(src)
  const rex = computeRex(size === 8, destReg, rexIndex, rexRm)
  return {
    prefixes: sizePrefix(size),
    rex,
    opcode: [size === 1 ? 0x8a : 0x8b],
    modRM: modrm.codeForReg(regCode(destReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovMemReg(
  dest: X86.Operand,
  srcReg: string,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
  dest: X86.Operand,
  value: bigint,
  size: 1 | 2 | 4 | 8,
): EncodedInstruction | Array<EncodedInstruction> {
  if (size === 1) {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
    const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
  dest: X86.Operand,
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
  const { modrm, sib, disp, rexRm, rexIndex } = encodeMem(dest)
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
  destReg: string,
  src: ExternOperand,
): EncodedInstruction {
  const code = regCode(destReg)
  const ext = isExtendedReg(destReg)
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
  destReg: string,
  _src: RelocationOperand,
): EncodedInstruction {
  const code = regCode(destReg)
  const ext = isExtendedReg(destReg)
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
