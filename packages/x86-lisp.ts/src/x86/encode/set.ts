import type { Instr } from "../instr/index.ts"
import { CC_CODES } from "./cc.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeSet(instr: Instr): Array<EncodedInstruction> {
  const ccOp = instr.operands[0]
  if (ccOp.kind !== "CcOperand") {
    throw new Error(`[set] first operand must be cc, got: ${ccOp.kind}`)
  }
  const ccCode = CC_CODES[ccOp.code]
  if (ccCode === undefined) {
    throw new Error(`[set] unknown condition code: ${ccOp.code}`)
  }

  const dest = instr.operands[1]
  if (dest.kind !== "RegOperand") {
    throw new Error(`[set] dest must be register, got: ${dest.kind}`)
  }

  return [
    {
      prefixes: [],
      rex: computeRex(false, null, null, dest.name),
      opcode: [0x0f, 0x90 + ccCode],
      modRM: modRM(MOD_REG, 0, regCode(dest.name)),
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
