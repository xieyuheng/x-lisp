import * as B from "../index.ts"

export function formatType(type: B.Type): string {
  switch (type.kind) {
    case "Int64Type":
      return "int64-t"
    case "Float64Type":
      return "float64-t"
    case "BoolType":
      return "bool-t"
    case "VoidType":
      return "void-t"
    case "PointerType":
      return "pointer-t"
    case "ValueType":
      return "value-t"
    case "NamedType":
      return type.name
    case "StructType": {
      const fieldTexts = Object.entries(type.fields).map(
        ([name, fieldType]) => `(${name} ${formatType(fieldType)})`,
      )
      return `(${fieldTexts.join(" ")})`
    }
    case "ArrowType": {
      const argTexts = type.argTypes.map(formatType)
      const retText = formatType(type.retType)
      return `(-> ${[...argTexts, retText].join(" ")})`
    }
  }
}
