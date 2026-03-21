import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as L from "../index.ts"

export function formatTypes(types: Array<L.Value>): string {
  return types.map((t) => formatType(t)).join(" ")
}

export function formatType(type: L.Value): string {
  if (L.isVarType(type)) {
    const serialNumber = L.varTypeSerialNumber(type)
    if (serialNumber === 0n) {
      return L.varTypeName(type)
    } else {
      return L.varTypeId(type)
    }
  }

  if (L.isCanonicalLabelType(type)) {
    const serialNumber = L.canonicalLabelTypeSerialNumber(type)
    return `_${stringToSubscript(serialNumber.toString())}`
  }

  if (L.isTypeType(type)) {
    return `type-t`
  }

  if (L.isLiteralType(type)) {
    return L.formatValue(type)
  }

  if (L.isAtomType(type)) {
    const name = L.atomTypeName(type)
    return `${name}-t`
  }

  if (L.isArrowType(type)) {
    type = L.arrowTypeUncurrying(type)
    const argTypes = formatTypes(L.arrowTypeArgTypes(type))
    const retType = formatType(L.arrowTypeRetType(type))
    return `(-> ${argTypes} ${retType})`
  }

  if (L.isTauType(type)) {
    const elementTypes = formatTypes(L.tauTypeElementTypes(type))
    return `(tau ${elementTypes})`
  }

  if (L.isInterfaceType(type)) {
    const attributeTypes = formatTypeRecord(L.interfaceTypeAttributeTypes(type))
    return `(@interface ${attributeTypes})`
  }

  if (L.isListType(type)) {
    const elementType = formatType(L.listTypeElementType(type))
    return `(list-t ${elementType})`
  }

  if (L.isSetType(type)) {
    const elementType = formatType(L.setTypeElementType(type))
    return `(set-t ${elementType})`
  }

  if (L.isHashType(type)) {
    const keyType = formatType(L.hashTypeKeyType(type))
    const valueType = formatType(L.hashTypeValueType(type))
    return `(hash-t ${keyType} ${valueType})`
  }

  if (L.isDefinedDataType(type)) {
    const definition = L.definedDataTypeDefinition(type)
    const argTypes = formatTypes(L.definedDataTypeArgTypes(type))
    if (argTypes.length === 0) {
      return `${definition.name}`
    } else {
      return `(${definition.name} ${argTypes})`
    }
  }

  if (L.isDefinedInterfaceType(type)) {
    const definition = L.definedInterfaceTypeDefinition(type)
    const argTypes = formatTypes(L.definedInterfaceTypeArgTypes(type))
    if (argTypes.length === 0) {
      return `${definition.name}`
    } else {
      return `(${definition.name} ${argTypes})`
    }
  }

  if (L.isSumType(type)) {
    const variantTypes = formatTypeRecord(L.sumTypeVariantTypes(type))
    return `(sum ${variantTypes})`
  }

  if (L.isPolymorphicType(type)) {
    const varTypes = formatTypes(L.polymorphicTypeVarTypes(type))
    const bodyType = formatType(L.polymorphicTypeBodyType(type))
    return `(polymorphic (${varTypes}) ${bodyType})`
  }

  let message = `[formatType] unhandled type`
  message += `\n  type: ${L.formatValue(type)}`
  throw new Error(message)
}

function formatTypeRecord(record: Record<string, L.Value>): string {
  return Object.entries(record)
    .map(([k, t]) => `:${k} ${formatType(t)}`)
    .join(" ")
}
