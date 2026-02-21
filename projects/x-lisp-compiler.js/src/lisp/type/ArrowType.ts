import assert from "node:assert"
import * as L from "../index.ts"

export function isArrowType(value: L.Value): boolean {
  return (
    L.isTaelValue(value) &&
    value.elements.length === 3 &&
    L.equal(value.elements[0], L.HashtagValue("->")) &&
    L.isTaelValue(value.elements[1])
  )
}
