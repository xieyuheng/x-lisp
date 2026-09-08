import * as Ppml from "@xieyuheng/ppml.js"
import { type Operand } from "../operand/index.ts"

export function prettyOperand(operand: Operand): Ppml.Node {
  switch (operand.kind) {
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

    case "U16Operand": {
      return Ppml.text(`(u16 ${operand.content})`)
    }

    case "VarOperand": {
      return Ppml.text(operand.name)
    }

    case "FnOperand": {
      return Ppml.text(`(fn ${operand.name})`)
    }

    case "PrimOperand": {
      return Ppml.text(`(prim ${operand.name})`)
    }

    case "GlobalOperand": {
      return Ppml.text(`(global ${operand.name})`)
    }

    case "LabelOperand": {
      return Ppml.text(`(label ${operand.name})`)
    }
  }
}
