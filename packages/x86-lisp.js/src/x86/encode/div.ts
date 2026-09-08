import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import type { EncodedInstruction } from "./types.ts"

// - F7 /7 — IDIV r/m64 (signed divide; dividend in rdx:rax, quotient in rax)
//   We only need the register form (RCX), since the select pass loads
//   the divisor into rcx explicitly.

export function encodeIdiv(instr: Instr): Array<EncodedInstruction> {
  const divisor = instr.operands[0]
  if (divisor.kind !== "RegOperand") {
    let message = `[idiv] expected register operand, got: ${divisor.kind}`
    throw new Error(message)
  }

  return [
    {
      prefixes: [],
      rex: 0x48,
      opcode: [0xf7],
      modRM: modRM(MOD_REG, 7, regCode(divisor.name)),
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}

export function encodeCqo(): Array<EncodedInstruction> {
  return [
    {
      prefixes: [],
      rex: 0x48,
      opcode: [0x99],
      modRM: null,
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
