import { range } from "@xieyuheng/helpers.js/range"
import { recordMapValue } from "@xieyuheng/helpers.js/record"
import assert from "node:assert"
import * as M from "../index.ts"

export function isType(value: M.Value): boolean {
  return (
    isVarType(value) ||
    isCanonicalLabelType(value) ||
    isTypeType(value) ||
    isLiteralType(value) ||
    isAtomType(value) ||
    isArrowType(value) ||
    isTauType(value) ||
    isInterfaceType(value) ||
    isExtendInterfaceType(value) ||
    isDefinedInterfaceType(value) ||
    isListType(value) ||
    isSetType(value) ||
    isHashType(value) ||
    isDefinedDataType(value) ||
    isSumType(value) ||
    isPolymorphicType(value)
  )
}

// VarType

export function isVarType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("var")) &&
    M.isSymbolValue(value.elements[1]) &&
    M.isIntValue(value.elements[2])
  )
}

export function createVarType(name: string, serialNumber: bigint): M.Value {
  return M.ListValue([
    M.SymbolValue("var"),
    M.SymbolValue(name),
    M.IntValue(serialNumber),
  ])
}

const serialNumberMap: Map<string, bigint> = new Map()

function generateVarTypeSerialNumber(name: string): bigint {
  const count = serialNumberMap.get(name)
  if (count) {
    serialNumberMap.set(name, count + 1n)
    return count + 1n
  } else {
    serialNumberMap.set(name, 1n)
    return 1n
  }
}

export function createFreshVarType(name: string): M.Value {
  return createVarType(name, generateVarTypeSerialNumber(name))
}

export function varTypeName(value: M.Value): string {
  assert(isVarType(value))
  return M.asSymbolValue(M.asListValue(value).elements[1]).content
}

export function varTypeSerialNumber(value: M.Value): bigint {
  assert(isVarType(value))
  return M.asIntValue(M.asListValue(value).elements[2]).content
}

export function varTypeId(value: M.Value): string {
  assert(isVarType(value))
  const name = M.varTypeName(value)
  const serialNumber = M.varTypeSerialNumber(value)
  return `${name}.${serialNumber}`
}

export function varTypeEqual(x: M.Value, y: M.Value): boolean {
  return (
    varTypeName(x) === varTypeName(y) &&
    varTypeSerialNumber(x) === varTypeSerialNumber(y)
  )
}

// CanonicalLabelType

export function isCanonicalLabelType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 2 &&
    M.valueEqual(value.elements[0], M.SymbolValue("canonical-id")) &&
    M.isIntValue(value.elements[1])
  )
}

export function createCanonicalLabelType(serialNumber: bigint): M.Value {
  return M.ListValue([M.SymbolValue("canonical-id"), M.IntValue(serialNumber)])
}

export function canonicalLabelTypeSerialNumber(value: M.Value): bigint {
  assert(isCanonicalLabelType(value))
  return M.asIntValue(M.asListValue(value).elements[1]).content
}

// TypeType

export function isTypeType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 1 &&
    M.valueEqual(value.elements[0], M.SymbolValue("type"))
  )
}

export function createTypeType(): M.Value {
  return M.ListValue([M.SymbolValue("type")])
}

// LiteralType

export function isLiteralType(value: M.Value): boolean {
  return M.isAtomValue(value)
}

// AtomType

export function isAtomType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 2 &&
    M.valueEqual(value.elements[0], M.SymbolValue("atom")) &&
    M.isSymbolValue(value.elements[1])
  )
}

export function createAtomType(name: string): M.Value {
  return M.ListValue([M.SymbolValue("atom"), M.SymbolValue(name)])
}

export function atomTypeName(value: M.Value): string {
  assert(isAtomType(value))
  return M.asSymbolValue(M.asListValue(value).elements[1]).content
}

// ArrowType

export function isArrowType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("->")) &&
    M.isListValue(value.elements[1]) &&
    M.asListValue(value.elements[1]).elements.every(isType) &&
    isType(value.elements[2])
  )
}

export function createArrowType(
  argTypes: Array<M.Value>,
  retType: M.Value,
): M.Value {
  return M.ListValue([M.SymbolValue("->"), M.ListValue(argTypes), retType])
}

export function arrowTypeArgTypes(value: M.Value): Array<M.Value> {
  assert(isArrowType(value))
  return M.asListValue(M.asListValue(value).elements[1]).elements
}

export function arrowTypeRetType(value: M.Value): M.Value {
  assert(isArrowType(value))
  return M.asListValue(value).elements[2]
}

