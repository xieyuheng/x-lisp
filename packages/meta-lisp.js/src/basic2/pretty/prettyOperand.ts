import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyOperand(operand: B.Operand): Ppml.Node {
  switch (operand.kind) {
    case "VarOperand":
      return Ppml.text(operand.name)
    case "Int64Operand":
      return Ppml.prettySyntax("int64", [], [
        Ppml.text(operand.value.toString()),
      ])
    case "Float64Operand": {
      const n = operand.value
      const text = Number.isInteger(n) ? `${n.toString()}.0` : n.toString()
      return Ppml.prettySyntax("float64", [], [Ppml.text(text)])
    }
    case "BoolOperand":
      return Ppml.prettySyntax("bool", [], [
        Ppml.text(operand.value ? "true" : "false"),
      ])
    case "VoidOperand":
      return Ppml.prettySyntax("void", [], [])
    case "AddressOperand":
      return Ppml.prettySyntax("address", [], [Ppml.text(operand.name)])
  }
}
