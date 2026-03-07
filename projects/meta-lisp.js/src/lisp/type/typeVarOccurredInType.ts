import * as L from "../index.ts"

export function typeVarOccurredInType(
  varType: L.Value,
  type: L.Value,
): boolean {
  if (L.isVarType(type)) {
    return L.varTypeId(type) === L.varTypeId(varType)
  }

  return typeChildren(type).some((child) =>
    typeVarOccurredInType(varType, child),
  )
}

function typeChildren(type: L.Value): Array<L.Value> {
  if (L.isVarType(type)) {
    return []
  }

  if (L.isCanonicalLabelType(type)) {
    return []
  }

  if (L.isTypeType(type)) {
    return []
  }

  if (L.isLiteralType(type)) {
    return []
  }

  if (L.isAtomType(type)) {
    return []
  }

  if (L.isArrowType(type)) {
    return [...L.arrowTypeArgTypes(type), L.arrowTypeRetType(type)]
  }

  if (L.isTauType(type)) {
    return L.tauTypeElementTypes(type)
  }

  if (L.isClassType(type)) {
    return Object.values(L.classTypeAttributeTypes(type))
  }

  if (L.isListType(type)) {
    return [L.listTypeElementType(type)]
  }

  if (L.isSetType(type)) {
    return [L.setTypeElementType(type)]
  }

  if (L.isHashType(type)) {
    return [L.hashTypeKeyType(type), L.hashTypeValueType(type)]
  }

  if (L.isDatatypeType(type)) {
    return L.datatypeTypeArgTypes(type)
  }

  if (L.isSumType(type)) {
    return Object.values(L.sumTypeVariantTypes(type))
  }

  if (L.isPolymorphicType(type)) {
    return typeChildren(L.polymorphicTypeFreshen(type))
  }

  let message = `[occurredInType] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