export function arrowTypeCurrying(value: M.Value): M.Value {
  if (isArrowType(value)) {
    const argTypes = arrowTypeArgTypes(value)
    const retType = arrowTypeRetType(value)

    if (argTypes.length === 0) {
      // we do not curry nullary arrow
      return createArrowType(argTypes, arrowTypeCurrying(retType))
    }

    if (argTypes.length === 1) {
      return createArrowType(argTypes, arrowTypeCurrying(retType))
    }

    const [firstArgType, ...restArgTypes] = argTypes
    return createArrowType(
      [firstArgType],
      arrowTypeCurrying(createArrowType(restArgTypes, retType)),
    )
  }

  return value
}

export function arrowTypeUncurrying(value: M.Value): M.Value {
  if (isArrowType(value)) {
    const argTypes = arrowTypeArgTypes(value)
    const retType = arrowTypeRetType(value)

    if (argTypes.length === 0) {
      // we do not uncurry nullary arrow
      return createArrowType(argTypes, arrowTypeUncurrying(retType))
    }

    if (isArrowType(retType)) {
      const retTypeArgTypes = arrowTypeArgTypes(retType)
      const retTypeRetType = arrowTypeRetType(retType)

      if (retTypeArgTypes.length === 0) {
        // we do not uncurry nullary arrow
        return createArrowType(argTypes, arrowTypeUncurrying(retType))
      }

      return createArrowType(
        [...argTypes, ...retTypeArgTypes],
        arrowTypeUncurrying(retTypeRetType),
      )
    } else {
      return value
    }
  }

  return value
}

// TauType

export function isTauType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    M.valueEqual(value.elements[0], M.SymbolValue("tau")) &&
    value.elements.slice(1).every(isType)
  )
}

export function createTauType(elementTypes: Array<M.Value>): M.Value {
  return M.ListValue([M.SymbolValue("tau"), ...elementTypes])
}

export function tauTypeElementTypes(value: M.Value): Array<M.Value> {
  assert(isTauType(value))
  return M.asListValue(value).elements.slice(1)
}

// InterfaceType

export function isInterfaceType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    M.valueEqual(value.elements[0], M.SymbolValue("interface")) &&
    M.isRecordValue(value.elements[1]) &&
    Object.values(M.asRecordValue(value.elements[1]).attributes).every(isType)
  )
}

export function createInterfaceType(
  attributeTypes: Record<string, M.Value>,
): M.Value {
  return M.ListValue([
    M.SymbolValue("interface"),
    M.RecordValue(attributeTypes),
  ])
}

export function interfaceTypeAttributeTypes(
  value: M.Value,
): Record<string, M.Value> {
  if (!isInterfaceType(value)) {
    let message = `[interfaceTypeAttributeTypes] expecting InterfaceType`
    message += `\n  value: ${M.formatValue(value)}`
    throw new Error(message)
  }

  return M.asRecordValue(M.asListValue(value).elements[1]).attributes
}

// ExtendInterfaceType

export function isExtendInterfaceType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    M.valueEqual(value.elements[0], M.SymbolValue("extend-interface")) &&
    M.isType(value.elements[1]) &&
    M.isRecordValue(value.elements[2]) &&
    Object.values(M.asRecordValue(value.elements[2]).attributes).every(isType)
  )
}

export function createExtendInterfaceType(
  baseType: M.Value,
  attributeTypes: Record<string, M.Value>,
): M.Value {
  return M.ListValue([
    M.SymbolValue("extend-interface"),
    baseType,
    M.RecordValue(attributeTypes),
  ])
}

export function populateExtendInterfaceType(keys: Array<string>): M.Value {
  if (keys.length === 0) {
    return createFreshVarType("R")
  }

  return M.ListValue([
    M.SymbolValue("extend-interface"),
    createFreshVarType("R"),
    M.RecordValue(
      Object.fromEntries(keys.map((key) => [key, createFreshVarType("A")])),
    ),
  ])
}

export function extendInterfaceTypeBaseType(value: M.Value): M.Value {
  assert(isExtendInterfaceType(value))
  return M.asListValue(value).elements[1]
}

export function extendInterfaceTypeAttributeTypes(
  value: M.Value,
): Record<string, M.Value> {
  assert(isExtendInterfaceType(value))
  return M.asRecordValue(M.asListValue(value).elements[2]).attributes
}

