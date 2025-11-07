import { type Value } from "../value/index.ts"
import { same } from "./same.ts"

export function equal(lhs: Value, rhs: Value): boolean {
  return same(lhs, rhs)
}
