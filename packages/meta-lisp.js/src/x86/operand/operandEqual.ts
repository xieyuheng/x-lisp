import type { Operand } from "./Operand.ts"

export function operandEqual(lhs: Operand, rhs: Operand): boolean {
  if (lhs.kind === "RegOperand" && rhs.kind === "RegOperand") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "ImmOperand" && rhs.kind === "ImmOperand") {
    return lhs.value === rhs.value
  }

  if (lhs.kind === "FloatOperand" && rhs.kind === "FloatOperand") {
    return lhs.value === rhs.value
  }

  if (lhs.kind === "LabelOperand" && rhs.kind === "LabelOperand") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "AddressOperand" && rhs.kind === "AddressOperand") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "RipMemOperand" && rhs.kind === "RipMemOperand") {
    return lhs.size === rhs.size && operandEqual(lhs.address, rhs.address)
  }

  if (lhs.kind === "RegMemOperand" && rhs.kind === "RegMemOperand") {
    // just use json
    return JSON.stringify(lhs) === JSON.stringify(rhs)
  }

  if (lhs.kind === "CcOperand" && rhs.kind === "CcOperand") {
    return lhs.code === rhs.code
  }

  if (lhs.kind === "VarOperand" && rhs.kind === "VarOperand") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "ExternOperand" && rhs.kind === "ExternOperand") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "RelocationOperand" && rhs.kind === "RelocationOperand") {
    return lhs.type === rhs.type && lhs.name === rhs.name
  }

  if (lhs.kind === "DataOperand" && rhs.kind === "DataOperand") {
    // just use json
    return JSON.stringify(lhs) === JSON.stringify(rhs)
  }

  return false
}
