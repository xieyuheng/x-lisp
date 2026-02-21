import assert from "node:assert"
import * as L from "../index.ts"

export function isType(value: L.Value): boolean {
  return isLiteralType(value) || isAtomType(value) || isArrowType(value)
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
  return L.TaelValue([L.HashtagValue("atom"), L.HashtagValue(name)], {})
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
    value.elements.every(isType) &&
    L.isTaelValue(value.elements[1]) &&
    isType(value.elements[2])
  )
}
