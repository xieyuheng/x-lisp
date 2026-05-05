import { arrayZip } from "@xieyuheng/helpers.js/array"
import * as Values from "./index.ts"
import { type Value } from "./index.ts"
import { valueSame } from "./valueSame.ts"

export function valueEqual(lhs: Value, rhs: Value): boolean {
  if (lhs.kind === "ListValue" && rhs.kind === "ListValue") {
    return valueEqualMany(lhs.elements, rhs.elements)
  }

  if (lhs.kind === "RecordValue" && rhs.kind === "RecordValue") {
    return valueEqualAttributes(lhs.attributes, rhs.attributes)
  }

  if (lhs.kind === "SetValue" && rhs.kind === "SetValue") {
    return (
      Values.setValueElements(lhs).every((left) =>
        Values.setValueHas(rhs, left),
      ) &&
      Values.setValueElements(rhs).every((right) =>
        Values.setValueHas(lhs, right),
      )
    )
  }

  if (lhs.kind === "HashValue" && rhs.kind === "HashValue") {
    return valueEqualHash(lhs, rhs)
  }

  if (lhs.kind === "CurryValue" && rhs.kind === "CurryValue") {
    return (
      valueEqual(lhs.target, rhs.target) && valueEqualMany(lhs.args, rhs.args)
    )
  }

  if (lhs.kind === "DefinitionValue" && rhs.kind === "DefinitionValue") {
    return lhs.definition === rhs.definition
  }

  return valueSame(lhs, rhs)
}

function valueEqualMany(lhs: Array<Value>, rhs: Array<Value>): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => valueEqual(l, r))
  )
}

function valueEqualAttributes(
  lhs: Record<string, Value>,
  rhs: Record<string, Value>,
): boolean {
  const leftValues = Object.values(lhs)
  const rightValues = Object.values(rhs)
  if (leftValues.length !== rightValues.length) return false

  for (const k of Object.keys(lhs)) {
    if (rhs[k] === undefined) return false
    if (!valueEqual(lhs[k], rhs[k])) return false
  }

  return true
}

function valueEqualHash(lhs: Values.HashValue, rhs: Values.HashValue): boolean {
  const lhsEntries = Values.hashValueEntries(lhs)
  const rhsEntries = Values.hashValueEntries(rhs)
  if (lhsEntries.length !== rhsEntries.length) return false

  for (const lhsEntry of lhsEntries) {
    const lhsValue = lhsEntry.value
    const rhsValue = Values.hashValueGet(rhs, lhsEntry.key)
    if (rhsValue === undefined) return false
    if (!valueEqual(lhsValue, rhsValue)) return false
  }

  return true
}
