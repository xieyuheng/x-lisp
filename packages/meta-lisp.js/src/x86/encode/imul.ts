import type { Instr } from "../instr/index.ts"
import { encodeRegMem } from "./mem.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { computeRex } from "./rex.ts"
import { deriveOpSize, sizePrefix } from "./size.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeImul(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]
  const size = deriveOpSize(instr)
  if (size === 1) {
    throw new Error(`[imul] 8-bit imul is not supported`)
  }

  if (dst.kind === "RegOperand" && src.kind === "RegOperand") {
    return [
      {
        prefixes: sizePrefix(size),
        rex: computeRex(size === 8, dst.name, null, src.name),
        opcode: [0x0f, 0xaf],
        modRM: modRM(MOD_REG, regCode(dst.name), regCode(src.name)),
        sib: null,
        displacement: null,
        immediate: null,
      },
    ]
  }

  if (dst.kind === "RegOperand" && src.kind === "RegMemOperand") {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeRegMem(src)
    return [
      {
        prefixes: sizePrefix(size),
        rex: computeRex(size === 8, dst.name, rexIndex, rexRm),
        opcode: [0x0f, 0xaf],
        modRM: modrm.codeForReg(regCode(dst.name)),
        sib,
        displacement: disp,
        immediate: null,
      },
    ]
  }

  let message = `[imul] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new Error(message)
}
