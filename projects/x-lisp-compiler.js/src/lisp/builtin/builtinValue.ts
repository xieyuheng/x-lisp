import { definePrimitiveFunction, provide } from "../define/index.ts"
import { equal, same } from "../equal/index.ts"
import { type Mod } from "../mod/index.ts"
import * as Values from "../value/index.ts"

export function builtinValue(mod: Mod) {
  provide(mod, ["same?", "equal?",  "any?"])

  definePrimitiveFunction(mod, "same?", 2, (lhs, rhs) => {
    return Values.BoolValue(same(lhs, rhs))
  })

  definePrimitiveFunction(mod, "equal?", 2, (lhs, rhs) => {
    return Values.BoolValue(equal(lhs, rhs))
  })

  definePrimitiveFunction(mod, "any?", 1, (value) => {
    return Values.BoolValue(true)
  })
}
