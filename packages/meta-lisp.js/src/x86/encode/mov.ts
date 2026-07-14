import type { Instr } from "../instr/index.ts"
import type {
  AddressOperand,
  DerefOperand,
  ExternOperand,
  RegDerefOperand,
} from "../operand/index.ts"
import { MOD_DISP0, MOD_REG, modRM } from "./modrm.ts"
import { isExtendedReg, regCode } from "./reg.ts"
import { encodeRegDeref } from "./regderef.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMov(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind === "RegOperand") {
    const dstReg = dst.name

    if (src.kind === "RegOperand") {
      return [encodeMovRegReg(dstReg, src.name)]
    }

    if (src.kind === "ImmOperand") {
      return [encodeMovRegImm(dstReg, src.value)]
    }

    if (src.kind === "AddressOperand") {
      return [encodeMovRegAddress(dstReg, src)]
    }

    if (src.kind === "DerefOperand") {
      return [encodeMovRegDeref(dstReg, src)]
    }

    if (src.kind === "RegDerefOperand") {
      return [encodeMovRegRegDeref(dstReg, src)]
    }

    if (src.kind === "ExternOperand") {
      return [encodeMovRegExtern(dstReg, src)]
    }
  }

  if (dst.kind === "RegDerefOperand") {
    if (src.kind === "RegOperand") {
      return [encodeMovRegDerefReg(dst, src.name)]
    }

    if (src.kind === "ImmOperand") {
      const result = encodeMovRegDerefImm(dst, src.value)
      return Array.isArray(result) ? result : [result]
    }

    if (src.kind === "AddressOperand") {
      return encodeMovRegDerefAddress(dst, src)
    }
  }

  let message = `[mov] unsupported operand combination: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}

function encodeMovRegReg(dstReg: string, srcReg: string): EncodedInstruction {
  const rex = computeRex(true, dstReg, null, srcReg)
  return {
    prefixes: [],
    rex,
    opcode: [0x8b],
    modRM: modRM(MOD_REG, regCode(dstReg), regCode(srcReg)),
    sib: null,
    displacement: null,
    immediate: null,
  }
}

function encodeMovRegImm(dstReg: string, value: bigint): EncodedInstruction {
  if (value < -(1n << 31n) || value > 0xffffffffn) {
    const code = regCode(dstReg)
    const ext = isExtendedReg(dstReg)
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
  _src: DerefOperand,
): EncodedInstruction {
  const rex = computeRex(true, dstReg, null, null)
  return {
    prefixes: [],
    rex,
    opcode: [0x8b],
    modRM: modRM(MOD_DISP0, regCode(dstReg), 5),
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }
}

function encodeMovRegRegDeref(
  dstReg: string,
  src: RegDerefOperand,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(src)
  const rex = computeRex(true, dstReg, rexIndex, rexRm)
  return {
    prefixes: [],
    rex,
    opcode: [0x8b],
    modRM: modrm.codeForReg(regCode(dstReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovRegDerefReg(
  dst: RegDerefOperand,
  srcReg: string,
): EncodedInstruction {
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
  const rex = computeRex(true, srcReg, rexIndex, rexRm)
  return {
    prefixes: [],
    rex,
    opcode: [0x89],
    modRM: modrm.codeForReg(regCode(srcReg)),
    sib: sib,
    displacement: disp,
    immediate: null,
  }
}

function encodeMovRegDerefImm(
  dst: RegDerefOperand,
  value: bigint,
): EncodedInstruction | Array<EncodedInstruction> {
  if (value < -(1n << 31n) || value > 0xffffffffn) {
    const raxMov = encodeMovRegImm("rax", value)
    const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
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
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
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

function encodeMovRegDerefAddress(
  dst: RegDerefOperand,
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
  const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(dst)
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
    externalReloc: { symbolName: src.name },
  }
}
