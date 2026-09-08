import { type Instr } from "../instr/index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: Instr): string {
  if (instr.op === "label") {
    const operands = instr.operands.map(formatOperand).join(" ")
    return `${operands}`
  } else {
    if (instr.operands.length === 0) {
      return `(${instr.op})`
    } else {
      const operands = instr.operands.map(formatOperand).join(" ")
      return `(${instr.op} ${operands})`
    }
  }
}
