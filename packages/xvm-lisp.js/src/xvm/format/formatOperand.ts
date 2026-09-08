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

    case "U16Operand": {
      return `(u16 ${operand.content})`
    }

    case "VarOperand": {
      return operand.name
    }

    case "FnOperand": {
      return `(fn ${operand.name})`
    }

    case "PrimOperand": {
      return `(prim ${operand.name})`
    }

    case "GlobalOperand": {
      return `(global ${operand.name})`
    }

    case "LabelOperand": {
      return `(label ${operand.name})`
    }
  }
}
