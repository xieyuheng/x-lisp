import { arrayZip } from "../../utils/array/arrayZip.ts"
import * as Values from "../value/index.ts"
import {
  arrowNormalize,
  lazyWalk,
  type Attributes,
  type Value,
} from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  lhs = lazyWalk(lhs)
  rhs = lazyWalk(rhs)

  if (lhs.kind === "Tael" && rhs.kind === "Tael") {
    return (
      equalValues(lhs.elements, rhs.elements) &&
      equalAttributes(lhs.attributes, rhs.attributes)
    )
  }

  if (lhs.kind === "Set" && rhs.kind === "Set") {
    return (
      Values.setElements(lhs).every((left) => Values.setHas(rhs, left)) &&
      Values.setElements(rhs).every((right) => Values.setHas(lhs, right))
    )
  }

  if (lhs.kind === "Hash" && rhs.kind === "Hash") {
    return equalHash(lhs, rhs)
  }

  if (lhs.kind === "Curried" && rhs.kind === "Curried") {
    return equal(lhs.target, rhs.target) && equalValues(lhs.args, rhs.args)
  }

  if (lhs.kind === "DataPredicate" && rhs.kind === "DataPredicate") {
    return same(lhs, rhs)
  }

  if (lhs.kind === "DataConstructor" && rhs.kind === "DataConstructor") {
    return same(lhs, rhs)
  }

  if (
    lhs.kind === "DataConstructorPredicate" &&
    rhs.kind === "DataConstructorPredicate"
  ) {
    return equal(lhs.constructor, rhs.constructor)
  }

  if (lhs.kind === "DataGetter" && rhs.kind === "DataGetter") {
    return (
      equal(lhs.constructor, rhs.constructor) &&
      lhs.fieldName === rhs.fieldName &&
      lhs.fieldIndex === rhs.fieldIndex
    )
  }

  if (lhs.kind === "Arrow" && rhs.kind === "Arrow") {
    lhs = arrowNormalize(lhs)
    rhs = arrowNormalize(rhs)
    return (
      equalValues(lhs.argSchemas, rhs.argSchemas) &&
      equal(lhs.retSchema, rhs.retSchema)
    )
  }

  if (lhs.kind === "The" && rhs.kind === "The") {
    return equal(lhs.schema, rhs.schema) && equal(lhs.value, rhs.value)
  }

  return same(lhs, rhs)
}

function equalValues(lhs: Array<Value>, rhs: Array<Value>): boolean {
  return (
    lhs.length === rhs.length &&
    arrayZip(lhs, rhs).every(([l, r]) => equal(l, r))
  )
}

function equalAttributes(lhs: Attributes, rhs: Attributes): boolean {
  const leftValues = Object.values(lhs).filter((value) => !Values.isNull(value))
  const rightValues = Object.values(rhs).filter(
    (value) => !Values.isNull(value),
  )
  if (leftValues.length !== rightValues.length) {
    return false
  }

  for (const k of Object.keys(lhs)) {
    const l = lhs[k]
    const r = rhs[k]

    if (r === undefined && Values.isNull(l)) {
      continue
    } else if (equal(l, r)) {
      continue
    } else {
      return false
    }
  }

  return true
}

function equalHash(lhs: Values.Hash, rhs: Values.Hash): boolean {
  const lhsEntries = Values.hashEntries(lhs)
  const rhsEntries = Values.hashEntries(rhs)
  if (lhsEntries.length !== rhsEntries.length) {
    return false
  }

  for (const lhsEntry of lhsEntries) {
    const lhsValue = lhsEntry.value
    const rhsValue = Values.hashGet(rhs, lhsEntry.key)
    if (rhsValue === undefined) {
      if (Values.isNull(lhsValue)) {
        continue
      } else {
        return false
      }
    } else if (equal(lhsValue, rhsValue)) {
      continue
    } else {
      return false
    }
  }

  return true
}
