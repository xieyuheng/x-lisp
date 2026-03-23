import * as Values from "./index.ts"
import { type Value } from "./index.ts"

export function valueSame(lhs: Value, rhs: Value): boolean {
  if (Values.isAtomValue(lhs) && Values.isAtomValue(rhs)) {
    return lhs.kind === rhs.kind && lhs.content === rhs.content
  }

  return lhs === rhs
}
