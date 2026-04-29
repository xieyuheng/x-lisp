import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import * as M from "../index.ts"

export function formatTypesInMod(mod: M.Mod, types: Array<M.Value>): string {
  return types.map((t) => formatTypeInMod(mod, t)).join(" ")
}

export function formatTypeInMod(mod: M.Mod, type: M.Value): string {
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
    const argTypes = formatTypesInMod(mod, M.arrowTypeArgTypes(type))
    const retType = formatTypeInMod(mod, M.arrowTypeRetType(type))
    if (argTypes.length === 0) {
      return `(-> ${retType})`
    } else {
      return `(-> ${argTypes} ${retType})`
    }
  }

  if (M.isTauType(type)) {
    const elementTypes = formatTypesInMod(mod, M.tauTypeElementTypes(type))
    return `(tau ${elementTypes})`
  }

  if (M.isInterfaceType(type)) {
    const attributeTypes = formatTypeRecordInMod(
      mod,
      M.interfaceTypeAttributeTypes(type),
    )
    return `(interface ${attributeTypes})`
  }

  if (M.isExtendInterfaceType(type)) {
    type = M.extendInterfaceTypeMerge(type)

    const baseType = formatTypeInMod(mod, M.extendInterfaceTypeBaseType(type))
    const attributeTypes = formatTypeRecordInMod(
      mod,
      M.extendInterfaceTypeAttributeTypes(type),
    )
    return `(extend-interface ${baseType} ${attributeTypes})`
  }

  if (M.isListType(type)) {
    const elementType = formatTypeInMod(mod, M.listTypeElementType(type))
    return `(list-t ${elementType})`
  }

  if (M.isSetType(type)) {
    const elementType = formatTypeInMod(mod, M.setTypeElementType(type))
    return `(set-t ${elementType})`
  }

  if (M.isHashType(type)) {
    const keyType = formatTypeInMod(mod, M.hashTypeKeyType(type))
    const valueType = formatTypeInMod(mod, M.hashTypeValueType(type))
    return `(hash-t ${keyType} ${valueType})`
  }

  if (M.isDefinedDataType(type)) {
    const definition = M.definedDataTypeDefinition(type)
    const foundName = M.modLookupNameByDefinition(mod, definition)
    const argTypes = formatTypesInMod(mod, M.definedDataTypeArgTypes(type))
    const name = foundName || `${definition.mod.name}/${definition.name}`
    if (argTypes.length === 0) {
      return `${name}`
    } else {
      return `(${name} ${argTypes})`
    }
  }

  if (M.isDefinedInterfaceType(type)) {
    const definition = M.definedInterfaceTypeDefinition(type)
    const foundName = M.modLookupNameByDefinition(mod, definition)
    const argTypes = formatTypesInMod(mod, M.definedInterfaceTypeArgTypes(type))
    const path = pathRelativeToCwd(definition.mod.name)
    const name = foundName || `<${definition.name} from ${path}>`
    if (argTypes.length === 0) {
      return `${name}`
    } else {
      return `(${name} ${argTypes})`
    }
  }

  if (M.isSumType(type)) {
    const variantTypes = formatTypeRecordInMod(mod, M.sumTypeVariantTypes(type))
    return `(sum ${variantTypes})`
  }

  if (M.isPolymorphicType(type)) {
    const varTypes = formatTypesInMod(mod, M.polymorphicTypeVarTypes(type))
    const bodyType = formatTypeInMod(mod, M.polymorphicTypeBodyType(type))
    return `(polymorphic (${varTypes}) ${bodyType})`
  }

  let message = `[formatType] unhandled type`
  message += `\n  type: ${M.formatValue(type)}`
  throw new Error(message)
}

function formatTypeRecordInMod(
  mod: M.Mod,
  record: Record<string, M.Value>,
): string {
  return Object.entries(record)
    .map(([k, t]) => `:${k} ${formatTypeInMod(mod, t)}`)
    .join(" ")
}
