import * as M from "../index.ts"

export function typeFreeVarTypes(
  boundIds: Set<string>,
  type: M.Value,
): Array<M.Value> {
  if (M.isVarType(type)) {
    const id = M.varTypeId(type)
    if (boundIds.has(id)) {
      return []
    } else {
      return [type]
    }
  }

  if (M.isCanonicalLabelType(type)) {
    return []
  }

  if (M.isTypeType(type)) {
    return []
  }

  if (M.isLiteralType(type)) {
    return []
  }

  if (M.isAtomType(type)) {
    return []
  }

  if (M.isArrowType(type)) {
    return [
      ...M.arrowTypeArgTypes(type).flatMap((t) =>
        typeFreeVarTypes(boundIds, t),
      ),
      ...typeFreeVarTypes(boundIds, M.arrowTypeRetType(type)),
    ]
  }

  if (M.isTauType(type)) {
    return M.tauTypeElementTypes(type).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isInterfaceType(type)) {
    return Object.values(M.interfaceTypeAttributeTypes(type)).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isExtendInterfaceType(type)) {
    return [
      ...typeFreeVarTypes(boundIds, M.extendInterfaceTypeBaseType(type)),
      ...Object.values(M.extendInterfaceTypeAttributeTypes(type)).flatMap((t) =>
        typeFreeVarTypes(boundIds, t),
      ),
    ]
  }

  if (M.isListType(type)) {
    return typeFreeVarTypes(boundIds, M.listTypeElementType(type))
  }

  if (M.isSetType(type)) {
    return typeFreeVarTypes(boundIds, M.setTypeElementType(type))
  }

  if (M.isHashType(type)) {
    return [M.hashTypeKeyType(type), M.hashTypeValueType(type)].flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isDefinedDataType(type)) {
    return M.definedDataTypeArgTypes(type).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isDefinedInterfaceType(type)) {
    return M.definedInterfaceTypeArgTypes(type).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isSumType(type)) {
    return Object.values(M.sumTypeVariantTypes(type)).flatMap((t) =>
      typeFreeVarTypes(boundIds, t),
    )
  }

  if (M.isPolymorphicType(type)) {
    const varTypes = M.polymorphicTypeVarTypes(type)
    return typeFreeVarTypes(
      new Set([...boundIds, ...varTypes.map(M.varTypeId)]),
      M.polymorphicTypeBodyType(type),
    )
  }

  let message = `[typeFreeVarTypes] unhandled type`
  message += `\n  type: ${M.formatType(type)}`
  throw new Error(message)
}
