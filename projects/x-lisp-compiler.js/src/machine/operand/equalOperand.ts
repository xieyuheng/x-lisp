import type { Operand } from "./index.ts"

export function equalOperand(lhs: Operand, rhs: Operand): boolean {
  if (lhs.kind === "Imm" && rhs.kind === "Imm") {
    return lhs.value === rhs.value
  }

  if (lhs.kind === "LabelImm" && rhs.kind === "LabelImm") {
    return equalOperand(lhs.label, rhs.label)
  }

  if (lhs.kind === "Var" && rhs.kind === "Var") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "Reg" && rhs.kind === "Reg") {
    return lhs.name === rhs.name
  }

  if (lhs.kind === "RegDeref" && rhs.kind === "RegDeref") {
    return equalOperand(lhs.reg, rhs.reg) && lhs.offset === rhs.offset
  }

  if (lhs.kind === "LabelDeref" && rhs.kind === "LabelDeref") {
    return equalOperand(lhs.label, rhs.label)
  }

  if (lhs.kind === "Label" && rhs.kind === "Label") {
    return (
      lhs.name === rhs.name &&
      lhs.attributes.isExternal === rhs.attributes.isExternal
    )
  }

  if (lhs.kind === "Cc" && rhs.kind === "Cc") {
    return lhs.code === rhs.code
  }

  if (lhs.kind === "Arity" && rhs.kind === "Arity") {
    return lhs.value === rhs.value
  }

  return false
}
