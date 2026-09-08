import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

function prettyDisplacement(disp: X86.Displacement): Ppml.Node {
  if (disp.kind === "IntDisplacement") return Ppml.text(disp.value.toString())
  return Ppml.prettySyntax(
    "offset-of",
    [],
    [Ppml.text([disp.structType, ...disp.fields].join(" "))],
  )
}

export function prettyOperand(operand: X86.Operand): Ppml.Node {
  switch (operand.kind) {
    case "RegOperand":
      return Ppml.prettySyntax("reg", [], [Ppml.text(operand.name)])
    case "ImmOperand":
      return Ppml.text(operand.value.toString())
    case "FloatOperand":
      return Ppml.text(operand.value.toString())
    case "LabelOperand":
      return Ppml.prettySyntax("label", [], [Ppml.text(operand.name)])
    case "AddressOperand":
      return Ppml.prettySyntax("address", [], [Ppml.text(operand.name)])
    case "RipMemOperand": {
      const parts: Array<Ppml.Node> = []
      if (operand.size !== undefined) parts.push(Ppml.text(operand.size))
      parts.push(prettyOperand(operand.address))
      return Ppml.prettySyntax("mem", [], parts)
    }
    case "RegMemOperand": {
      const parts: Array<Ppml.Node> = []
      if (operand.size !== undefined) parts.push(Ppml.text(operand.size))
      parts.push(Ppml.prettySyntax("reg", [], [Ppml.text(operand.base)]))
      if (operand.index !== undefined) {
        if (operand.scale !== undefined) {
          parts.push(
            Ppml.prettySyntax(
              "*",
              [],
              [
                Ppml.prettySyntax("reg", [], [Ppml.text(operand.index)]),
                Ppml.text(operand.scale.toString()),
              ],
            ),
          )
        } else {
          parts.push(Ppml.prettySyntax("reg", [], [Ppml.text(operand.index)]))
        }
      }
      if (operand.disp !== undefined) {
        parts.push(prettyDisplacement(operand.disp))
      }
      return Ppml.prettySyntax("mem", [], parts)
    }
    case "CcOperand":
      return Ppml.prettySyntax("cc", [], [Ppml.text(operand.code)])
    case "VarOperand":
      return Ppml.prettySyntax("var", [], [Ppml.text(operand.name)])
    case "ExternOperand":
      return Ppml.prettySyntax("extern", [], [Ppml.text(operand.name)])
    case "FixupOperand":
      return Ppml.prettySyntax(
        "fixup",
        [],
        [Ppml.text(operand.type), Ppml.text(operand.name)],
      )
    case "DataOperand":
      return X86.prettyData(operand.data)
  }
}
