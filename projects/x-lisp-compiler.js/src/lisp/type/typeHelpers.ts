import assert from "node:assert"
import * as L from "../index.ts"

export function isType(value: L.Value): boolean {
  return (
    isLiteralType(value) ||
    isAtomType(value) ||
    isTauType(value) ||
    isArrowType(value) ||
    value.kind === "DatatypeValue" ||
    value.kind === "DisjointUnionValue"
  )
}

// LiteralType

export function isLiteralType(value: L.Value): boolean {
  return L.isAtomValue(value)
}

// AtomType

export function isAtomType(value: L.Value): boolean {
  return (
    L.isTaelValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.HashtagValue("atom")) &&
    L.isHashtagValue(value.elements[1])
  )
}

export function createAtomType(name: string): L.Value {
  return L.ListValue([L.HashtagValue("atom"), L.HashtagValue(name)])
}

export function atomTypeName(value: L.Value): string {
  assert(isAtomType(value))
  return L.asHashtagValue(L.asTaelValue(value).elements[1]).content
}

// ArrowType

export function isArrowType(value: L.Value): boolean {
  return (
    L.isTaelValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.HashtagValue("->")) &&
    L.isTaelValue(value.elements[1]) &&
    L.asTaelValue(value.elements[1]).elements.every(isType) &&
    isType(value.elements[2])
  )
}

export function createArrowType(
  argTypes: Array<L.Value>,
  retType: L.Value,
): L.Value {
  return L.ListValue([L.HashtagValue("->"), L.ListValue(argTypes), retType])
}

export function arrowTypeArgTypes(value: L.Value): Array<L.Value> {
  assert(isArrowType(value))
  return L.asTaelValue(L.asTaelValue(value).elements[1]).elements
}

export function arrowTypeRetType(value: L.Value): L.Value {
  assert(isArrowType(value))
  return L.asTaelValue(value).elements[2]
}

// TauType

export function isTauType(value: L.Value): boolean {
  return (
    L.isTaelValue(value) &&
    L.equal(value.elements[0], L.HashtagValue("tau")) &&
    value.elements.slice(1).every(isType) &&
    Object.values(value.attributes).every(isType)
  )
}

export function createTauType(
  elementTypes: Array<L.Value>,
  attributeTypes: Record<string, L.Value>,
): L.Value {
  return L.TaelValue([L.HashtagValue("tau"), ...elementTypes], attributeTypes)
}

export function tauTypeElementTypes(value: L.Value): Array<L.Value> {
  assert(isTauType(value))
  return L.asTaelValue(value).elements.slice(1)
}

export function tauTypeAttributeTypes(value: L.Value): Record<string, L.Value> {
  assert(isTauType(value))
  return L.asTaelValue(value).attributes
}
