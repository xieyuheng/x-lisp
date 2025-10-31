import type { Instr, Operand } from "../instr/index.ts"
import { formatValue } from "./formatValue.ts"

export function formatInstr(instr: Instr): string {
  if (instr.dest) {
    const operands = instr.operands.map(formatOperand).join(" ")
    return `(= ${instr.dest} (${instr.op} ${operands}))`
  } else {
    const operands = instr.operands.map(formatOperand).join(" ")
    return `(${instr.op} ${operands})`
  }
}

function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Var": {
      return operand.name
    }

    case "Imm": {
      return formatValue(operand.value)
    }
  }
}
