import { range } from "@xieyuheng/helpers.js/range"
import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import assert from "node:assert"
import * as L from "../index.ts"

export function isType(value: L.Value): boolean {
  return (
    isVarType(value) ||
    isCanonicalLabelType(value) ||
    isTypeType(value) ||
    isLiteralType(value) ||
    isAtomType(value) ||
    isArrowType(value) ||
    isTauType(value) ||
    isInterfaceType(value) ||
    isListType(value) ||
    isSetType(value) ||
    isHashType(value) ||
    isDatatypeType(value) ||
    isSumType(value) ||
    isPolymorphicType(value)
  )
}

// VarType

export function isVarType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("var")) &&
    L.isSymbolValue(value.elements[1]) &&
    L.isIntValue(value.elements[2])
  )
}

export function createVarType(name: string, serialNumber: bigint): L.Value {
  return L.ListValue([
    L.SymbolValue("var"),
    L.SymbolValue(name),
    L.IntValue(serialNumber),
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

export function createFreshVarType(name: string): L.Value {
  return createVarType(name, generateVarTypeSerialNumber(name))
}

export function varTypeName(value: L.Value): string {
  assert(isVarType(value))
  return L.asSymbolValue(L.asListValue(value).elements[1]).content
}

export function varTypeSerialNumber(value: L.Value): bigint {
  assert(isVarType(value))
  return L.asIntValue(L.asListValue(value).elements[2]).content
}

export function varTypeId(value: L.Value): string {
  assert(isVarType(value))
  return (
    L.varTypeName(value) +
    stringToSubscript(L.varTypeSerialNumber(value).toString())
  )
}

export function varTypeEqual(x: L.Value, y: L.Value): boolean {
  return (
    varTypeName(x) === varTypeName(y) &&
    varTypeSerialNumber(x) === varTypeSerialNumber(y)
  )
}

// CanonicalLabelType

export function isCanonicalLabelType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("canonical-id")) &&
    L.isIntValue(value.elements[1])
  )
}

export function createCanonicalLabelType(serialNumber: bigint): L.Value {
  return L.ListValue([L.SymbolValue("canonical-id"), L.IntValue(serialNumber)])
}

export function canonicalLabelTypeSerialNumber(value: L.Value): bigint {
  assert(isCanonicalLabelType(value))
  return L.asIntValue(L.asListValue(value).elements[1]).content
}

// TypeType

export function isTypeType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 1 &&
    L.equal(value.elements[0], L.SymbolValue("type"))
  )
}

export function createTypeType(): L.Value {
  return L.ListValue([L.SymbolValue("type")])
}

// LiteralType

export function isLiteralType(value: L.Value): boolean {
  return L.isAtomValue(value)
}

// AtomType

export function isAtomType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("atom")) &&
    L.isSymbolValue(value.elements[1])
  )
}

export function createAtomType(name: string): L.Value {
  return L.ListValue([L.SymbolValue("atom"), L.SymbolValue(name)])
}

export function atomTypeName(value: L.Value): string {
  assert(isAtomType(value))
  return L.asSymbolValue(L.asListValue(value).elements[1]).content
}

// ArrowType

export function isArrowType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("->")) &&
    L.isListValue(value.elements[1]) &&
    L.asListValue(value.elements[1]).elements.every(isType) &&
    isType(value.elements[2])
  )
}

export function createArrowType(
  argTypes: Array<L.Value>,
  retType: L.Value,
): L.Value {
  return L.ListValue([L.SymbolValue("->"), L.ListValue(argTypes), retType])
}

export function arrowTypeArgTypes(value: L.Value): Array<L.Value> {
  assert(isArrowType(value))
  return L.asListValue(L.asListValue(value).elements[1]).elements
}

export function arrowTypeRetType(value: L.Value): L.Value {
  assert(isArrowType(value))
  return L.asListValue(value).elements[2]
}

export function arrowTypeNormalize(value: L.Value): L.Value {
  if (isArrowType(value)) {
    const argTypes = arrowTypeArgTypes(value)
    const retType = arrowTypeRetType(value)

    if (argTypes.length === 0) {
      // we do not normalize nullary arrow
      return createArrowType(argTypes, arrowTypeNormalize(retType))
    }

    if (argTypes.length === 1) {
      return createArrowType(argTypes, arrowTypeNormalize(retType))
    }

    const [firstArgType, ...restArgTypes] = argTypes
    return createArrowType(
      [firstArgType],
      arrowTypeNormalize(createArrowType(restArgTypes, retType)),
    )
  }

  return value
}

// TauType

export function isTauType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    L.equal(value.elements[0], L.SymbolValue("tau")) &&
    value.elements.slice(1).every(isType)
  )
}

export function createTauType(elementTypes: Array<L.Value>): L.Value {
  return L.ListValue([L.SymbolValue("tau"), ...elementTypes])
}

export function tauTypeElementTypes(value: L.Value): Array<L.Value> {
  assert(isTauType(value))
  return L.asListValue(value).elements.slice(1)
}

// InterfaceType

export function isInterfaceType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    L.equal(value.elements[0], L.SymbolValue("interface")) &&
    L.isObjectValue(value.elements[1]) &&
    Object.values(L.asObjectValue(value.elements[1]).attributes).every(isType)
  )
}

export function createInterfaceType(
  attributeTypes: Record<string, L.Value>,
): L.Value {
  return L.ListValue([L.SymbolValue("interface"), L.ObjectValue(attributeTypes)])
}

export function interfaceTypeAttributeTypes(
  value: L.Value,
): Record<string, L.Value> {
  assert(isInterfaceType(value))
  return L.asObjectValue(L.asListValue(value).elements[1]).attributes
}

// ListType

export function isListType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("list")) &&
    isType(value.elements[1])
  )
}

