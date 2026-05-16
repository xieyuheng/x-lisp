import * as M from "../index.ts"

export function varOccurredInType(varType: M.VarType, type: M.Type): boolean {
  return varOccurredInTypeWithBoundIds(new Set(), varType, type)
}

function varOccurredInTypeWithBoundIds(
  boundIds: Set<string>,
  varType: M.VarType,
  type: M.Type,
): boolean {
  switch (type.kind) {
    case "VarType": {
      const id = M.varTypeId(type)
      if (boundIds.has(id)) {
        return false
      } else {
        return M.varTypeId(type) === M.varTypeId(varType)
      }
    }

    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType":
      return false

    case "ArrowType":
      return [...type.argTypes, type.retType].some((t) =>
        varOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "ListType":
      return varOccurredInTypeWithBoundIds(boundIds, varType, type.elementType)

    case "SetType":
      return varOccurredInTypeWithBoundIds(boundIds, varType, type.elementType)

    case "HashType":
      return [type.keyType, type.valueType].some((t) =>
        varOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "AlgebraicType":
    case "OpaqueType":
      return type.argTypes.some((t) =>
        varOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "PolymorphicType":
      return varOccurredInTypeWithBoundIds(
        new Set([...boundIds, ...type.varTypes.map(M.varTypeId)]),
        varType,
        type.bodyType,
      )
  }
}
