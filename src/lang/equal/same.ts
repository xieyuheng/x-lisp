import * as Values from "../value/index.ts"
import { type Value } from "../value/index.ts"

export function same(lhs: Value, rhs: Value): boolean {
  lhs = Values.lazyActiveDeep(lhs)
  rhs = Values.lazyActiveDeep(rhs)

  if (Values.isAtom(lhs) && Values.isAtom(rhs)) {
    return lhs.kind === rhs.kind && lhs.content === rhs.content
  }

  return lhs === rhs
}
