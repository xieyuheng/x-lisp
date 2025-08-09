import { arrayZip } from "../../utils/array/arrayZip.ts"
import { arrowNormalize, type Attributes, type Value } from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  if (lhs.kind === "Tael" && rhs.kind === "Tael") {
    return (
      equalValues(lhs.elements, rhs.elements) &&
      equalAttributes(lhs.attributes, rhs.attributes)
    )
  }

  if (lhs.kind === "CurriedPrimFn" && rhs.kind === "CurriedPrimFn") {
    return equal(lhs.primFn, rhs.primFn) && equalValues(lhs.args, rhs.args)
  }

  if (lhs.kind === "CurriedLambda" && rhs.kind === "CurriedLambda") {
    return equal(lhs.lambda, rhs.lambda) && equalValues(lhs.args, rhs.args)
  }

  if (lhs.kind === "DataPredicate" && rhs.kind === "DataPredicate") {
    return same(lhs, rhs)
  }

  if (
    lhs.kind === "CurriedDataPredicate" &&
    rhs.kind === "CurriedDataPredicate"
  ) {
    return (
      equal(lhs.predicate, rhs.predicate) && equalValues(lhs.args, rhs.args)
    )
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
    return equalValues(lhs.args, rhs.args) && equal(lhs.ret, rhs.ret)
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
  if (Object.keys(lhs).length !== Object.keys(rhs).length) return false

  for (const k of Object.keys(lhs)) {
    const l = lhs[k]
    const r = rhs[k]
    if (r === undefined) return false
    if (!equal(l, r)) return false
  }

  return true
}
