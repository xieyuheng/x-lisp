import * as M from "../index.ts"

export function occurCheck(
  subst: M.Subst,
  varType: M.VarType,
  type: M.Type,
): boolean {
  return occurCheckWithBoundIds(new Set(), subst, varType, type)
}

function occurCheckWithBoundIds(
  boundIds: Set<string>,
  subst: M.Subst,
  varType: M.VarType,
  type: M.Type,
): boolean {
  type = M.substWalk(subst, type)

  switch (type.kind) {
    case "VarType": {
      const id = M.varTypeId(type)
      if (boundIds.has(id)) {
        return false
      }

      return id === M.varTypeId(varType)
    }

    case "CanonicalLabelType":
    case "TypeType":
    case "AtomType": {
      return false
    }

    case "ArrowType": {
      return [...type.argTypes, type.retType].some((t) =>
        occurCheckWithBoundIds(boundIds, subst, varType, t),
      )
    }

    case "ListType": {
      return occurCheckWithBoundIds(boundIds, subst, varType, type.elementType)
    }

    case "SetType": {
      return occurCheckWithBoundIds(boundIds, subst, varType, type.elementType)
    }

    case "HashType": {
      return [type.keyType, type.valueType].some((t) =>
        occurCheckWithBoundIds(boundIds, subst, varType, t),
      )
    }

    case "PairType": {
      return [type.firstType, type.secondType].some((t) =>
        occurCheckWithBoundIds(boundIds, subst, varType, t),
      )
    }

    case "DataType": {
      return type.argTypes.some((t) =>
        occurCheckWithBoundIds(boundIds, subst, varType, t),
      )
    }

    case "PolymorphicType": {
      return occurCheckWithBoundIds(
        new Set([...boundIds, ...type.varTypes.map(M.varTypeId)]),
        subst,
        varType,
        type.bodyType,
      )
    }
  }
}
