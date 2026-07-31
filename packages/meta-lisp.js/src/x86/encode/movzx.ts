import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode, regSize } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeMovzx(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind !== "RegOperand" || src.kind !== "RegOperand") {
    throw new Error(
      `[movzx] both operands must be registers, got dst=${dst.kind} src=${src.kind}`,
    )
  }

  const srcSize = regSize(src.name)
  if (srcSize !== 1 && srcSize !== 2) {
    throw new Error(`[movzx] source must be 8-bit or 16-bit, got: ${src.name}`)
  }

  const dstSize = regSize(dst.name)
  if (dstSize <= srcSize) {
    throw new Error(
      `[movzx] destination must be wider than source: ${dst.name} vs ${src.name}`,
    )
  }

  return [
    {
      prefixes: sizePrefix(dstSize),
      rex: computeRex(dstSize === 8, dst.name, null, src.name),
      opcode: srcSize === 1 ? [0x0f, 0xb6] : [0x0f, 0xb7],
      modRM: modRM(MOD_REG, regCode(dst.name), regCode(src.name)),
      sib: null,
      displacement: null,
      immediate: null,
    },
  ]
}
