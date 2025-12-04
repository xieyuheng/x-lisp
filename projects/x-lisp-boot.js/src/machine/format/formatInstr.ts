import { type Instr } from "../instr/index.ts"
import { formatOperand } from "./formatOperand.ts"

export function formatInstr(instr: Instr): string {
  const operands = instr.operands.map(formatOperand).join(" ")
  return `(${instr.op} ${operands})`
}
