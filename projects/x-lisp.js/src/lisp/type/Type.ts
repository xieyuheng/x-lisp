import { stringToSubscript } from "@xieyuheng/helpers.js/string"
import assert from "node:assert"
import * as L from "../index.ts"

export function isType(value: L.Value): boolean {
  return (
    isVarType(value) ||
    isAnyType(value) ||
    isLiteralType(value) ||
    isAtomType(value) ||
    isArrowType(value) ||
    isTauType(value) ||
    isClassType(value) ||
    isListType(value) ||
    isSetType(value) ||
    isHashType(value) ||
    isDatatypeType(value) ||
    isDisjointUnionType(value) ||
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

// AnyType

export function isAnyType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 1 &&
    L.equal(value.elements[0], L.SymbolValue("any"))
  )
}

export function createAnyType(): L.Value {
  return L.ListValue([L.SymbolValue("any")])
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

// ClassType

export function isClassType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    L.equal(value.elements[0], L.SymbolValue("class")) &&
    L.isObjectValue(value.elements[1]) &&
    Object.values(L.asObjectValue(value.elements[1]).attributes).every(isType)
  )
}

export function createClassType(
  attributeTypes: Record<string, L.Value>,
): L.Value {
  return L.ListValue([L.SymbolValue("class"), L.ObjectValue(attributeTypes)])
}

export function classTypeAttributeTypes(
  value: L.Value,
): Record<string, L.Value> {
  assert(isClassType(value))
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

  return L.createDisjointUnionType(variantTypes)
}

// DisjointUnionType

export function isDisjointUnionType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.SymbolValue("disjoint-union")) &&
    L.isObjectValue(value.elements[1]) &&
    Object.values(L.asObjectValue(value.elements[1]).attributes).every(isType)
  )
}

export function createDisjointUnionType(
  variantTypes: Record<string, L.Value>,
): L.Value {
  return L.ListValue([
    L.SymbolValue("disjoint-union"),
    L.ObjectValue(variantTypes),
  ])
}

export function disjointUnionTypeVariantTypes(
  value: L.Value,
): Record<string, L.Value> {
  assert(isDisjointUnionType(value))
  return L.asObjectValue(L.asListValue(value).elements[1]).attributes
}

// PolymorphicType

export function isPolymorphicType(value: L.Value): boolean {
  return (
    L.isListValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.SymbolValue("polymorphic")) &&
    L.isListValue(value.elements[1]) &&
    L.asListValue(value.elements[1]).elements.every(L.isSymbolValue) &&
    L.isClosureValue(value.elements[2])
  )
}

export function createPolymorphicType(
  parameters: Array<string>,
  closure: L.ClosureValue,
): L.Value {
  return L.ListValue([
    L.SymbolValue("polymorphic"),
    L.ListValue(parameters.map(L.SymbolValue)),
    closure,
  ])
}

export function polymorphicTypeParameters(value: L.Value): Array<string> {
  assert(isPolymorphicType(value))
  return L.asListValue(L.asListValue(value).elements[1]).elements.map(
    (element) => L.asSymbolValue(element).content,
  )
}

export function polymorphicTypeClosure(value: L.Value): L.ClosureValue {
  assert(isPolymorphicType(value))
  return L.asClosureValue(L.asListValue(value).elements[2])
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

export function polymorphicTypeUnfold(value: L.Value): L.Value {
  assert(isPolymorphicType(value))
  const parameters = polymorphicTypeParameters(value)
  const closure = polymorphicTypeClosure(value)
  const args = parameters.map((name) =>
    createVarType(name, generateVarTypeSerialNumber(name)),
  )
  return L.apply(closure, args)
}
