import * as L from "../index.ts"

export function formatTypes(types: Array<L.Value>): string {
  return types.map((t) => formatType(t)).join(" ")
}

export function formatType(type: L.Value): string {
  if (L.isVarType(type)) {
    return L.varTypeId(type)
  }

  if (L.isAnyType(type)) {
    return `any-t`
  }

  if (L.isLiteralType(type)) {
    return L.formatValue(type)
  }

  if (L.isAtomType(type)) {
    const name = L.atomTypeName(type)
    return `${name}-t`
  }

  if (L.isArrowType(type)) {
    const argTypes = formatTypes(L.arrowTypeArgTypes(type))
    const retType = formatType(L.arrowTypeRetType(type))
    return `(-> ${argTypes} ${retType})`
  }

  if (L.isTauType(type)) {
    const elementTypes = formatTypes(L.tauTypeElementTypes(type))
    const attributeTypes = formatTypeRecord(L.tauTypeAttributeTypes(type))
    return `(tau ${elementTypes} ${attributeTypes})`
  }

  if (L.isListType(type)) {
    const elementType = formatType(L.listTypeElementType(type))
    return `(list-t ${elementType})`
  }

  if (L.isSetType(type)) {
    const elementType = formatType(L.setTypeElementType(type))
    return `(set-t ${elementType})`
  }

  if (L.isRecordType(type)) {
    const valueType = formatType(L.recordTypeValueType(type))
    return `(record-t ${valueType})`
  }

  if (L.isHashType(type)) {
    const keyType = formatType(L.hashTypeKeyType(type))
    const valueType = formatType(L.hashTypeValueType(type))
    return `(hash-t ${keyType} ${valueType})`
  }

  if (L.isDatatypeType(type)) {
    const definition = L.datatypeTypeDatatypeDefinition(type)
    const argTypes = formatTypes(L.datatypeTypeArgTypes(type))
    return `(${definition.name} ${argTypes})`
  }

  if (L.isDisjointUnionType(type)) {
    const variantTypes = formatTypeRecord(L.disjointUnionTypeVariantTypes(type))
    return `(disjoint-union ${variantTypes})`
  }

  if (L.isPolymorphicType(type)) {
    const parameters = L.polymorphicTypeParameters(type).join(" ")
    const closure = L.polymorphicTypeClosure(type)
    const body = L.formatExp(closure.body)
    return `(polymorphic (${parameters}) ${body})`
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

export function formatSubst(subst: L.Subst): string {
  return Array.from(subst.entries())
    .map(([k, t]) => `  :${k} ${formatType(t)}`)
    .join("\n")
}
