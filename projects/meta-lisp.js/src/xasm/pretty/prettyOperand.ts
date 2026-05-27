import * as Ppml from "@xieyuheng/ppml.js"
import { type Operand } from "../operand/index.ts"
import { prettyText } from "./layout.ts"

export function prettyOperand(operand: Operand): Ppml.Node {
  switch (operand.kind) {
    case "KeywordOperand": {
      return prettyText(`:${operand.content}`)
    }

    case "SymbolOperand": {
      return prettyText(`'${operand.content}`)
    }

    case "StringOperand": {
      return prettyText(JSON.stringify(operand.content))
    }

    case "IntOperand": {
      return prettyText(operand.content.toString())
    }

    case "FloatOperand": {
      if (Number.isInteger(operand.content)) {
        return prettyText(`${operand.content.toString()}.0`)
      } else {
        return prettyText(operand.content.toString())
      }
    }

    case "VarOperand": {
      return prettyText(operand.name)
    }
  }
}
