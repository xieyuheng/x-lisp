import type { Instr } from "../instr/index.ts"
import { computeRex } from "./rex.ts"
import { modRM, MOD_REG } from "./modrm.ts"
import { regCode } from "./reg.ts"
import type { EncodedInstruction } from "./types.ts"

const CC_CODES: Record<string, number> = {
  o: 0,
  no: 1,
  b: 2,
  nae: 2,
  c: 2,
  ae: 3,
  nb: 3,
  nc: 3,
  e: 4,
  z: 4,
  ne: 5,
  nz: 5,
  be: 6,
  na: 6,
  a: 7,
  nbe: 7,
  s: 8,
  ns: 9,
  p: 10,
  pe: 10,
  np: 11,
  po: 11,
  l: 12,
  nge: 12,
  ge: 13,
  nl: 13,
  le: 14,
  ng: 14,
  g: 15,
  nle: 15,
}

export function encodeControl(instr: Instr): Array<EncodedInstruction> {
  switch (instr.op) {
    case "call":
      return encodeCall(instr)
    case "ret":
      return [{ prefixes: [], rex: null, opcode: [0xc3], modRM: null, sib: null, displacement: null, immediate: null }]
    case "jmp":
      return encodeJmp(instr)
    case "j":
      return encodeJcc(instr)
    default:
      throw new Error(`unknown control op: ${instr.op}`)
  }
}

function encodeCall(instr: Instr): Array<EncodedInstruction> {
  const target = instr.operands[0]

  if (target.kind === "RegDerefOperand") {
    const { modrm, rexRm, rexIndex } = encodeRegDerefForCall(target)
    return [{
      prefixes: [],
      rex: computeRex(false, null, rexIndex, rexRm),
      opcode: [0xff],
      modRM: modrm.codeForOpExt(2),
      sib: null,
      displacement: null,
      immediate: null,
    }]
  }

  if (target.kind !== "LabelOperand") {
    throw new Error(`[call] expected label or reg-deref, got: ${target.kind}`)
  }

  return [{
    prefixes: [],
    rex: null,
    opcode: [0xe8],
    modRM: null,
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }]
}

function encodeJmp(instr: Instr): Array<EncodedInstruction> {
  const target = instr.operands[0]
  if (target.kind !== "LabelOperand") {
    throw new Error(`[jmp] expected label, got: ${target.kind}`)
  }

  return [{
    prefixes: [],
    rex: null,
    opcode: [0xe9],
    modRM: null,
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }]
}

function encodeJcc(instr: Instr): Array<EncodedInstruction> {
  const cc = instr.operands[0]
  if (cc.kind !== "CcOperand") {
    throw new Error(`[j] first operand must be cc, got: ${cc.kind}`)
  }
  const ccCode = CC_CODES[cc.code]
  if (ccCode === undefined) throw new Error(`unknown condition code: ${cc.code}`)

  const target = instr.operands[1]
  if (target.kind !== "LabelOperand") {
    throw new Error(`[j] second operand must be label, got: ${target.kind}`)
  }

  return [{
    prefixes: [],
    rex: null,
    opcode: [0x0f, 0x80 + ccCode],
    modRM: null,
    sib: null,
    displacement: { size: 4, value: 0 },
    immediate: null,
  }]
}

function encodeRegDerefForCall(
  op: import("../operand/index.ts").RegDerefOperand,
): { modrm: { codeForOpExt: (ext: number) => number }; rexRm: string; rexIndex: string | null } {
  if (op.index === undefined && op.disp === undefined) {
    return {
      modrm: {
        codeForOpExt: (ext: number) => modRM(MOD_REG, ext, regCode(op.base)),
      },
      rexRm: op.base,
      rexIndex: null,
    }
  }
  throw new Error("[call] indirect only supports simple register operand")
}
