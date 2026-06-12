import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

export function prettyOperand(operand: X86.Operand): Ppml.Node {
  switch (operand.kind) {
    case "RegOperand":
      return Ppml.prettySyntax("reg", [], [Ppml.text(operand.name)])
    case "ImmOperand":
      return Ppml.prettySyntax("imm", [], [Ppml.text(operand.value.toString())])
    case "LabelOperand":
      if (operand.path.length === 0) {
        return Ppml.prettySyntax("label", [], [Ppml.text(operand.name)])
      }
      return Ppml.prettySyntax(
        "label",
        [],
        [Ppml.text([operand.name, ...operand.path].join(" "))],
      )
    case "LabelImmOperand":
      return Ppml.prettySyntax("label-imm", [], [prettyOperand(operand.label)])
    case "LabelDerefOperand":
      return Ppml.prettySyntax(
        "label-deref",
        [],
        [prettyOperand(operand.label)],
      )
    case "RegDerefOperand": {
      const parts: Array<Ppml.Node> = [
        Ppml.prettySyntax("reg", [], [Ppml.text(operand.base)]),
      ]
      if (operand.index !== undefined) {
        parts.push(Ppml.prettySyntax("reg", [], [Ppml.text(operand.index)]))
        parts.push(Ppml.text(operand.scale?.toString() || "1"))
      }
      if (operand.disp !== undefined) {
        parts.push(Ppml.text(operand.disp.toString()))
      }
      return Ppml.prettySyntax("reg-deref", [], parts)
    }
    case "CcOperand":
      return Ppml.prettySyntax("cc", [], [Ppml.text(operand.code)])
    case "VarOperand":
      return Ppml.prettySyntax("var", [], [Ppml.text(operand.name)])
  }
}
