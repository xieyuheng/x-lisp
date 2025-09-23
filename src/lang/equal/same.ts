import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function same(lhs: Value, rhs: Value): boolean {
  if (Values.isAtom(lhs) && Values.isAtom(rhs)) {
    return lhs.kind === rhs.kind && lhs.content === rhs.content
  }

  if (lhs.kind === "Null" && rhs.kind === "Null") {
    return true
  }

  return lhs === rhs
}
