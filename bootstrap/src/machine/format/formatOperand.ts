import type { Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Imm": {
      return `(imm ${operand.value})`
    }

    case "LabelImm": {
      return `(label-imm ${formatOperand(operand.label)})`
    }

    case "Var": {
      return `(var ${operand.name})`
    }

    case "Reg": {
      return `(reg ${operand.name})`
    }

    case "RegDeref": {
      return `(reg-deref ${formatOperand(operand.reg)} ${operand.offset})`
    }

    case "LabelDeref": {
      return `(label-deref ${formatOperand(operand.label)})`
    }

    case "Label": {
      if (operand.attributes.isExternal) {
        return `(external-label ${operand.name})`
      } else {
        return `(label ${operand.name})`
      }
    }

    case "Cc": {
      return `(cc ${operand.code})`
    }

    case "Arity": {
      return `(arity ${operand.value})`
    }
  }
}
