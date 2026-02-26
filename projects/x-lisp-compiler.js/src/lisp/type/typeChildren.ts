import * as L from "../index.ts"

export function typeChildren(type: L.Value): Array<L.Value> {
  if (L.isVarType(type)) {
    return []
  }

  if (L.isAnyType(type)) {
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
    return [
      ...L.tauTypeElementTypes(type),
      ...Object.values(L.tauTypeAttributeTypes(type)),
    ]
  }

  if (L.isListType(type)) {
    return [L.listTypeElementType(type)]
  }

  if (L.isSetType(type)) {
    return [L.setTypeElementType(type)]
  }

  if (L.isRecordType(type)) {
    return [L.recordTypeValueType(type)]
  }

  if (L.isHashType(type)) {
    return [L.hashTypeKeyType(type), L.hashTypeValueType(type)]
  }

  if (L.isDatatypeType(type)) {
    return L.datatypeTypeArgTypes(type)
  }

  if (L.isDisjointUnionType(type)) {
    return Object.values(L.disjointUnionTypeVariantTypes(type))
  }

  if (L.isPolymorphicType(type)) {
    return typeChildren(L.polymorphicTypeUnfold(type))
  }

  let message = `[occurredInType] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
