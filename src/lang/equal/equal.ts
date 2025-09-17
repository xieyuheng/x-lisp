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
      lhs.elements.every((left) =>
        Values.valueArrayMember(left, Values.asSet(rhs).elements),
      ) &&
      rhs.elements.every((right) =>
        Values.valueArrayMember(right, Values.asSet(lhs).elements),
      )
    )
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

  if (lhs.kind === "Data" && rhs.kind === "Data") {
    return (
      equal(lhs.constructor, rhs.constructor) &&
      equalValues(lhs.elements, rhs.elements)
    )
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
  const leftValues = Object.values(lhs).filter((value) => value.kind !== "Null")

  const rightValues = Object.values(rhs).filter(
    (value) => value.kind !== "Null",
  )

  if (leftValues.length !== rightValues.length) return false

  for (const k of Object.keys(lhs)) {
    const l = lhs[k]
    const r = rhs[k]

    if (r === undefined && l.kind === "Null") {
      continue
    } else if (equal(l, r)) {
      continue
    } else {
      return false
    }
  }

  return true
}
