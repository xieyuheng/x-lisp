import assert from "node:assert"
import * as L from "../index.ts"

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
