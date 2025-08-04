import { arrayZip } from "../../utils/array/arrayZip.ts"
import * as Values from "../value/index.ts"
import { type Attributes, type Value } from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  lhs = Values.lazyActiveDeep(lhs)
  rhs = Values.lazyActiveDeep(rhs)

  if (lhs.kind === "Tael" && rhs.kind === "Tael") {
    return (
      lhs.elements.length === rhs.elements.length &&
      arrayZip(lhs.elements, rhs.elements).every(([l, r]) => equal(l, r)) &&
      equalAttributes(lhs.attributes, rhs.attributes)
    )
  }

  if (lhs.kind === "CurriedPrimFn" && rhs.kind === "CurriedPrimFn") {
    return (
      same(lhs.primFn, rhs.primFn) &&
      arrayZip(lhs.args, rhs.args).every(([l, r]) => equal(l, r))
    )
  }

  return same(lhs, rhs)
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
