import { definePrimitiveFunction } from "../define/index.ts"
import { equal, same } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function aboutValue(mod: Mod) {
  definePrimitiveFunction(mod, "same?", 2, (lhs, rhs) => {
    return Values.Bool(same(lhs, rhs))
  })

  definePrimitiveFunction(mod, "equal?", 2, (lhs, rhs) => {
    return Values.Bool(equal(lhs, rhs))
  })

  definePrimitiveFunction(mod, "atom?", 1, (value) => {
    return Values.Bool(Values.isAtom(value))
  })

  definePrimitiveFunction(mod, "anything?", 1, (value) => {
    return Values.Bool(true)
  })
}
