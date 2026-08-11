import { type Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "SymbolOperand": {
      return `'${operand.content}`
    }

    case "StringOperand": {
      return JSON.stringify(operand.content)
    }

    case "IntOperand": {
      return operand.content.toString()
    }

    case "FloatOperand": {
      if (Number.isInteger(operand.content)) {
        return `${operand.content.toString()}.0`
      } else {
        return operand.content.toString()
      }
    }

    case "VarOperand": {
      return operand.name
    }
  }
}
