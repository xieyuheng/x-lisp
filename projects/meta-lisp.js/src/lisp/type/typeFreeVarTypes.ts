import * as L from "../index.ts"

export function typeFreeVarTypes(
  boundIds: Set<string>,
  type: L.Value,
): Array<L.Value> {
  if (L.isVarType(type)) {
    const id = L.varTypeId(type)
    if (boundIds.has(id)) {
      return []
    } else {
      return [type]
    }
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
    return [
      ...L.arrowTypeArgTypes(type).flatMap((t) =>
        typeFreeVarTypes(boundIds, t),
      ),
      ...typeFreeVarTypes(boundIds, L.arrowTypeRetType(type)),
    ]
  }

  if (L.isTauType(type)) {
    return L.tauTypeElementTypes(type).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (L.isClassType(type)) {
    return Object.values(L.classTypeAttributeTypes(type)).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (L.isListType(type)) {
    return typeFreeVarTypes(boundIds, L.listTypeElementType(type))
  }

  if (L.isSetType(type)) {
    return typeFreeVarTypes(boundIds, L.setTypeElementType(type))
  }

  if (L.isHashType(type)) {
    return [L.hashTypeKeyType(type), L.hashTypeValueType(type)].flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (L.isDatatypeType(type)) {
    return L.datatypeTypeArgTypes(type).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (L.isSumType(type)) {
    return Object.values(L.sumTypeVariantTypes(type)).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (L.isPolymorphicType(type)) {
    const varTypes = L.polymorphicTypeVarTypes(type)
    return typeFreeVarTypes(
      new Set([...boundIds, ...varTypes.map(L.varTypeId)]),
      L.polymorphicTypeBodyType(type),
    )
  }

  let message = `[typeFreeVars] unhandled type`
  message += `\n  type: ${L.formatType(type)}`
  throw new Error(message)
}
