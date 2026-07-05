import * as B from "../index.ts"

export function formatOperand(operand: B.Operand): string {
  return operand.name
}

export function formatOperands(operands: Array<B.Operand>): string {
  return operands.map(formatOperand).join(" ")
}
