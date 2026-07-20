import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMovzx(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind !== "RegOperand" || src.kind !== "RegOperand") {
    throw new Error(
      `[movzx] both operands must be registers, got dst=${dst.kind} src=${src.kind}`,
    )
  }

  return [
    {
      prefixes: [],
      rex: computeRex(true, dst.name, null, src.name),
      opcode: [0x0f, 0xb6],
      modRM: modRM(MOD_REG, regCode(dst.name), regCode(src.name)),
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
