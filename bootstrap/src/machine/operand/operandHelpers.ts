import { formatOperand } from "../format/index.ts"
import type { Operand } from "./index.ts"
import * as Operands from "./index.ts"

export const isImm = (operand: Operand): operand is Operands.Imm =>
  operand.kind === "Imm"

export const isVar = (operand: Operand): operand is Operands.Var =>
  operand.kind === "Var"

export const isReg = (operand: Operand): operand is Operands.Reg =>
  operand.kind === "Reg"

export const isMem = (operand: Operand): operand is Operands.Mem =>
  operand.kind === "Mem"

export const isLabel = (operand: Operand): operand is Operands.Label =>
  operand.kind === "Label"

export const asImm = (operand: Operand): Operands.Imm => {
  if (isImm(operand)) return operand
  else throw new Error(`[asImm] fail on: ${formatOperand(operand)}`)
}

export const asVar = (operand: Operand): Operands.Var => {
  if (isVar(operand)) return operand
  else throw new Error(`[asVar] fail on: ${formatOperand(operand)}`)
}

export const asReg = (operand: Operand): Operands.Reg => {
  if (isReg(operand)) return operand
  else throw new Error(`[asReg] fail on: ${formatOperand(operand)}`)
}

export const asMem = (operand: Operand): Operands.Mem => {
  if (isMem(operand)) return operand
  else throw new Error(`[asMem] fail on: ${formatOperand(operand)}`)
}
export const asLabel = (operand: Operand): Operands.Label => {
  if (isLabel(operand)) return operand
  else throw new Error(`[asLabel] fail on: ${formatOperand(operand)}`)
}
