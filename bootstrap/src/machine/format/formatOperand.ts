import type { Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Imm": {
      return `${operand.value}`
    }

    case "Var": {
      return `${operand.name}`
    }

    case "Register": {
      return `(@register ${operand.name})`
    }

    case "Deref": {
      return `(@deref ${operand.registerName} ${operand.offset})`
    }

    case "Label": {
      return `(@label ${operand.name})`
    }
  }
}
