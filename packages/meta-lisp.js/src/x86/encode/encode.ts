import * as S from "@xieyuheng/sexp.js"
import type { Instr } from "../instr/index.ts"
import { encodeArithmetic } from "./arithmetic.ts"
import { encodeControl } from "./control.ts"
import { encodeImul } from "./imul.ts"
import { encodeLea } from "./lea.ts"
import { encodeLogic } from "./logic.ts"
import { encodeMov } from "./mov.ts"
import { encodeShift } from "./shift.ts"
import { encodeStack } from "./stack.ts"
import { encodeSyscall } from "./syscall.ts"
import { encodeTest } from "./test.ts"
import type { EncodedInstruction } from "./types.ts"

export function encode(instr: Instr): Array<EncodedInstruction> {
  switch (instr.op) {
    case "mov":
      return encodeMov(instr)
    case "add":
    case "sub":
    case "cmp":
      return encodeArithmetic(instr)
    case "and":
    case "or":
    case "xor":
      return encodeLogic(instr)
    case "shl":
    case "shr":
      return encodeShift(instr)
    case "push":
    case "pop":
      return encodeStack(instr)
    case "call":
    case "ret":
    case "jmp":
    case "j":
      return encodeControl(instr)
    case "lea":
      return encodeLea(instr)
    case "test":
      return encodeTest(instr)
    case "imul":
      return encodeImul(instr)
    case "syscall":
      return encodeSyscall()
    case "label":
      return []
    default:
      let message = `unknown instruction: ${instr.op}`
      throw new S.ErrorWithSourceLocation(message
    , S.zeroLocation("x86"))
  }
}
