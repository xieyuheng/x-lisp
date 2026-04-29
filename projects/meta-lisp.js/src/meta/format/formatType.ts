import * as M from "../index.ts"

export function formatTypes(types: Array<M.Value>): string {
  return types.map((t) => formatType(t)).join(" ")
}

export function formatType(type: M.Value): string {
  if (M.isVarType(type)) {
    const serialNumber = M.varTypeSerialNumber(type)
    if (serialNumber === 0n) {
      return M.varTypeName(type)
    } else {
      return M.varTypeId(type)
    }
  }

  if (M.isCanonicalLabelType(type)) {
    const serialNumber = M.canonicalLabelTypeSerialNumber(type)
    return `_.${serialNumber}`
  }

  if (M.isTypeType(type)) {
    return `type-t`
  }

  if (M.isLiteralType(type)) {
    return M.formatValue(type)
  }

  if (M.isAtomType(type)) {
    const name = M.atomTypeName(type)
    return `${name}-t`
  }

  if (M.isArrowType(type)) {
    type = M.arrowTypeUncurrying(type)
    const argTypes = formatTypes(M.arrowTypeArgTypes(type))
    const retType = formatType(M.arrowTypeRetType(type))
    if (argTypes.length === 0) {
      return `(-> ${retType})`
    } else {
      return `(-> ${argTypes} ${retType})`
    }
  }

  if (M.isTauType(type)) {
    const elementTypes = formatTypes(M.tauTypeElementTypes(type))
    return `(tau ${elementTypes})`
  }

  if (M.isInterfaceType(type)) {
    const attributeTypes = formatTypeRecord(M.interfaceTypeAttributeTypes(type))
    return `(interface ${attributeTypes})`
  }

  if (M.isExtendInterfaceType(type)) {
    type = M.extendInterfaceTypeMerge(type)

    const baseType = formatType(M.extendInterfaceTypeBaseType(type))
    const attributeTypes = formatTypeRecord(
      M.extendInterfaceTypeAttributeTypes(type),
    )
    return `(extend-interface ${baseType} ${attributeTypes})`
  }

  if (M.isListType(type)) {
    const elementType = formatType(M.listTypeElementType(type))
    return `(list-t ${elementType})`
  }

  if (M.isSetType(type)) {
    const elementType = formatType(M.setTypeElementType(type))
    return `(set-t ${elementType})`
  }

  if (M.isHashType(type)) {
    const keyType = formatType(M.hashTypeKeyType(type))
    const valueType = formatType(M.hashTypeValueType(type))
    return `(hash-t ${keyType} ${valueType})`
  }

  if (M.isDefinedDataType(type)) {
    const definition = M.definedDataTypeDefinition(type)
    const argTypes = formatTypes(M.definedDataTypeArgTypes(type))
    if (argTypes.length === 0) {
      return `${definition.name}`
    } else {
      return `(${definition.name} ${argTypes})`
    }
  }

  if (M.isDefinedInterfaceType(type)) {
    const definition = M.definedInterfaceTypeDefinition(type)
    const argTypes = formatTypes(M.definedInterfaceTypeArgTypes(type))
    if (argTypes.length === 0) {
      return `${definition.name}`
    } else {
      return `(${definition.name} ${argTypes})`
    }
  }

  if (M.isSumType(type)) {
    const variantTypes = formatTypeRecord(M.sumTypeVariantTypes(type))
    return `(sum ${variantTypes})`
  }

  if (M.isPolymorphicType(type)) {
    const varTypes = formatTypes(M.polymorphicTypeVarTypes(type))
    const bodyType = formatType(M.polymorphicTypeBodyType(type))
    return `(polymorphic (${varTypes}) ${bodyType})`
  }

  let message = `[formatType] unhandled type`
  message += `\n  type: ${M.formatValue(type)}`
  throw new Error(message)
}

function formatTypeRecord(record: Record<string, M.Value>): string {
  return Object.entries(record)
    .map(([k, t]) => `:${k} ${formatType(t)}`)
    .join(" ")
}
