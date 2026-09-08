import * as Ppml from "@xieyuheng/ppml.js"
import * as B from "../index.ts"

export function prettyType(type: B.Type): Ppml.Node {
  switch (type.kind) {
    case "Int64Type":
      return Ppml.text("int64-t")
    case "Float64Type":
      return Ppml.text("float64-t")
    case "BoolType":
      return Ppml.text("bool-t")
    case "VoidType":
      return Ppml.text("void-t")
    case "PointerType":
      return Ppml.text("pointer-t")
    case "ValueType":
      return Ppml.text("value-t")
    case "NamedType":
      return Ppml.text(type.name)
    case "StructType": {
      const fieldNodes = Object.entries(type.fields).map(([name, fieldType]) =>
        Ppml.prettySyntax("", [], [Ppml.text(name), prettyType(fieldType)]),
      )
      return Ppml.prettySyntax("", [], fieldNodes)
    }
    case "ArrowType": {
      const argNodes = type.argTypes.map(prettyType)
      const retNode = prettyType(type.retType)
      return Ppml.prettySyntax("->", [], [...argNodes, retNode])
    }
  }
}
