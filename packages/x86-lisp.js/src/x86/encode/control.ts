import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { CC_CODES } from "./cc.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeControl(instr: Instr): Array<EncodedInstruction> {
  switch (instr.op) {
    case "call":
      return encodeCall(instr)
    case "ret":
      return [
        {
          prefixes: [],
          rex: null,
          opcode: [0xc3],
          modRM: null,
          sib: null,
          displacement: null,
          immediate: null,
        },
      ]
    case "jmp":
      return encodeJmp(instr)
    case "j":
      return encodeJcc(instr)
    default:
      let message = `unknown control op: ${instr.op}`
      throw new Error(message)
  }
}

function encodeCall(instr: Instr): Array<EncodedInstruction> {
  const target = instr.operands[0]

  if (target.kind === "RegMemOperand") {
    const { modrm, rexRm, rexIndex } = encodeRegMemForCall(
      target,
      S.zeroLocation("instr"),
    )
    return [
      {
        prefixes: [],
        rex: computeRex(false, null, rexIndex, rexRm),
        opcode: [0xff],
        modRM: modrm.codeForOpExt(2),
        sib: null,
        displacement: null,
        immediate: null,
      },
    ]
  }

  if (target.kind === "ExternOperand") {
    return encodeIndirectExternal("call", target.name)
  }

  if (target.kind !== "LabelOperand") {
    let message = `[call] expected label or mem, got: ${target.kind}`
    throw new Error(message)
  }

  return [
    {
      prefixes: [],
      rex: null,
      opcode: [0xe8],
      modRM: null,
      sib: null,
      displacement: { size: 4, value: 0 },
      immediate: null,
    },
  ]
}

function encodeJmp(instr: Instr): Array<EncodedInstruction> {
  const target = instr.operands[0]

  if (target.kind === "RegMemOperand") {
    const { modrm, rexRm, rexIndex } = encodeRegMemForCall(
      target,
      S.zeroLocation("instr"),
    )
    return [
      {
        prefixes: [],
        rex: computeRex(false, null, rexIndex, rexRm),
        opcode: [0xff],
        modRM: modrm.codeForOpExt(4),
        sib: null,
        displacement: null,
        immediate: null,
      },
    ]
  }

  if (target.kind === "ExternOperand") {
    return encodeIndirectExternal("jmp", target.name)
  }

  if (target.kind !== "LabelOperand") {
    let message = `[jmp] expected label or mem, got: ${target.kind}`
    throw new Error(message)
  }

  return [
    {
      prefixes: [],
      rex: null,
      opcode: [0xe9],
      modRM: null,
      sib: null,
      displacement: { size: 4, value: 0 },
      immediate: null,
    },
  ]
}

function encodeIndirectExternal(
  op: "call" | "jmp",
  symbolName: string,
): Array<EncodedInstruction> {
  const opExt = op === "call" ? 2 : 4
  const raxCode = regCode("rax")
  const movabs: EncodedInstruction = {
    prefixes: [],
    rex: 0x48,
    opcode: [0xb8 + raxCode],
    modRM: null,
    sib: null,
    displacement: null,
    immediate: { size: 8, value: 0n },
  }
  const indirect: EncodedInstruction = {
    prefixes: [],
    rex: null,
    opcode: [0xff],
    modRM: modRM(MOD_REG, opExt, raxCode),
    sib: null,
    displacement: null,
    immediate: null,
  }
  return [movabs, indirect]
}

function encodeJcc(instr: Instr): Array<EncodedInstruction> {
  const cc = instr.operands[0]
  if (cc.kind !== "CcOperand") {
    let message = `[j] first operand must be cc, got: ${cc.kind}`
    throw new Error(message)
  }
  const ccCode = CC_CODES[cc.code]
  if (ccCode === undefined) {
    let message = `unknown condition code: ${cc.code}`
    throw new Error(message)
  }

  const target = instr.operands[1]
  if (target.kind !== "LabelOperand") {
    let message = `[j] second operand must be label, got: ${target.kind}`
    throw new Error(message)
  }

  return [
    {
      prefixes: [],
      rex: null,
      opcode: [0x0f, 0x80 + ccCode],
      modRM: null,
      sib: null,
      displacement: { size: 4, value: 0 },
      immediate: null,
    },
  ]
}

function encodeRegMemForCall(
  op: import("../operand/index.ts").RegMemOperand,
  location: import("@xieyuheng/sexp.js").SourceLocation,
): {
  modrm: { codeForOpExt: (ext: number) => number }
  rexRm: string
  rexIndex: string | null
} {
  if (op.index === undefined && op.disp === undefined) {
    return {
      modrm: {
        codeForOpExt: (ext: number) => modRM(MOD_REG, ext, regCode(op.base)),
      },
      rexRm: op.base,
      rexIndex: null,
    }
  }
  let message = "[call] indirect only supports simple register operand"
  throw new Error(message)
}
