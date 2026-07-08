import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { MOD_REG, modRM } from "./modrm.ts"
import { regCode } from "./reg.ts"
import { encodeRegDeref } from "./regderef.ts"
import { computeRex } from "./rex.ts"
import type { EncodedInstruction } from "./types.ts"

export function encodeImul(instr: Instr): Array<EncodedInstruction> {
  const dst = instr.operands[0]
  const src = instr.operands[1]

  if (dst.kind === "RegOperand" && src.kind === "RegOperand") {
    return [
      {
        prefixes: [],
        rex: computeRex(true, dst.name, null, src.name),
        opcode: [0x0f, 0xaf],
        modRM: modRM(MOD_REG, regCode(dst.name), regCode(src.name)),
        sib: null,
        displacement: null,
        immediate: null,
      },
    ]
  }

  if (dst.kind === "RegOperand" && src.kind === "RegDerefOperand") {
    const { modrm, sib, disp, rexRm, rexIndex } = encodeRegDeref(src)
    return [
      {
        prefixes: [],
        rex: computeRex(true, dst.name, rexIndex, rexRm),
        opcode: [0x0f, 0xaf],
        modRM: modrm.codeForReg(regCode(dst.name)),
        sib,
        displacement: disp,
        immediate: null,
      },
    ]
  }

  let message = `[imul] unsupported operands: dst=${dst.kind} src=${src.kind}`
  throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
}
