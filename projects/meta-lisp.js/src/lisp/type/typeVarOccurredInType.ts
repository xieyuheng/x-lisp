import * as L from "../index.ts"

export function typeVarOccurredInType(
  varType: L.Value,
  type: L.Value,
): boolean {
  if (L.isVarType(type)) {
    return L.varTypeId(type) === L.varTypeId(varType)
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
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isTauType(type)) {
    return L.tauTypeElementTypes(type).some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isClassType(type)) {
    return Object.values(L.classTypeAttributeTypes(type)).some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isListType(type)) {
    return [L.listTypeElementType(type)].some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isSetType(type)) {
    return [L.setTypeElementType(type)].some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isHashType(type)) {
    return [L.hashTypeKeyType(type), L.hashTypeValueType(type)].some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.datatypeTypeArgTypes(type).some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isSumType(type)) {
    return Object.values(L.sumTypeVariantTypes(type)).some((t) =>
      typeVarOccurredInType(varType, t),
    )
  }

  if (L.isPolymorphicType(type)) {
    return typeVarOccurredInType(varType, L.polymorphicTypeFreshen(type))
  }

  let message = `[typeVarOccurredInType] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
