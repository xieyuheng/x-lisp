import { arrayZip } from "../../utils/array/arrayZip.ts"
import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  lhs = Values.lazyActiveDeep(lhs)
  rhs = Values.lazyActiveDeep(rhs)

  if (lhs.kind === "Tael" && rhs.kind === "Tael") {
    return (
      lhs.elements.length !== rhs.elements.length &&
      arrayZip(lhs.elements, rhs.elements).every(([l, r]) => equal(l, r))
    )
  }

  return same(lhs, rhs)
}
