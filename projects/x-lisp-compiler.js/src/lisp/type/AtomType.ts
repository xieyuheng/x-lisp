import * as L from "../index.ts"

export function isAtomType(value: L.Value): boolean {
  return (
    L.isTaelValue(value) &&
    value.elements.length === 2 &&
    L.equal(value.elements[0], L.HashtagValue("atom")) &&
    L.isHashtagValue(value.elements[1])
  )
}
