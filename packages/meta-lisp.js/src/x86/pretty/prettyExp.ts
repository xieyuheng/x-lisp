import * as Ppml from "@xieyuheng/ppml.js"
import * as X86 from "../index.ts"

export function prettyExp(exp: X86.Exp): Ppml.Node {
  switch (exp.kind) {
    case "AddressExp":
      return Ppml.prettySyntax("address", [], [Ppml.text(exp.name)])
    case "IntExp":
      return Ppml.text(exp.value.toString())
    case "StringExp":
      return Ppml.text(JSON.stringify(exp.content))
    case "StructExp": {
      const fieldNodes = Object.entries(exp.fields).map(([fname, fexp]) =>
        Ppml.prettyApplication([Ppml.text(fname), prettyExp(fexp)]),
      )
      return Ppml.prettySyntax(
        "struct",
        [],
        [Ppml.text(exp.name), ...fieldNodes],
      )
    }
    case "PointerExp":
      return Ppml.prettySyntax("pointer", [], [prettyExp(exp.target)])
    case "ArrayExp":
      return Ppml.prettySyntax("array", [], exp.elements.map(prettyExp))
  }
}