export function extendInterfaceTypeMerge(value: M.Value): M.Value {
  assert(isExtendInterfaceType(value))
  const baseType = extendInterfaceTypeBaseType(value)
  const attributeTypes = extendInterfaceTypeAttributeTypes(value)
  if (isExtendInterfaceType(baseType)) {
    const newBaseType = extendInterfaceTypeMerge(baseType)
    const baseTypeBaseType = extendInterfaceTypeBaseType(newBaseType)
    const baseTypeAttributeTypes =
      extendInterfaceTypeAttributeTypes(newBaseType)
    return createExtendInterfaceType(baseTypeBaseType, {
      ...baseTypeAttributeTypes,
      ...attributeTypes,
    })
  } else {
    return value
  }
}

// DefinedInterfaceType

export function isDefinedInterfaceType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("defined-interface")) &&
    M.isDefinitionValue(value.elements[1]) &&
    M.isListValue(value.elements[2]) &&
    M.asListValue(value.elements[2]).elements.every(isType)
  )
}

export function createDefinedInterfaceType(
  definition: M.InterfaceDefinition,
  argTypes: Array<M.Value>,
): M.Value {
  return M.ListValue([
    M.SymbolValue("defined-interface"),
    M.DefinitionValue(definition),
    M.ListValue(argTypes),
  ])
}

export function definedInterfaceTypeDefinition(
  value: M.Value,
): M.InterfaceDefinition {
  assert(isDefinedInterfaceType(value))
  const definition = M.asDefinitionValue(
    M.asListValue(value).elements[1],
  ).definition
  assert(definition.kind === "InterfaceDefinition")
  return definition
}

export function definedInterfaceTypeArgTypes(value: M.Value): Array<M.Value> {
  assert(isDefinedInterfaceType(value))
  return M.asListValue(M.asListValue(value).elements[2]).elements
}

export function definedInterfaceTypeUnfold(value: M.Value): M.Value {
  assert(M.isDefinedInterfaceType(value))
  const definition = definedInterfaceTypeDefinition(value)
  const argTypes = definedInterfaceTypeArgTypes(value)

  const env = M.envPutMany(
    M.emptyEnv(),
    definition.interfaceConstructor.parameters,
    argTypes,
  )

  const attributeTypes = recordMapValue(
    definition.attributeTypes,
    (attributeType) => M.evaluate(definition.mod, env, attributeType),
  )

  return M.createInterfaceType(attributeTypes)
}

// ListType

export function isListType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 2 &&
    M.valueEqual(value.elements[0], M.SymbolValue("list")) &&
    isType(value.elements[1])
  )
}

export function createListType(elementType: M.Value): M.Value {
  return M.ListValue([M.SymbolValue("list"), elementType])
}

export function listTypeElementType(value: M.Value): M.Value {
  assert(isListType(value))
  return M.asListValue(value).elements[1]
}

// SetType

export function isSetType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 2 &&
    M.valueEqual(value.elements[0], M.SymbolValue("set")) &&
    isType(value.elements[1])
  )
}

export function createSetType(elementType: M.Value): M.Value {
  return M.ListValue([M.SymbolValue("set"), elementType])
}

export function setTypeElementType(value: M.Value): M.Value {
  assert(isSetType(value))
  return M.asListValue(value).elements[1]
}

// HashType

export function isHashType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("hash")) &&
    isType(value.elements[1]) &&
    isType(value.elements[2])
  )
}

export function createHashType(keyType: M.Value, valueType: M.Value): M.Value {
  return M.ListValue([M.SymbolValue("hash"), keyType, valueType])
}

export function hashTypeKeyType(value: M.Value): M.Value {
  assert(isHashType(value))
  return M.asListValue(value).elements[1]
}

export function hashTypeValueType(value: M.Value): M.Value {
  assert(isHashType(value))
  return M.asListValue(value).elements[2]
}

// DefinedDataType

export function isDefinedDataType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("defined-data")) &&
    M.isDefinitionValue(value.elements[1]) &&
    M.isListValue(value.elements[2]) &&
    M.asListValue(value.elements[2]).elements.every(isType)
  )
}

export function createDefinedDataType(
  definition: M.DataDefinition,
  argTypes: Array<M.Value>,
): M.Value {
  return M.ListValue([
    M.SymbolValue("defined-data"),
    M.DefinitionValue(definition),
    M.ListValue(argTypes),
  ])
}

export function definedDataTypeDefinition(value: M.Value): M.DataDefinition {
  assert(isDefinedDataType(value))
  const definition = M.asDefinitionValue(
    M.asListValue(value).elements[1],
  ).definition
  assert(definition.kind === "DataDefinition")
  return definition
}

