import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyData(data: B.Data): Ppml.Node {
  switch (data.kind) {
    case "AddressData":
      return Ppml.prettySyntax("address", [], [Ppml.text(data.name)])
    case "IntData":
      return Ppml.text(data.content.toString())
    case "FloatData":
      return Ppml.text(data.content.toString())
    case "StringData":
      return Ppml.text(JSON.stringify(data.content))
    case "StructData": {
      const fieldNodes = Object.entries(data.fields).map(([fname, fdata]) =>
        Ppml.prettySyntax(
          "",
          [],
          [Ppml.text(fname), Ppml.text(" "), prettyData(fdata)],
        ),
      )
      return Ppml.prettySyntax("struct", [Ppml.text(data.name)], fieldNodes)
    }
    case "PointerData":
      return Ppml.prettySyntax("pointer", [], [prettyData(data.target)])
    case "ArrayData":
      return Ppml.prettySyntax("array", [], data.elements.map(prettyData))
  }
}
