import * as X86 from "../index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: X86.Instr): string {
  const operands = instr.operands.map(formatOperand).join(" ")
  if (operands) {
    return `(${instr.op} ${operands})`
  }
  return `(${instr.op})`
}
