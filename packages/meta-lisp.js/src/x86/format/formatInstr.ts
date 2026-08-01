import * as X86 from "../index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: X86.Instr): string {
  if (instr.op === "label") {
    const [op] = instr.operands
    if (op.kind === "LabelOperand") return op.name
    let message = `[formatInstr] label instruction must have LabelOperand`
    throw new Error(message)
  }
  const operands = instr.operands.map(formatOperand).join(" ")
  if (operands) {
    return `(${instr.op} ${operands})`
  }
  return `(${instr.op})`
}