export function createListType(elementType: L.Value): L.Value {
  return L.ListValue([L.SymbolValue("list"), elementType])
}

export function listTypeElementType(value: L.Value): L.Value {
  assert(isListType(value))
  return L.asListValue(value).elements[1]
}

// SetType

export function isSetType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("set")) &&
    isType(value.elements[1])
  )
}

export function createSetType(elementType: L.Value): L.Value {
  return L.ListValue([L.SymbolValue("set"), elementType])
}

export function setTypeElementType(value: L.Value): L.Value {
  assert(isSetType(value))
  return L.asListValue(value).elements[1]
}

// HashType

export function isHashType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("hash")) &&
    isType(value.elements[1]) &&
    isType(value.elements[2])
  )
}

export function createHashType(keyType: L.Value, valueType: L.Value): L.Value {
  return L.ListValue([L.SymbolValue("hash"), keyType, valueType])
}

export function hashTypeKeyType(value: L.Value): L.Value {
  assert(isHashType(value))
  return L.asListValue(value).elements[1]
}

export function hashTypeValueType(value: L.Value): L.Value {
  assert(isHashType(value))
  return L.asListValue(value).elements[2]
}

// DatatypeType

export function isDatatypeType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("datatype")) &&
    L.isDefinitionValue(value.elements[1]) &&
    L.isListValue(value.elements[2]) &&
    L.asListValue(value.elements[2]).elements.every(isType)
  )
}

export function createDatatypeType(
  definition: L.DatatypeDefinition,
  argTypes: Array<L.Value>,
): L.Value {
  return L.ListValue([
    L.SymbolValue("datatype"),
    L.DefinitionValue(definition),
    L.ListValue(argTypes),
  ])
}

export function datatypeTypeDatatypeDefinition(
  value: L.Value,
): L.DatatypeDefinition {
  assert(isDatatypeType(value))
  const definition = L.asDefinitionValue(
    L.asListValue(value).elements[1],
  ).definition
  assert(definition.kind === "DatatypeDefinition")
  return definition
}

export function datatypeTypeArgTypes(value: L.Value): Array<L.Value> {
  assert(isDatatypeType(value))
  return L.asListValue(L.asListValue(value).elements[2]).elements
}

export function datatypeTypeUnfold(datatypeType: L.Value): L.Value {
  assert(L.isDatatypeType(datatypeType))
  const definition = L.datatypeTypeDatatypeDefinition(datatypeType)
  const argTypes = L.datatypeTypeArgTypes(datatypeType)

  const env = L.envPutMany(
    L.emptyEnv(),
    definition.datatypeConstructor.parameters,
    argTypes,
  )

  const variantTypes: Record<string, L.Value> = {}
  for (const dataConstructor of definition.dataConstructors) {
    const elementTypes = dataConstructor.fields.map((field) =>
      L.evaluate(definition.mod, env, field.type),
    )

    variantTypes[dataConstructor.name] = L.createTauType([
      L.SymbolValue(dataConstructor.name),
      ...elementTypes,
    ])
  }

  return L.createSumType(variantTypes)
}

// SumType

export function isSumType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("sum")) &&
    L.isObjectValue(value.elements[1]) &&
    Object.values(L.asObjectValue(value.elements[1]).attributes).every(isType)
  )
}

export function createSumType(variantTypes: Record<string, L.Value>): L.Value {
  return L.ListValue([L.SymbolValue("sum"), L.ObjectValue(variantTypes)])
}

export function sumTypeVariantTypes(value: L.Value): Record<string, L.Value> {
  assert(isSumType(value))
  return L.asObjectValue(L.asListValue(value).elements[1]).attributes
}

// PolymorphicType

export function isPolymorphicType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("polymorphic")) &&
    L.isListValue(value.elements[1]) &&
    L.asListValue(value.elements[1]).elements.every(L.isVarType) &&
    L.isType(value.elements[2])
  )
}

export function createPolymorphicType(
  varTypes: Array<L.Value>,
  bodyType: L.Value,
): L.Value {
  return L.ListValue([
    L.SymbolValue("polymorphic"),
    L.ListValue(varTypes),
    bodyType,
  ])
}

export function polymorphicTypeVarTypes(value: L.Value): Array<L.Value> {
  assert(isPolymorphicType(value))
  return L.asListValue(L.asListValue(value).elements[1]).elements
}

export function polymorphicTypeBodyType(value: L.Value): L.Value {
  assert(isPolymorphicType(value))
  return L.asListValue(value).elements[2]
}

export function polymorphicTypeFreshSelf(value: L.Value): L.Value {
  assert(isPolymorphicType(value))
  const varTypes = polymorphicTypeVarTypes(value)
  const bodyType = polymorphicTypeBodyType(value)
  const newVarTypes = varTypes.map((varType) =>
    createFreshVarType(varTypeName(varType)),
  )
  const subst = L.substExtendMany(L.emptySubst(), varTypes, newVarTypes)
  const newBodyType = L.substApplyToType(subst, bodyType)
  return createPolymorphicType(newVarTypes, newBodyType)
}

export function polymorphicTypeFreshBodyType(value: L.Value): L.Value {
  return polymorphicTypeBodyType(polymorphicTypeFreshSelf(value))
}

export function polymorphicTypePrettifyVarTypes(value: L.Value): L.Value {
  assert(isPolymorphicType(value))
  const varTypes = polymorphicTypeVarTypes(value)
  const bodyType = polymorphicTypeBodyType(value)
  const newVarTypes = range(varTypes.length).map((i) =>
    createVarType(generatePrettyTypeVariableName(i), BigInt(0)),
  )
  const subst = L.substExtendMany(L.emptySubst(), varTypes, newVarTypes)
  const newBodyType = L.substApplyToType(subst, bodyType)
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
