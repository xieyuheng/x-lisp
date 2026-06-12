import * as X86 from "../index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: X86.Instr): string {
  if (instr.op === "label") {
    const operands = instr.operands.map(formatOperand).join(" ")
    return operands
  }
  const operands = instr.operands.map(formatOperand).join(" ")
  if (operands) {
    return `(${instr.op} ${operands})`
  }
  return `(${instr.op})`
}
