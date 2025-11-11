import { formatOperand } from "../format/index.ts"
import type { Operand } from "./index.ts"
import * as Operands from "./index.ts"

export const isImm = (operand: Operand): operand is Operands.Imm =>
  operand.kind === "Imm"

export const isVar = (operand: Operand): operand is Operands.Var =>
  operand.kind === "Var"

export const isRegister = (operand: Operand): operand is Operands.Register =>
  operand.kind === "Register"

export const isDeref = (operand: Operand): operand is Operands.Deref =>
  operand.kind === "Deref"

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

export const asRegister = (operand: Operand): Operands.Register => {
  if (isRegister(operand)) return operand
  else throw new Error(`[asRegister] fail on: ${formatOperand(operand)}`)
}

export const asDeref = (operand: Operand): Operands.Deref => {
  if (isDeref(operand)) return operand
  else throw new Error(`[asDeref] fail on: ${formatOperand(operand)}`)
}
export const asLabel = (operand: Operand): Operands.Label => {
  if (isLabel(operand)) return operand
  else throw new Error(`[asLabel] fail on: ${formatOperand(operand)}`)
}
