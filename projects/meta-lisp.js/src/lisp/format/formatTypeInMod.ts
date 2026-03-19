import { pathRelativeToCwd } from "@xieyuheng/helpers.js/path"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import * as L from "../index.ts"

export function formatTypesInMod(mod: L.Mod, types: Array<L.Value>): string {
  return types.map((t) => formatTypeInMod(mod, t)).join(" ")
}

export function formatTypeInMod(mod: L.Mod, type: L.Value): string {
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
    const argTypes = formatTypesInMod(mod, L.arrowTypeArgTypes(type))
    const retType = formatTypeInMod(mod, L.arrowTypeRetType(type))
    return `(-> ${argTypes} ${retType})`
  }

  if (L.isTauType(type)) {
    const elementTypes = formatTypesInMod(mod, L.tauTypeElementTypes(type))
    return `(tau ${elementTypes})`
  }

  if (L.isInterfaceType(type)) {
    const attributeTypes = formatTypeRecordInMod(
      mod,
      L.interfaceTypeAttributeTypes(type),
    )
    return `(@interface ${attributeTypes})`
  }

  if (L.isListType(type)) {
    const elementType = formatTypeInMod(mod, L.listTypeElementType(type))
    return `(list-t ${elementType})`
  }

  if (L.isSetType(type)) {
    const elementType = formatTypeInMod(mod, L.setTypeElementType(type))
    return `(set-t ${elementType})`
  }

  if (L.isHashType(type)) {
    const keyType = formatTypeInMod(mod, L.hashTypeKeyType(type))
    const valueType = formatTypeInMod(mod, L.hashTypeValueType(type))
    return `(hash-t ${keyType} ${valueType})`
  }

  if (L.isDatatypeType(type)) {
    const definition = L.datatypeTypeDatatypeDefinition(type)
    const foundName = L.modLookupNameByDefinition(mod, definition)
    const argTypes = formatTypesInMod(mod, L.datatypeTypeArgTypes(type))
    const path = pathRelativeToCwd(definition.mod.path)
    const name = foundName || `<${definition.name} from ${path}>`
    if (argTypes.length === 0) {
      return `${name}`
    } else {
      return `(${name} ${argTypes})`
    }
  }

  if (L.isSumType(type)) {
    const variantTypes = formatTypeRecordInMod(mod, L.sumTypeVariantTypes(type))
    return `(sum ${variantTypes})`
  }

  if (L.isPolymorphicType(type)) {
    const varTypes = formatTypesInMod(mod, L.polymorphicTypeVarTypes(type))
    const bodyType = formatTypeInMod(mod, L.polymorphicTypeBodyType(type))
    return `(polymorphic (${varTypes}) ${bodyType})`
  }

  let message = `[formatType] unhandled type`
  message += `\n  type: ${L.formatValue(type)}`
  throw new Error(message)
}

function formatTypeRecordInMod(
  mod: L.Mod,
  record: Record<string, L.Value>,
): string {
  return Object.entries(record)
    .map(([k, t]) => `:${k} ${formatTypeInMod(mod, t)}`)
    .join(" ")
}
