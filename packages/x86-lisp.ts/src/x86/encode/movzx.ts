import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode, regSize } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMovzx(instr: Instr): Array<EncodedInstruction> {
  const dest = instr.operands[0]
  const src = instr.operands[1]

  if (dest.kind !== "RegOperand" || src.kind !== "RegOperand") {
    throw new Error(
      `[movzx] both operands must be registers, got dest=${dest.kind} src=${src.kind}`,
    )
  }

  const srcSize = regSize(src.name)
  if (srcSize !== 1 && srcSize !== 2) {
    throw new Error(`[movzx] source must be 8-bit or 16-bit, got: ${src.name}`)
  }

  const destSize = regSize(dest.name)
  if (destSize <= srcSize) {
    throw new Error(
      `[movzx] destination must be wider than source: ${dest.name} vs ${src.name}`,
    )
  }

  return [
    {
      prefixes: sizePrefix(destSize),
      rex: computeRex(destSize === 8, dest.name, null, src.name),
      opcode: srcSize === 1 ? [0x0f, 0xb6] : [0x0f, 0xb7],
      modRM: modRM(MOD_REG, regCode(dest.name), regCode(src.name)),
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
