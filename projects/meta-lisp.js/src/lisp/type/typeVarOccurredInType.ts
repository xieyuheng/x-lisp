import * as L from "../index.ts"

export function typeVarOccurredInType(
  varType: L.Value,
  type: L.Value,
): boolean {
  return typeVarOccurredInTypeWithBoundIds(new Set(), varType, type)
}

function typeVarOccurredInTypeWithBoundIds(
  boundIds: Set<string>,
  varType: L.Value,
  type: L.Value,
): boolean {
  if (L.isVarType(type)) {
    const id = L.varTypeId(type)
    if (boundIds.has(id)) {
      return false
    } else {
      return L.varTypeId(type) === L.varTypeId(varType)
    }
  }

  if (L.isCanonicalLabelType(type)) {
    return false
  }

  if (L.isTypeType(type)) {
    return false
  }

  if (L.isLiteralType(type)) {
    return false
  }

  if (L.isAtomType(type)) {
    return false
  }

  if (L.isArrowType(type)) {
    return [...L.arrowTypeArgTypes(type), L.arrowTypeRetType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isTauType(type)) {
    return L.tauTypeElementTypes(type).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isInterfaceType(type)) {
    return Object.values(L.interfaceTypeAttributeTypes(type)).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isListType(type)) {
    return [L.listTypeElementType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isSetType(type)) {
    return [L.setTypeElementType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isHashType(type)) {
    return [L.hashTypeKeyType(type), L.hashTypeValueType(type)].some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isDefinedDataType(type)) {
    return L.definedDataTypeArgTypes(type).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isSumType(type)) {
    return Object.values(L.sumTypeVariantTypes(type)).some((t) =>
      typeVarOccurredInTypeWithBoundIds(boundIds, varType, t),
    )
  }

  if (L.isPolymorphicType(type)) {
    const varTypes = L.polymorphicTypeVarTypes(type)
    return typeVarOccurredInTypeWithBoundIds(
      new Set([...boundIds, ...varTypes.map(L.varTypeId)]),
      varType,
      L.polymorphicTypeBodyType(type),
    )
  }

  let message = `[typeVarOccurredInTypeWithBoundIds] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
