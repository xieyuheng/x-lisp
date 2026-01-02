import { formatOperand } from "../format/index.ts"
import type { Operand } from "./index.ts"
import * as Operands from "./index.ts"

export const isImm = (operand: Operand): operand is Operands.Imm =>
  operand.kind === "Imm"

export const isVar = (operand: Operand): operand is Operands.Var =>
  operand.kind === "Var"

export const isReg = (operand: Operand): operand is Operands.Reg =>
  operand.kind === "Reg"

export const isRegDeref = (operand: Operand): operand is Operands.RegDeref =>
  operand.kind === "RegDeref"

export const isLabelDeref = (
  operand: Operand,
): operand is Operands.LabelDeref => operand.kind === "LabelDeref"

export const isDeref = (
  operand: Operand,
): operand is Operands.RegDeref | Operands.LabelDeref =>
  isRegDeref(operand) || isLabelDeref(operand)

export const isLabel = (operand: Operand): operand is Operands.Label =>
  operand.kind === "Label"

export const isCc = (operand: Operand): operand is Operands.Cc =>
  operand.kind === "Cc"

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

export const asRegDeref = (operand: Operand): Operands.RegDeref => {
  if (isRegDeref(operand)) return operand
  else throw new Error(`[asRegDeref] fail on: ${formatOperand(operand)}`)
}

export const asLabel = (operand: Operand): Operands.Label => {
  if (isLabel(operand)) return operand
  else throw new Error(`[asLabel] fail on: ${formatOperand(operand)}`)
}

export const asCc = (operand: Operand): Operands.Cc => {
  if (isCc(operand)) return operand
  else throw new Error(`[asCc] fail on: ${formatOperand(operand)}`)
}

export function isConditionCode(code: string): code is Operands.ConditionCode {
  return ["e", "l", "le", "g", "ge"].includes(code)
}
