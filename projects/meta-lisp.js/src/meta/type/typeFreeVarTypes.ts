import * as M from "../index.ts"

export function typeFreeVarTypes(
  boundIds: Set<string>,
  type: M.Type,
): Array<M.Type> {
  switch (type.kind) {
    case "VarType": {
      const id = M.varTypeId(type)
      if (boundIds.has(id)) {
        return []
      } else {
        return [type]
      }
    }

    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType":
      return []

    case "ArrowType":
      return [
        ...type.argTypes.flatMap((t) => typeFreeVarTypes(boundIds, t)),
        ...typeFreeVarTypes(boundIds, type.retType),
      ]

    case "ListType":
      return typeFreeVarTypes(boundIds, type.elementType)

    case "SetType":
      return typeFreeVarTypes(boundIds, type.elementType)

    case "HashType":
      return [type.keyType, type.valueType].flatMap((t) =>
        typeFreeVarTypes(boundIds, t),
      )

    case "AlgebraicType":
      return type.argTypes.flatMap((t) => typeFreeVarTypes(boundIds, t))

    case "PolymorphicType":
      return typeFreeVarTypes(
        new Set([...boundIds, ...type.varTypes.map(M.varTypeId)]),
        type.bodyType,
      )

    case "CurryType":
    case "DefinitionType":
      return []
  }
}
