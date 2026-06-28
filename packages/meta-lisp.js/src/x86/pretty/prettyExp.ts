import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

export function prettyExp(exp: X86.Exp): Ppml.Node {
  switch (exp.kind) {
    case "AddressExp":
      return Ppml.text(exp.name)
    case "IntExp":
      return Ppml.text(exp.value.toString())
    case "StringExp":
      return Ppml.text(JSON.stringify(exp.content))
    case "StructExp": {
      const fieldNodes = exp.fields.map((f) =>
        Ppml.prettySyntax(
          "",
          [],
          [Ppml.text(f.name), Ppml.text(" "), prettyExp(f.exp)],
        ),
      )
      const body = exp.name ? [Ppml.text(exp.name), ...fieldNodes] : fieldNodes
      return Ppml.prettySyntax("struct", [], body)
    }
    case "PointerExp":
      return Ppml.prettySyntax("pointer", [], [prettyExp(exp.target)])
    case "ArrayExp":
      return Ppml.prettySyntax("array", [], exp.elements.map(prettyExp))
  }
}
