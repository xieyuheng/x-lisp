import * as M from "../index.ts"

export function typeFreshen(type: M.Type): M.Type {
  switch (type.kind) {
    case "VarType":
    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType":
      return type

    case "ArrowType":
      return M.ArrowType(
        type.argTypes.map((t) => typeFreshen(t)),
        typeFreshen(type.retType),
      )

    case "ListType":
      return M.ListType(typeFreshen(type.elementType))

    case "SetType":
      return M.SetType(typeFreshen(type.elementType))

    case "HashType":
      return M.HashType(typeFreshen(type.keyType), typeFreshen(type.valueType))

    case "PairType":
      return M.PairType(
        typeFreshen(type.firstType),
        typeFreshen(type.secondType),
      )

    case "DataType":
      return M.DataType(
        type.typeConstructor,
        type.argTypes.map((t) => typeFreshen(t)),
      )

    case "AllType":
      return typeFreshen(M.allTypeFreshBodyType(type))
  }
}
