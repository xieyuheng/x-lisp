import type { Instr } from "../instr/index.ts"
import { encodeControl } from "./control.ts"
import { encodeGroup1 } from "./group1.ts"
import { encodeImul } from "./imul.ts"
import { encodeLea } from "./lea.ts"
import { encodeMov } from "./mov.ts"
import { encodeMovzx } from "./movzx.ts"
import { encodeNop } from "./nop.ts"
import { encodeSet } from "./set.ts"
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
    case "or":
    case "and":
    case "sub":
    case "xor":
    case "cmp":
      return encodeGroup1(instr)
    case "shl":
    case "shr":
    case "sar":
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
    case "nop":
      return encodeNop()
    case "syscall":
      return encodeSyscall()
    case "set":
      return encodeSet(instr)
    case "movzx":
      return encodeMovzx(instr)
    case "label":
      return []
    default:
      let message = `unknown instruction: ${instr.op}`
      throw new Error(message)
  }
}
