import * as Ppml from "../../ppml/index.ts"
import { type Operand } from "../operand/index.ts"

export function prettyOperand(operand: Operand): Ppml.Node {
  switch (operand.kind) {
    case "KeywordOperand": {
      return Ppml.text(`:${operand.content}`)
    }

    case "SymbolOperand": {
      return Ppml.text(`'${operand.content}`)
    }

    case "StringOperand": {
      return Ppml.text(JSON.stringify(operand.content))
    }

    case "IntOperand": {
      return Ppml.text(operand.content.toString())
    }

    case "FloatOperand": {
      if (Number.isInteger(operand.content)) {
        return Ppml.text(`${operand.content.toString()}.0`)
      } else {
        return Ppml.text(operand.content.toString())
      }
    }

    case "VarOperand": {
      return Ppml.text(operand.name)
    }
  }
}
