import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeTest(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind === "RegOperand" && src.kind === "RegOperand") {
    const size = deriveOpSize(instr)
    return [
      {
        prefixes: sizePrefix(size),
        rex: computeRex(size === 8, dst.name, null, src.name),
        opcode: [size === 1 ? 0x84 : 0x85],
        modRM: modRM(MOD_REG, regCode(dst.name), regCode(src.name)),
        sib: null,
        displacement: null,
        immediate: null,
      },
    ]
  }

  let message = `[test] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}
