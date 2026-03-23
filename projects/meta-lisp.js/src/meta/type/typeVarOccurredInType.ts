import * as M from "../index.ts"

export function typeVarOccurredInType(
  varType: M.Value,
  type: M.Value,
): boolean {
  return typeVarOccurredInTypeWithBoundIds(new Set(), varType, type)
}

function typeVarOccurredInTypeWithBoundIds(
  boundIds: Set<string>,
  varType: M.Value,
  type: M.Value,
): boolean {
  if (M.isVarType(type)) {
    const id = M.varTypeId(type)
    if (boundIds.has(id)) {
      return false
    } else {
      return M.varTypeId(type) === M.varTypeId(varType)
    }
  }

  if (M.isCanonicalLabelType(type)) {
    return false
  }

  if (M.isTypeType(type)) {
    return false
  }

  if (M.isLiteralType(type)) {
    return false
  }

  if (M.isAtomType(type)) {
    return false
  }

  if (M.isArrowType(type)) {
    return [...M.arrowTypeArgTypes(type), M.arrowTypeRetType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isTauType(type)) {
    return M.tauTypeElementTypes(type).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isInterfaceType(type)) {
    return Object.values(M.interfaceTypeAttributeTypes(type)).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isExtendInterfaceType(type)) {
    return (
      typeVarOccurredInTypeWithBoundIds(
        boundIds,
        varType,
        M.extendInterfaceTypeBaseType(type),
      ) ||
      Object.values(M.extendInterfaceTypeAttributeTypes(type)).some((t) =>
        typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
      )
    )
  }

  if (M.isListType(type)) {
    return [M.listTypeElementType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isSetType(type)) {
    return [M.setTypeElementType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isHashType(type)) {
    return [M.hashTypeKeyType(type), M.hashTypeValueType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isDefinedDataType(type)) {
    return M.definedDataTypeArgTypes(type).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isDefinedInterfaceType(type)) {
    return M.definedInterfaceTypeArgTypes(type).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isSumType(type)) {
    return Object.values(M.sumTypeVariantTypes(type)).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (M.isPolymorphicType(type)) {
    const varTypes = M.polymorphicTypeVarTypes(type)
    return typeVarOccurredInTypeWithBoundIds(
      new Set([...boundIds, ...varTypes.map(M.varTypeId)]),
      varType,
      M.polymorphicTypeBodyType(type),
    )
  }

  let message = `[typeVarOccurredInTypeWithBoundIds] unhandled type`
  message += `\n  type: ${M.formatType(type)}`
  throw new Error(message)
}
