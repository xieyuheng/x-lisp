import * as M from "../index.ts"

export function typeVarOccurredInType(
  varType: M.VarType,
  type: M.Type,
): boolean {
  return typeVarOccurredInTypeWithBoundIds(new Set(), varType, type)
}

function typeVarOccurredInTypeWithBoundIds(
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
        typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "ListType":
      return typeVarOccurredInTypeWithBoundIds(
        boundIds,
        varType,
        type.elementType,
      )

    case "SetType":
      return typeVarOccurredInTypeWithBoundIds(
        boundIds,
        varType,
        type.elementType,
      )

    case "HashType":
      return [type.keyType, type.valueType].some((t) =>
        typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "DefinedDataType":
      return type.argTypes.some((t) =>
        typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
      )

    case "PolymorphicType":
      return typeVarOccurredInTypeWithBoundIds(
        new Set([...boundIds, ...type.varTypes.map(M.varTypeId)]),
        varType,
        type.bodyType,
      )

    case "CurryType":
    case "DefinitionType":
      return false
  }
}
