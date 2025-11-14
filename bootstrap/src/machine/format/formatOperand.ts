import type { Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Imm": {
      return `(imm ${operand.value})`
    }

    case "ImmLabel": {
      return `(imm-label ${formatOperand(operand.label)})`
    }

    case "Var": {
      return `(var ${operand.name})`
    }

    case "Reg": {
      return `(reg ${operand.name})`
    }

    case "DerefReg": {
      return `(deref-reg ${formatOperand(operand.reg)} ${operand.offset})`
    }

    case "DerefLabel": {
      return `(deref-label ${formatOperand(operand.label)})`
    }

    case "Label": {
      return `(label ${operand.name})`
    }

    case "Cc": {
      return `(cc ${operand.code})`
    }

    case "Arity": {
      return `(arity ${operand.value})`
    }
  }
}
