import { type Operand } from "../operand/index.ts"

export function formatOperand(operand: Operand): string {
  switch (operand.kind) {
    case "Keyword": {
      return `:${operand.content}`
    }

    case "Symbol": {
      return `'${operand.content}`
    }

    case "String": {
      return JSON.stringify(operand.content)
    }

    case "Int": {
      return operand.content.toString()
    }

    case "Float": {
      if (Number.isInteger(operand.content)) {
        return `${operand.content.toString()}.0`
      } else {
        return operand.content.toString()
      }
    }

    case "Var": {
      return operand.name
    }
  }
}
