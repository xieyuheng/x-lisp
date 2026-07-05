import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyOperand(operand: B.Operand): Ppml.Node {
  switch (operand.kind) {
    case "VarOperand":
      return Ppml.text(operand.name)
    case "IntOperand":
      return Ppml.text(operand.value.toString())
    case "FloatOperand": {
      const n = operand.value
      const text = Number.isInteger(n) ? `${n.toString()}.0` : n.toString()
      return Ppml.text(text)
    }
    case "BoolOperand":
      return Ppml.prettySyntax(
        "bool",
        [],
        [Ppml.text(operand.value ? "true" : "false")],
      )
    case "VoidOperand":
      return Ppml.prettySyntax("void", [], [])
    case "AddressOperand":
      return Ppml.prettySyntax("address", [], [Ppml.text(operand.name)])
  }
}
