import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  if (lhs.kind === "ListValue" && rhs.kind === "ListValue") {
    return equalValues(lhs.elements, rhs.elements)
  }

  if (lhs.kind === "ObjectValue" && rhs.kind === "ObjectValue") {
    return equalAttributes(lhs.attributes, rhs.attributes)
  }

  if (lhs.kind === "SetValue" && rhs.kind === "SetValue") {
    return (
      Values.setElements(lhs).every((left) => Values.setHas(rhs, left)) &&
      Values.setElements(rhs).every((right) => Values.setHas(lhs, right))
    )
  }

  if (lhs.kind === "HashValue" && rhs.kind === "HashValue") {
    return equalHash(lhs, rhs)
  }

  if (lhs.kind === "CurryValue" && rhs.kind === "CurryValue") {
    return equal(lhs.target, rhs.target) && equalValues(lhs.args, rhs.args)
  }

  if (lhs.kind === "DefinitionValue" && rhs.kind === "DefinitionValue") {
    return lhs.definition === rhs.definition
  }

  return same(lhs, rhs)
}

function equalValues(lhs: Array<Value>, rhs: Array<Value>): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => equal(l, r))
  )
}

function equalAttributes(
  lhs: Record<string, Value>,
  rhs: Record<string, Value>,
): boolean {
  const leftValues = Object.values(lhs)
  const rightValues = Object.values(rhs)
  if (leftValues.length !== rightValues.length) return false

  for (const k of Object.keys(lhs)) {
    if (rhs[k] === undefined) return false
    if (!equal(lhs[k], rhs[k])) return false
  }

  return true
}

function equalHash(lhs: Values.HashValue, rhs: Values.HashValue): boolean {
  const lhsEntries = Values.hashEntries(lhs)
  const rhsEntries = Values.hashEntries(rhs)
  if (lhsEntries.length !== rhsEntries.length) return false

  for (const lhsEntry of lhsEntries) {
    const lhsValue = lhsEntry.value
    const rhsValue = Values.hashGet(rhs, lhsEntry.key)
    if (rhsValue === undefined) return false
    if (!equal(lhsValue, rhsValue)) return false
  }

  return true
}