export function definedDataTypeArgTypes(value: M.Value): Array<M.Value> {
  assert(isDefinedDataType(value))
  return M.asListValue(M.asListValue(value).elements[2]).elements
}

export function definedDataTypeUnfold(value: M.Value): M.Value {
  assert(M.isDefinedDataType(value))
  const definition = M.definedDataTypeDefinition(value)
  const argTypes = M.definedDataTypeArgTypes(value)

  const env = M.envPutMany(
    M.emptyEnv(),
    definition.dataTypeConstructor.parameters,
    argTypes,
  )

  const variantTypes: Record<string, M.Value> = {}
  for (const dataConstructor of definition.dataConstructors) {
    const elementTypes = dataConstructor.fields.map((field) =>
      M.evaluate(definition.mod, env, field.type),
    )

    variantTypes[dataConstructor.name] = M.createTauType([
      M.SymbolValue(dataConstructor.name),
      ...elementTypes,
    ])
  }

  return M.createSumType(variantTypes)
}

// SumType

export function isSumType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 2 &&
    M.valueEqual(value.elements[0], M.SymbolValue("sum")) &&
    M.isRecordValue(value.elements[1]) &&
    Object.values(M.asRecordValue(value.elements[1]).attributes).every(isType)
  )
}

export function createSumType(variantTypes: Record<string, M.Value>): M.Value {
  return M.ListValue([M.SymbolValue("sum"), M.RecordValue(variantTypes)])
}

export function sumTypeVariantTypes(value: M.Value): Record<string, M.Value> {
  assert(isSumType(value))
  return M.asRecordValue(M.asListValue(value).elements[1]).attributes
}

// PolymorphicType

export function isPolymorphicType(value: M.Value): boolean {
  return (
    M.isListValue(value) &&
    value.elements.length === 3 &&
    M.valueEqual(value.elements[0], M.SymbolValue("polymorphic")) &&
    M.isListValue(value.elements[1]) &&
    M.asListValue(value.elements[1]).elements.every(M.isVarType) &&
    M.isType(value.elements[2])
  )
}

export function createPolymorphicType(
  varTypes: Array<M.Value>,
  bodyType: M.Value,
): M.Value {
  return M.ListValue([
    M.SymbolValue("polymorphic"),
    M.ListValue(varTypes),
    bodyType,
  ])
}

export function polymorphicTypeVarTypes(value: M.Value): Array<M.Value> {
  assert(isPolymorphicType(value))
  return M.asListValue(M.asListValue(value).elements[1]).elements
}

export function polymorphicTypeBodyType(value: M.Value): M.Value {
  assert(isPolymorphicType(value))
  return M.asListValue(value).elements[2]
}

export function polymorphicTypeFreshSelf(value: M.Value): M.Value {
  assert(isPolymorphicType(value))
  const varTypes = polymorphicTypeVarTypes(value)
  const bodyType = polymorphicTypeBodyType(value)
  const newVarTypes = varTypes.map((varType) =>
    createFreshVarType(varTypeName(varType)),
  )
  const subst = M.substExtendMany(M.emptySubst(), varTypes, newVarTypes)
  const newBodyType = M.substApplyToType(subst, bodyType)
  return createPolymorphicType(newVarTypes, newBodyType)
}

export function polymorphicTypeFreshBodyType(value: M.Value): M.Value {
  return polymorphicTypeBodyType(polymorphicTypeFreshSelf(value))
}

export function polymorphicTypePrettifyVarTypes(value: M.Value): M.Value {
  assert(isPolymorphicType(value))
  const varTypes = polymorphicTypeVarTypes(value)
  const bodyType = polymorphicTypeBodyType(value)
  const newVarTypes = range(varTypes.length).map((i) =>
    createVarType(generatePrettyTypeVariableName(i), BigInt(0)),
  )
  const subst = M.substExtendMany(M.emptySubst(), varTypes, newVarTypes)
  const newBodyType = M.substApplyToType(subst, bodyType)
  return createPolymorphicType(newVarTypes, newBodyType)
}

const prettyTypeVariableNames = [
  "A",
  "B",
  "C",
  "D",
  "E",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "Q",
  "R",
  "S",
  "T",
]

export function generatePrettyTypeVariableName(n: number): string {
  const found = prettyTypeVariableNames[n]
  if (found) {
    return found
  } else {
    return `T${n}`
  }
}
